import "dotenv/config";
import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";
import { hashPassword, signToken, verifyPassword } from "./auth.js";
import { requireAdmin, requireAuth } from "./middleware.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const firstOrNull = <T,>(value: T | T[] | null | undefined): T | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, username, password_hash, role, branch:branches(id, name)")
    .eq("username", username)
    .maybeSingle();

  if (error || !data) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const isValid = await verifyPassword(password, data.password_hash);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const branch = firstOrNull(data.branch);
  const token = signToken({
    sub: data.id,
    username: data.username,
    role: data.role,
    branchId: branch?.id ?? null,
    branchName: branch?.name ?? null,
  });

  res.json({
    token,
    user: {
      id: data.id,
      username: data.username,
      role: data.role,
      branchId: branch?.id ?? null,
      branch: branch?.name ?? null,
    },
  });
});

app.get("/auth/me", requireAuth, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role,
    branchId: req.user.branchId ?? null,
    branch: req.user.branchName ?? null,
  });
});

app.get("/branches", requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from("branches").select("id, name").order("name");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data ?? []);
});

app.post("/branches", requireAuth, requireAdmin, async (req, res) => {
  const { name } = req.body as { name?: string };

  if (!name || !name.trim()) {
    res.status(400).json({ error: "Branch name is required" });
    return;
  }

  const { data, error } = await supabase
    .from("branches")
    .insert({ name: name.trim() })
    .select("id, name")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create branch" });
    return;
  }

  res.status(201).json(data);
});

app.get("/users", requireAuth, requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, role, branch:branches(id, name), created_at")
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => {
      const branch = firstOrNull(row.branch);
      return {
      id: row.id,
      username: row.username,
      role: row.role,
      branchId: branch?.id ?? null,
      branch: branch?.name ?? null,
      createdAt: row.created_at,
      };
    })
  );
});

app.post("/users", requireAuth, requireAdmin, async (req, res) => {
  const { username, password, role, branchId } = req.body as {
    username?: string;
    password?: string;
    role?: "admin" | "cashier" | "client";
    branchId?: string | null;
  };

  if (!username || !password || !role) {
    res.status(400).json({ error: "Username, password, and role are required" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const { data, error } = await supabase
    .from("users")
    .insert({ username, password_hash: passwordHash, role, branch_id: branchId ?? null })
    .select("id, username, role, branch:branches(id, name), created_at")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create user" });
    return;
  }

  const createdBranch = firstOrNull(data.branch);
  res.status(201).json({
    id: data.id,
    username: data.username,
    role: data.role,
    branchId: createdBranch?.id ?? null,
    branch: createdBranch?.name ?? null,
    createdAt: data.created_at,
  });
});

app.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).end();
});

app.get("/barbers", requireAuth, async (req, res) => {
  let query = supabase.from("barbers").select("id, name, avatar, specialty, branch:branches(id, name)");

  if (req.user?.role === "client" && req.user.branchId) {
    query = query.eq("branch_id", req.user.branchId);
  }

  const { data, error } = await query.order("name");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => {
      const branch = firstOrNull(row.branch);
      return {
      id: row.id,
      name: row.name,
      avatar: row.avatar ?? row.name.slice(0, 2).toUpperCase(),
      specialty: row.specialty ?? "",
      branchId: branch?.id ?? null,
      branch: branch?.name ?? null,
      };
    })
  );
});

app.post("/barbers", requireAuth, requireAdmin, async (req, res) => {
  const { name, avatar, specialty, branchId } = req.body as {
    name?: string;
    avatar?: string;
    specialty?: string;
    branchId?: string | null;
  };

  if (!name) {
    res.status(400).json({ error: "Barber name is required" });
    return;
  }

  const { data, error } = await supabase
    .from("barbers")
    .insert({ name, avatar: avatar ?? name.slice(0, 2).toUpperCase(), specialty: specialty ?? null, branch_id: branchId ?? null })
    .select("id, name, avatar, specialty, branch:branches(id, name)")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create barber" });
    return;
  }

  const barberBranch = firstOrNull(data.branch);
  res.status(201).json({
    id: data.id,
    name: data.name,
    avatar: data.avatar ?? data.name.slice(0, 2).toUpperCase(),
    specialty: data.specialty ?? "",
    branchId: barberBranch?.id ?? null,
    branch: barberBranch?.name ?? null,
  });
});

