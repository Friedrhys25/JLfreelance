"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import {
  clearStoredToken,
  createBranch,
  createUser,
  deleteUser as deleteUserApi,
  getMe,
  getStoredToken,
  listBranches,
  listUsers,
  login as loginApi,
  setStoredToken,
  type ApiBranch,
  type ApiUser,
} from "@/lib/api";

type Role = "admin" | "cashier" | "client" | null;

interface User {
  id?: string;
  username: string;
  role: Role;
  branch?: string | null;
  branchId?: string | null;
}

interface StoredUser {
  id: string;
  username: string;
  role: Exclude<Role, null>;
  branch?: string | null;
  branchId?: string | null;
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
  addUser: (user: { username: string; password: string; role: Exclude<Role, null>; branchId?: string | null }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addBranch: (name: string) => Promise<void>;
  branches: ApiBranch[];
}

interface AuthState {
  user: User;
  users: StoredUser[];
  branches: ApiBranch[];
  isLoading: boolean;
}

type AuthAction =
  | { type: "hydrate"; payload: Omit<AuthState, "isLoading"> }
  | { type: "setMeta"; payload: { users: StoredUser[]; branches: ApiBranch[] } }
  | { type: "login"; payload: User }
  | { type: "logout" }
  | { type: "addUser"; payload: StoredUser }
  | { type: "deleteUser"; payload: string }
  | { type: "addBranch"; payload: ApiBranch };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EMPTY_USER: User = {
  id: undefined,
  username: "",
  role: null,
  branch: null,
  branchId: null,
};

const initialAuthState: AuthState = {
  user: EMPTY_USER,
  users: [],
  branches: [],
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
    case "setMeta":
      return {
        ...state,
        users: action.payload.users,
        branches: action.payload.branches,
      };
    case "logout":
      return {
        ...state,
        user: EMPTY_USER,
        users: [],
        branches: [],
      };
    case "addUser":
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case "deleteUser":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case "addBranch": {
      const branches = [...state.branches, action.payload].sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        branches,
      };
    }
    default:
      return state;
  }
}

function mapUser(user: ApiUser): User {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    branch: user.branch ?? null,
    branchId: user.branchId ?? null,
  };
}

function mapStoredUsers(users: ApiUser[]): StoredUser[] {
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    branch: user.branch ?? null,
    branchId: user.branchId ?? null,
    createdAt: user.createdAt ?? new Date().toISOString(),
  }));
}

function mapBranches(branches: ApiBranch[]) {
  return branches;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const token = getStoredToken();
      if (!token) {
        if (isMounted) {
          dispatch({ type: "hydrate", payload: { user: EMPTY_USER, users: [], branches: [] } });
        }
        return;
      }

      try {
        const me = await getMe();
        const [branches, users] = await Promise.all([
          listBranches(),
          me.role === "admin" ? listUsers() : Promise.resolve([] as ApiUser[]),
        ]);

        if (isMounted) {
          dispatch({
            type: "hydrate",
            payload: {
              user: mapUser(me),
              users: mapStoredUsers(users),
              branches: mapBranches(branches),
            },
          });
        }
      } catch {
        clearStoredToken();
        if (isMounted) {
          dispatch({ type: "hydrate", payload: { user: EMPTY_USER, users: [], branches: [] } });
        }
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await loginApi(username, password);
      setStoredToken(token);
      const [branches, users] = await Promise.all([
        listBranches(),
        user.role === "admin" ? listUsers() : Promise.resolve([] as ApiUser[]),
      ]);
      dispatch({ type: "login", payload: mapUser(user) });
      dispatch({ type: "setMeta", payload: { users: mapStoredUsers(users), branches: mapBranches(branches) } });
      router.push("/dashboard");
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: "logout" });
    clearStoredToken();
    router.push("/login");
  };

  const addUser = async (userData: { username: string; password: string; role: Exclude<Role, null>; branchId?: string | null }) => {
    const created = await createUser(userData);
    dispatch({ type: "addUser", payload: mapStoredUsers([created])[0] });
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteUserApi(userId);
      dispatch({ type: "deleteUser", payload: userId });
    } catch {
      return;
    }
  };

  const addBranch = async (name: string) => {
    try {
      const created = await createBranch({ name });
      dispatch({ type: "addBranch", payload: created });
    } catch {
      return;
    }
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
    addBranch,
    branches: state.branches,
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
