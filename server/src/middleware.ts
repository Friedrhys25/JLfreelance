import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing auth token" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      branchId: payload.branchId ?? null,
      branchName: payload.branchName ?? null,
    };
    next();
  } catch {
    res.status(401).json({ error: "Invalid auth token" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