app.get("/services", requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration, tax_rate, status")
    .order("name");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? "",
      price: Number(row.price),
      duration: row.duration,
      taxRate: Number(row.tax_rate),
      status: row.status,
    }))
  );
});

app.get("/services/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration, tax_rate, status, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  res.json({
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    price: Number(data.price),
    duration: data.duration,
    taxRate: Number(data.tax_rate),
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
});

app.post("/services", requireAuth, requireAdmin, async (req, res) => {
  const { name, description, price, duration, taxRate, status } = req.body as {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    taxRate?: number;
    status?: "active" | "inactive";
  };

  if (!name || !duration) {
    res.status(400).json({ error: "Name and duration are required" });
    return;
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      name,
      description: description ?? null,
      price: price ?? 0,
      duration,
      tax_rate: taxRate ?? 0,
      status: status ?? "active",
    })
    .select("id, name, description, price, duration, tax_rate, status")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create service" });
    return;
  }

  res.status(201).json({
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    price: Number(data.price),
    duration: data.duration,
    taxRate: Number(data.tax_rate),
    status: data.status,
  });
});

app.put("/services/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, duration, taxRate, status } = req.body as {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    taxRate?: number;
    status?: "active" | "inactive";
  };

  const { data, error } = await supabase
    .from("services")
    .update({
      name,
      description,
      price,
      duration,
      tax_rate: taxRate,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, name, description, price, duration, tax_rate, status")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to update service" });
    return;
  }

  res.json({
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    price: Number(data.price),
    duration: data.duration,
    taxRate: Number(data.tax_rate),
    status: data.status,
  });
});

app.delete("/services/:id", requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).end();
});

app.put("/services/bulk", requireAuth, requireAdmin, async (req, res) => {
  const { services } = req.body as { services?: Array<{ id?: string; name: string; price: number; duration: string }> };

  if (!services || !Array.isArray(services)) {
    res.status(400).json({ error: "Services array is required" });
    return;
  }

  const upsertPayload = services.map((service) => ({
    id: service.id ?? undefined,
    name: service.name,
    price: service.price,
    duration: service.duration,
  }));

  const { data, error } = await supabase
    .from("services")
    .upsert(upsertPayload, { onConflict: "id" })
    .select("id");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const keepIds = (data ?? []).map((row) => row.id);
  if (keepIds.length > 0) {
    const inList = keepIds.map((id) => `"${id}"`).join(",");
    await supabase.from("services").delete().not("id", "in", `(${inList})`);
  }

  res.json({ ok: true });
});

app.get("/service-splits", requireAuth, async (req, res) => {
  const { branchId } = req.query as { branchId?: string };
  const { data, error } = await supabase
    .from("service_splits")
    .select("shop_pct, barber_pct, branch_id, service:services(name)")
    .eq("branch_id", branchId ?? "");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => {
      const service = firstOrNull(row.service);
      return {
        serviceName: service?.name ?? "",
        shopPct: row.shop_pct,
        barberPct: row.barber_pct,
        branchId: row.branch_id ?? null,
      };
    })
  );
});

app.put("/service-splits", requireAuth, requireAdmin, async (req, res) => {
  const { splits } = req.body as {
    splits?: Array<{ serviceId: string; shopPct: number; barberPct: number; branchId?: string | null }>;
  };

  if (!splits || !Array.isArray(splits)) {
    res.status(400).json({ error: "Splits array is required" });
    return;
  }

  if (splits.some((split) => !split.branchId)) {
    res.status(400).json({ error: "Branch is required for each split" });
    return;
  }

  const { error } = await supabase.from("service_splits").upsert(
    splits.map((split) => ({
      service_id: split.serviceId,
      branch_id: split.branchId,
      shop_pct: split.shopPct,
      barber_pct: split.barberPct,
    })),
    { onConflict: "service_id,branch_id" }
  );

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ ok: true });
});

