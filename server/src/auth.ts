import bcrypt from "bcryptjs";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Missing JWT_SECRET");
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: "admin" | "cashier" | "client";
  branchId?: string | null;
  branchName?: string | null;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, jwtSecret as Secret, { expiresIn: "12h" });
}

export function verifyToken(token: string) {
  const decoded = jwt.verify(token, jwtSecret as Secret) as JwtPayload | string;
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }
  return decoded as AuthTokenPayload;
}
