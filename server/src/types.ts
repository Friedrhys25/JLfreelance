export {};

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      username: string;
      role: "admin" | "cashier" | "client";
      branchId?: string | null;
      branchName?: string | null;
    }

    interface Request {
      user?: UserContext;
    }
  }
}