app.get("/transactions", requireAuth, async (req, res) => {
  const { branchId, startDate, endDate, search } = req.query as {
    branchId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };

  let query = supabase
    .from("transactions")
    .select(
      "id, date, time, client_name, status, cost, barber:barbers(id, name), service:services(id, name), branch:branches(id, name)"
    )
    .order("date", { ascending: false });

  const enforcedBranchId = req.user?.role === "client" ? req.user.branchId : branchId;
  if (enforcedBranchId) {
    query = query.eq("branch_id", enforcedBranchId);
  }
  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }
  const searchTerm = search?.trim();
  if (searchTerm) {
    query = query.or(
      `client_name.ilike.%${searchTerm}%,barbers.name.ilike.%${searchTerm}%,services.name.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => {
      const barber = firstOrNull(row.barber);
      const service = firstOrNull(row.service);
      const branch = firstOrNull(row.branch);
      return {
      id: row.id,
      date: row.date,
      time: row.time,
      clientName: row.client_name,
      barber: barber?.name ?? "",
      service: service?.name ?? "",
      cost: Number(row.cost),
      status: row.status,
      branch: branch?.name ?? null,
      };
    })
  );
});

app.post("/transactions", requireAuth, async (req, res) => {
  const { barberId, serviceId, clientName, status, branchId } = req.body as {
    barberId?: string;
    serviceId?: string;
    clientName?: string;
    status?: string;
    branchId?: string | null;
  };

  if (!barberId || !serviceId || !clientName) {
    res.status(400).json({ error: "Barber, service, and client name are required" });
    return;
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("price")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    res.status(400).json({ error: "Invalid service" });
    return;
  }

  const now = new Date();
  const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  });

  const resolvedBranchId = req.user?.role === "client" ? req.user.branchId ?? null : branchId ?? null;

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      barber_id: barberId,
      service_id: serviceId,
      client_name: clientName,
      status: status ?? "queued",
      cost: Number(service.price),
      date,
      time,
      branch_id: resolvedBranchId,
    })
    .select(
      "id, date, time, client_name, status, cost, barber:barbers(name), service:services(name), branch:branches(name)"
    )
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create transaction" });
    return;
  }

  const createdBarber = firstOrNull(data.barber);
  const createdService = firstOrNull(data.service);
  const createdBranch = firstOrNull(data.branch);
  res.status(201).json({
    id: data.id,
    date: data.date,
    time: data.time,
    clientName: data.client_name,
    barber: createdBarber?.name ?? "",
    service: createdService?.name ?? "",
    cost: Number(data.cost),
    status: data.status,
    branch: createdBranch?.name ?? null,
  });
});

app.delete("/transactions/:id", requireAuth, async (req, res) => {
  if (req.user?.role === "client") {
    res.status(403).json({ error: "Not allowed" });
    return;
  }

  const { id } = req.params;
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).end();
});

app.get("/expenses", requireAuth, async (req, res) => {
  const { branchId, startMonth, endMonth } = req.query as {
    branchId?: string;
    startMonth?: string;
    endMonth?: string;
  };

  let query = supabase
    .from("expenses")
    .select("id, month, electricity, water, rent, other, branch:branches(id, name)")
    .order("month", { ascending: false });

  const enforcedBranchId = req.user?.role === "client" ? req.user.branchId : branchId;
  if (enforcedBranchId) {
    query = query.eq("branch_id", enforcedBranchId);
  }
  if (startMonth) {
    query = query.gte("month", startMonth);
  }
  if (endMonth) {
    query = query.lte("month", endMonth);
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(
    (data ?? []).map((row) => {
      const branch = firstOrNull(row.branch);
      return {
      id: row.id,
      month: row.month,
      electricity: Number(row.electricity),
      water: Number(row.water),
      rent: Number(row.rent),
      other: Number(row.other),
      branch: branch?.name ?? null,
      };
    })
  );
});

app.post("/expenses", requireAuth, async (req, res) => {
  const { month, electricity, water, rent, other, branchId } = req.body as {
    month?: string;
    electricity?: number;
    water?: number;
    rent?: number;
    other?: number;
    branchId?: string | null;
  };

  if (!month) {
    res.status(400).json({ error: "Month is required" });
    return;
  }

  const resolvedBranchId = req.user?.role === "client" ? req.user.branchId ?? null : branchId ?? null;
  if (req.user?.role === "client" && !resolvedBranchId) {
    res.status(403).json({ error: "Client branch is required" });
    return;
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      month,
      electricity: electricity ?? 0,
      water: water ?? 0,
      rent: rent ?? 0,
      other: other ?? 0,
      branch_id: resolvedBranchId,
    })
    .select("id, month, electricity, water, rent, other, branch:branches(id, name)")
    .single();

  if (error || !data) {
    res.status(500).json({ error: error?.message || "Failed to create expense" });
    return;
  }

  const expenseBranch = firstOrNull(data.branch);
  res.status(201).json({
    id: data.id,
    month: data.month,
    electricity: Number(data.electricity),
    water: Number(data.water),
    rent: Number(data.rent),
    other: Number(data.other),
    branch: expenseBranch?.name ?? null,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
