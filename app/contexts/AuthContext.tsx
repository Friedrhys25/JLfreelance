"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "cashier" | "client" | null;

interface User {
  username: string;
  role: Role;
  branch?: string;
}

interface StoredUser {
  id: string;
  username: string;
  password: string;
  role: Exclude<Role, null>;
  branch?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isCashier: boolean;
  isClient: boolean;
  isAuthenticated: boolean;
  users: StoredUser[];
  addUser: (user: Omit<StoredUser, "id" | "createdAt">) => void;
  deleteUser: (username: string) => void;
  branches: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid credentials
const VALID_CREDENTIALS = {
  admin: { username: "admin", password: "admin", role: "admin" as Role, branch: "Head Office" },
};

const DEFAULT_BRANCHES = ["Main Branch", "Downtown Branch", "Westside Branch"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    username: "",
    role: null,
    branch: undefined,
  });
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("barbershop_user");
    const storedUsers = localStorage.getItem("barbershop_users");
    const storedCashiers = localStorage.getItem("barbershop_cashiers");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else if (storedCashiers) {
      const migratedUsers: StoredUser[] = JSON.parse(storedCashiers).map(
        (cashier: StoredUser) => ({
          ...cashier,
          role: "cashier",
        })
      );
      setUsers(migratedUsers);
      localStorage.setItem("barbershop_users", JSON.stringify(migratedUsers));
    } else {
      // Initialize with default cashier
      const defaultCashier: StoredUser = {
        id: "cashier_001",
        username: "cashier",
        password: "cashier",
        role: "cashier",
        branch: "Main Branch",
        createdAt: new Date().toISOString(),
      };
      setUsers([defaultCashier]);
      localStorage.setItem("barbershop_users", JSON.stringify([defaultCashier]));
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

    // Check stored users
    const matchedUser = users.find((u) => u.username === username && u.password === password);
    if (matchedUser) {
      const userData: User = { 
        username: matchedUser.username, 
        role: matchedUser.role,
        branch: matchedUser.branch,
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

  const addUser = (userData: Omit<StoredUser, "id" | "createdAt">) => {
    const newUser: StoredUser = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("barbershop_users", JSON.stringify(updatedUsers));
  };

  const deleteUser = (username: string) => {
    const updatedUsers = users.filter((u) => u.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem("barbershop_users", JSON.stringify(updatedUsers));
  };

  const value = {
    user,
    login,
    logout,
    isAdmin: user.role === "admin",
    isCashier: user.role === "cashier",
    isClient: user.role === "client",
    isAuthenticated: user.role !== null,
    users,
    addUser,
    deleteUser,
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
