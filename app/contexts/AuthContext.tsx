"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
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

interface AuthState {
  user: User;
  users: StoredUser[];
  isLoading: boolean;
}

type AuthAction =
  | { type: "hydrate"; payload: Omit<AuthState, "isLoading"> }
  | { type: "login"; payload: User }
  | { type: "logout" }
  | { type: "addUser"; payload: StoredUser }
  | { type: "deleteUser"; payload: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_CREDENTIALS = {
  admin: { username: "admin", password: "admin", role: "admin" as Role, branch: "Head Office" },
};

const DEFAULT_BRANCHES = ["Main Branch", "Downtown Branch", "Westside Branch"];

const EMPTY_USER: User = {
  username: "",
  role: null,
  branch: undefined,
};

const DEFAULT_CASHIER: StoredUser = {
  id: "cashier_001",
  username: "cashier",
  password: "cashier",
  role: "cashier",
  branch: "Main Branch",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const initialAuthState: AuthState = {
  user: EMPTY_USER,
  users: [],
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "hydrate":
      return {
        ...action.payload,
        isLoading: false,
      };
    case "login":
      return {
        ...state,
        user: action.payload,
      };
    case "logout":
      return {
        ...state,
        user: EMPTY_USER,
      };
    case "addUser":
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case "deleteUser":
      return {
        ...state,
        users: state.users.filter((user) => user.username !== action.payload),
      };
    default:
      return state;
  }
}

function getHydratedState(): Omit<AuthState, "isLoading"> {
  if (typeof window === "undefined") {
    return {
      user: EMPTY_USER,
      users: [],
    };
  }

  const storedUser = window.localStorage.getItem("barbershop_user");
  const storedUsers = window.localStorage.getItem("barbershop_users");
  const storedCashiers = window.localStorage.getItem("barbershop_cashiers");

  if (storedUsers) {
    return {
      user: storedUser ? JSON.parse(storedUser) : EMPTY_USER,
      users: JSON.parse(storedUsers),
    };
  }

  if (storedCashiers) {
    const migratedUsers: StoredUser[] = JSON.parse(storedCashiers).map((cashier: StoredUser) => ({
      ...cashier,
      role: "cashier",
    }));

    window.localStorage.setItem("barbershop_users", JSON.stringify(migratedUsers));

    return {
      user: storedUser ? JSON.parse(storedUser) : EMPTY_USER,
      users: migratedUsers,
    };
  }

  window.localStorage.setItem("barbershop_users", JSON.stringify([DEFAULT_CASHIER]));

  return {
    user: storedUser ? JSON.parse(storedUser) : EMPTY_USER,
    users: [DEFAULT_CASHIER],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: "hydrate", payload: getHydratedState() });
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === VALID_CREDENTIALS.admin.username && password === VALID_CREDENTIALS.admin.password) {
      const userData: User = {
        username: VALID_CREDENTIALS.admin.username,
        role: VALID_CREDENTIALS.admin.role,
        branch: VALID_CREDENTIALS.admin.branch,
      };
      dispatch({ type: "login", payload: userData });
      window.localStorage.setItem("barbershop_user", JSON.stringify(userData));
      router.push("/dashboard");
      return true;
    }

    const matchedUser = state.users.find((user) => user.username === username && user.password === password);
    if (!matchedUser) {
      return false;
    }

    const userData: User = {
      username: matchedUser.username,
      role: matchedUser.role,
      branch: matchedUser.branch,
    };

    dispatch({ type: "login", payload: userData });
    window.localStorage.setItem("barbershop_user", JSON.stringify(userData));
    router.push("/dashboard");
    return true;
  };

  const logout = () => {
    dispatch({ type: "logout" });
    window.localStorage.removeItem("barbershop_user");
    router.push("/login");
  };

  const addUser = (userData: Omit<StoredUser, "id" | "createdAt">) => {
    const newUser: StoredUser = {
      ...userData,
      id: `user_${state.users.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...state.users, newUser];
    dispatch({ type: "addUser", payload: newUser });
    window.localStorage.setItem("barbershop_users", JSON.stringify(updatedUsers));
  };

  const deleteUser = (username: string) => {
    const updatedUsers = state.users.filter((user) => user.username !== username);
    dispatch({ type: "deleteUser", payload: username });
    window.localStorage.setItem("barbershop_users", JSON.stringify(updatedUsers));
  };

  const value = {
    user: state.user,
    login,
    logout,
    isAdmin: state.user.role === "admin",
    isCashier: state.user.role === "cashier",
    isClient: state.user.role === "client",
    isAuthenticated: state.user.role !== null,
    users: state.users,
    addUser,
    deleteUser,
    branches: DEFAULT_BRANCHES,
  };

  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand)] border-t-transparent" />
          <p className="text-[var(--muted)]">Loading...</p>
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
