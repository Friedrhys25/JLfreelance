"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "cashier" | null;

interface User {
  username: string;
  role: Role;
  branch?: string;
}

interface CashierUser {
  id: string;
  username: string;
  password: string;
  role: "cashier";
  branch: string;
  createdAt: string;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isCashier: boolean;
  isAuthenticated: boolean;
  cashiers: CashierUser[];
  addCashier: (cashier: Omit<CashierUser, "id" | "createdAt">) => void;
  deleteCashier: (username: string) => void;
  branches: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid credentials
const VALID_CREDENTIALS = {
  admin: { username: "admin", password: "admin", role: "admin" as Role, branch: "Head Office" },
  cashier: { username: "cashier", password: "cashier", role: "cashier" as Role, branch: "Main Branch" },
};

const DEFAULT_BRANCHES = ["Main Branch", "Downtown Branch", "Westside Branch"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    username: "",
    role: null,
    branch: undefined,
  });
  const [cashiers, setCashiers] = useState<CashierUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("barbershop_user");
    const storedCashiers = localStorage.getItem("barbershop_cashiers");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedCashiers) {
      setCashiers(JSON.parse(storedCashiers));
    } else {
      // Initialize with default cashier
      const defaultCashier: CashierUser = {
        id: "cashier_001",
        username: "cashier",
        password: "cashier",
        role: "cashier",
        branch: "Main Branch",
        createdAt: new Date().toISOString(),
      };
      setCashiers([defaultCashier]);
      localStorage.setItem("barbershop_cashiers", JSON.stringify([defaultCashier]));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check admin credentials
    if (username === VALID_CREDENTIALS.admin.username && password === VALID_CREDENTIALS.admin.password) {
      const userData: User = { 
        username: VALID_CREDENTIALS.admin.username, 
        role: VALID_CREDENTIALS.admin.role,
        branch: VALID_CREDENTIALS.admin.branch,
      };
      setUser(userData);
      localStorage.setItem("barbershop_user", JSON.stringify(userData));
      router.push("/dashboard");
      return true;
    }

    // Check cashier credentials from stored cashiers
    const cashier = cashiers.find((c) => c.username === username && c.password === password);
    if (cashier) {
      const userData: User = { 
        username: cashier.username, 
        role: cashier.role,
        branch: cashier.branch,
      };
      setUser(userData);
      localStorage.setItem("barbershop_user", JSON.stringify(userData));
      router.push("/dashboard");
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser({ username: "", role: null, branch: undefined });
    localStorage.removeItem("barbershop_user");
    router.push("/login");
  };

  const addCashier = (cashierData: Omit<CashierUser, "id" | "createdAt">) => {
    const newCashier: CashierUser = {
      ...cashierData,
      id: `cashier_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedCashiers = [...cashiers, newCashier];
    setCashiers(updatedCashiers);
    localStorage.setItem("barbershop_cashiers", JSON.stringify(updatedCashiers));
  };

  const deleteCashier = (username: string) => {
    const updatedCashiers = cashiers.filter((c) => c.username !== username);
    setCashiers(updatedCashiers);
    localStorage.setItem("barbershop_cashiers", JSON.stringify(updatedCashiers));
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user.role === "admin",
    isCashier: user.role === "cashier",
    isAuthenticated: user.role !== null,
    cashiers,
    addCashier,
    deleteCashier,
    branches: DEFAULT_BRANCHES,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-(--page-bg)">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-(--brand) border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-(--muted)">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
