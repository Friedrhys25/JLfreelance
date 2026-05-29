"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, LogOut, Menu, Receipt, Scissors, Settings, TrendingUp, X } from "lucide-react";
import { Button } from "@/app/components/Button";
import { Modal } from "@/app/components/Modal";
import type { DashboardTab } from "@/app/dashboard/types";

interface DashboardTopBarProps {
  activeTab?: DashboardTab | null;
  activeShortcut?: "settings";
  canViewExpenses: boolean;
  canManageUsers: boolean;
  mobileMenuOpen: boolean;
  branch?: string;
  role?: string | null;
  onLogout: () => void;
  onSetMobileMenuOpen: (isOpen: boolean) => void;
}

export function DashboardTopBar({
  activeTab,
  activeShortcut,
  canViewExpenses,
  canManageUsers,
  mobileMenuOpen,
  branch,
  role,
  onLogout,
  onSetMobileMenuOpen,
}: DashboardTopBarProps) {
  const router = useRouter();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const closeMobileMenu = () => onSetMobileMenuOpen(false);

  const openTab = (tab: DashboardTab) => {
    router.push(tab === "expenses" ? "/dashboard/expenses" : "/dashboard");
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/85 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-sm">
              <Scissors className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-semibold text-[var(--text)]">
                IDENTITY
              </span>
              <span className="text-xs capitalize text-[var(--muted)]">
                {role ?? "guest"} view
              </span>
              {branch && (
                <span className="mt-0.5 flex items-center gap-1 text-xs text-[var(--brand)]">
                  <Building className="h-3 w-3" />
                  {branch}
                </span>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant={activeTab === "overview" ? "primary" : "outline"}
              size="sm"
              onClick={() => router.push("/dashboard")}
            >
              <TrendingUp className="h-4 w-4" />
              Overview
            </Button>
            {canViewExpenses && (
              <Button
                variant={activeTab === "expenses" ? "primary" : "outline"}
                size="sm"
                onClick={() => router.push("/dashboard/expenses")}
              >
                <Receipt className="h-4 w-4" />
                Expenses
              </Button>
            )}
            <Button
              variant={activeShortcut === "settings" ? "primary" : "outline"}
              size="sm"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <div className="h-6 w-px bg-[var(--border)]" />
            <Button variant="ghost" size="sm" onClick={() => setLogoutConfirmOpen(true)}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <button
            type="button"
            onClick={() => onSetMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-[var(--border)] bg-white p-2 text-[var(--text)] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border)] pt-4 md:hidden">
            <Button
              variant={activeTab === "overview" ? "primary" : "outline"}
              size="sm"
              fullWidth
              onClick={() => openTab("overview")}
            >
              <TrendingUp className="h-4 w-4" />
              Overview
            </Button>
            {canViewExpenses && (
              <Button
                variant={activeTab === "expenses" ? "primary" : "outline"}
                size="sm"
                fullWidth
                onClick={() => openTab("expenses")}
              >
                <Receipt className="h-4 w-4" />
                Expenses
              </Button>
            )}
            <Button
              variant={activeShortcut === "settings" ? "primary" : "outline"}
              size="sm"
              fullWidth
              onClick={() => {
                router.push("/dashboard/settings");
                closeMobileMenu();
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="error" size="sm" fullWidth onClick={() => setLogoutConfirmOpen(true)}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        title="Confirm logout"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => setLogoutConfirmOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={() => {
                setLogoutConfirmOpen(false);
                onLogout();
              }}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted)]">Are you sure you want to log out?</p>
      </Modal>
    </nav>
  );
}
