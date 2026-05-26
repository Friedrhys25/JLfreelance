"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { Button } from "@/app/components/Button";
import { DashboardExpenses } from "@/app/dashboard/_components/DashboardExpenses";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { INITIAL_BARBERS, INITIAL_EXPENSES, INITIAL_TRANSACTIONS } from "@/app/dashboard/dashboard-data";
import { useAuth } from "@/app/contexts/AuthContext";
import type { Expense, Transaction } from "@/app/dashboard/types";

const BARBER_SHARE = 0.6;
const SHOP_SHARE = 0.4;

export default function DashboardExpensesPage() {
  const router = useRouter();
  const { branches, isAdmin, isAuthenticated, isClient, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expenseChartType, setExpenseChartType] = useState<"bar" | "area">("bar");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [expenses] = useState<Expense[]>(INITIAL_EXPENSES);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const effectiveSelectedBranch = isClient && user.branch ? user.branch : selectedBranch;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return (
        effectiveSelectedBranch === "all" ||
        (transaction.branch ?? "Main Branch") === effectiveSelectedBranch
      );
    });
  }, [effectiveSelectedBranch, transactions]);

  const filteredExpenses = useMemo(() => {
    return effectiveSelectedBranch === "all"
      ? expenses
      : expenses.filter((expense) => (expense.branch ?? "Main Branch") === effectiveSelectedBranch);
  }, [effectiveSelectedBranch, expenses]);

  const monthlyRevenue = filteredTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const month = transaction.date.slice(0, 7);
    accumulator[month] = (accumulator[month] ?? 0) + transaction.cost;
    return accumulator;
  }, {});

  const aggregatedExpensesByMonth = filteredExpenses.reduce<
    Record<string, { electricity: number; water: number; rent: number; other: number }>
  >((accumulator, expense) => {
    const existing = accumulator[expense.month] ?? { electricity: 0, water: 0, rent: 0, other: 0 };
    accumulator[expense.month] = {
      electricity: existing.electricity + expense.electricity,
      water: existing.water + expense.water,
      rent: existing.rent + expense.rent,
      other: existing.other + expense.other,
    };
    return accumulator;
  }, {});

  const latestExpenseMonthKey =
    Object.keys(aggregatedExpensesByMonth).sort((monthA, monthB) => monthB.localeCompare(monthA))[0] ??
    new Date().toISOString().slice(0, 7);

  const currentMonthExpenses = aggregatedExpensesByMonth[latestExpenseMonthKey];
  const totalExpenses = currentMonthExpenses
    ? currentMonthExpenses.electricity +
      currentMonthExpenses.water +
      currentMonthExpenses.rent +
      currentMonthExpenses.other
    : 0;

  const monthlyExpenses = Object.entries(aggregatedExpensesByMonth)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, totals]) => ({
      month,
      label: new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      electricity: totals.electricity,
      water: totals.water,
      rent: totals.rent,
      other: totals.other,
      total: totals.electricity + totals.water + totals.rent + totals.other,
    }));

  const monthlyFinancials = monthlyExpenses.map((row) => {
    const revenue = monthlyRevenue[row.month] ?? 0;
    return {
      month: row.month,
      label: row.label,
      revenue,
      expenses: row.total,
      roi: row.total > 0 ? ((revenue - row.total) / row.total) * 100 : 0,
    };
  });

  const currentMonthRevenue = filteredTransactions
    .filter((transaction) => transaction.date.startsWith(latestExpenseMonthKey))
    .reduce((sum, transaction) => sum + transaction.cost, 0);

  const netProfit = currentMonthRevenue - totalExpenses;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  const barberPerformance = INITIAL_BARBERS.map((barber) => {
    const barberTransactions = filteredTransactions.filter((transaction) => transaction.barber === barber.name);
    const barberRevenue = barberTransactions.reduce((sum, transaction) => sum + transaction.cost, 0);
    return {
      name: barber.name,
      services: barberTransactions.length,
      totalRevenue: barberRevenue,
      barberShare: barberRevenue * BARBER_SHARE,
      shopShare: barberRevenue * SHOP_SHARE,
    };
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <DashboardTopBar
        activeTab="expenses"
        branch={user.branch}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onOpenBarberModal={() => {}}
        onOpenUserModal={() => {}}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text)] md:text-4xl">Expenses and ROI</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              Review branch-level operating costs, profit, and barber revenue split from a dedicated page.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--muted)]">Branch</label>
              <select
                value={effectiveSelectedBranch}
                onChange={(event) => setSelectedBranch(event.target.value)}
                disabled={isClient}
                className="h-10 min-w-44 rounded-lg border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)] disabled:bg-[var(--surface-alt)]"
              >
                {(isAdmin || !isClient) && <option value="all">All branches</option>}
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DashboardExpenses
          barberPerformance={barberPerformance}
          expenseChartType={expenseChartType}
          formatCurrency={formatCurrency}
          monthlyExpenses={monthlyExpenses}
          monthlyFinancials={monthlyFinancials}
          netProfit={netProfit}
          onExpenseChartTypeChange={setExpenseChartType}
          roi={roi}
          selectedBranch={effectiveSelectedBranch}
          totalExpenses={totalExpenses}
          totalRevenue={currentMonthRevenue}
        />
      </main>
    </div>
  );
}
