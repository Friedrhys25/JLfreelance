const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "barbershop_token";

export type ApiRole = "admin" | "cashier" | "client";

export interface ApiUser {
  id: string;
  username: string;
  role: ApiRole;
  branchId?: string | null;
  branch?: string | null;
  createdAt?: string;
}

export interface ApiBranch {
  id: string;
  name: string;
}

export interface ApiBarber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  branchId?: string | null;
  branch?: string | null;
}

export interface ApiService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  taxRate: number;
  status: "active" | "inactive";
  branchId?: string | null;
  branch?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTransaction {
  id: string;
  date: string;
  time: string;
  clientName: string;
  barber: string;
  service: string;
  cost: number;
  status: string;
  branchId?: string | null;
  branch?: string | null;
}

export interface ApiExpense {
  id: string;
  month: string;
  electricity: number;
  water: number;
  rent: number;
  other: number;
  branch?: string | null;
}

export interface ApiServiceSplit {
  serviceName: string;
  shopPct: number;
  barberPct: number;
  branchId?: string | null;
}

let inMemoryToken: string | null = null;

export function getStoredToken() {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(TOKEN_KEY);
  inMemoryToken = stored;
  return stored;
}

export function setStoredToken(token: string) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredToken() {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function buildHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function login(username: string, password: string) {
  return apiFetch<{ token: string; user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function getMe() {
  return apiFetch<ApiUser>("/auth/me");
}

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  return apiFetch<{ ok: true }>("/auth/password", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function listBranches() {
  return apiFetch<ApiBranch[]>("/branches");
}

export async function createBranch(input: { name: string }) {
  return apiFetch<ApiBranch>("/branches", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listUsers() {
  return apiFetch<ApiUser[]>("/users");
}

export async function createUser(input: { username: string; password: string; role: ApiRole; branchId?: string | null }) {
  return apiFetch<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteUser(id: string) {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}

export async function listBarbers() {
  return apiFetch<ApiBarber[]>("/barbers");
}

export async function createBarber(input: { name: string; specialty?: string; avatar?: string; branchId?: string | null }) {
  return apiFetch<ApiBarber>("/barbers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listServices(params?: { branchId?: string }) {
  const search = new URLSearchParams();
  if (params?.branchId) search.set("branchId", params.branchId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return apiFetch<ApiService[]>(`/services${suffix}`);
}

export async function getService(id: string) {
  return apiFetch<ApiService>(`/services/${id}`);
}

export async function createService(input: {
  name: string;
  description?: string;
  price: number;
  duration: string;
  taxRate: number;
  status: "active" | "inactive";
  branchId?: string | null;
}) {
  return apiFetch<ApiService>("/services", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateService(
  id: string,
  input: {
    name: string;
    description?: string;
    price: number;
    duration: string;
    taxRate: number;
    status: "active" | "inactive";
  }
) {
  return apiFetch<ApiService>(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteService(id: string) {
  return apiFetch<void>(`/services/${id}`, { method: "DELETE" });
}

export async function listServiceSplits(params?: { branchId?: string }) {
  const search = new URLSearchParams();
  if (params?.branchId) search.set("branchId", params.branchId);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return apiFetch<ApiServiceSplit[]>(`/service-splits${suffix}`);
}

export async function saveServiceSplits(
  input: Array<{ serviceId?: string | null; shopPct: number; barberPct: number; branchId: string }>
) {
  return apiFetch<{ ok: true }>("/service-splits", {
    method: "PUT",
    body: JSON.stringify({ splits: input }),
  });
}

export async function listTransactions(params?: {
  branchId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  const search = new URLSearchParams();
  if (params?.branchId) search.set("branchId", params.branchId);
  if (params?.startDate) search.set("startDate", params.startDate);
  if (params?.endDate) search.set("endDate", params.endDate);
  if (params?.search) search.set("search", params.search);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return apiFetch<ApiTransaction[]>(`/transactions${suffix}`);
}

export async function createTransaction(input: {
  barberId: string;
  serviceId: string;
  clientName: string;
  status?: string;
  branchId?: string | null;
}) {
  return apiFetch<ApiTransaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteTransaction(id: string) {
  return apiFetch<void>(`/transactions/${id}`, { method: "DELETE" });
}

export async function listExpenses(params?: { branchId?: string; startMonth?: string; endMonth?: string }) {
  const search = new URLSearchParams();
  if (params?.branchId) search.set("branchId", params.branchId);
  if (params?.startMonth) search.set("startMonth", params.startMonth);
  if (params?.endMonth) search.set("endMonth", params.endMonth);
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return apiFetch<ApiExpense[]>(`/expenses${suffix}`);
}

export async function createExpense(input: {
  month: string;
  electricity: number;
  water: number;
  rent: number;
  other: number;
  branchId?: string | null;
}) {
  return apiFetch<ApiExpense>("/expenses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
