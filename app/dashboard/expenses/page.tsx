"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Droplet, Receipt, Zap } from "lucide-react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { DashboardExpenses } from "@/app/dashboard/_components/DashboardExpenses";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { useAuth } from "@/app/contexts/AuthContext";
import type { Barber, Expense, Transaction } from "@/app/dashboard/types";
import { createExpense, listBarbers, listExpenses, listServiceSplits, listTransactions } from "@/lib/api";
import { getSplitForServiceName, type ServiceSplitSetting } from "@/app/dashboard/settings/service-settings-store";

export default function DashboardExpensesPage() {
  const router = useRouter();
  const { branches, isAdmin, isAuthenticated, isClient, logout, user } = useAuth();
  const currentMonthKey = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }).slice(0, 7);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [startMonth, setStartMonth] = useState(currentMonthKey);
  const [endMonth, setEndMonth] = useState(currentMonthKey);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [serviceSplitsByBranch, setServiceSplitsByBranch] = useState<Record<string, Record<string, ServiceSplitSetting>>>({});
  const [expenseDraft, setExpenseDraft] = useState({
    month: currentMonthKey,
    electricity: "",
    water: "",
    rent: "",
    other: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const effectiveSelectedBranch = isClient && user.branch ? user.branch : selectedBranch;
  const resolveBranchId = (branchName: string) => branches.find((branch) => branch.name === branchName)?.id ?? null;
  const selectedBranchId = effectiveSelectedBranch === "all" ? undefined : resolveBranchId(effectiveSelectedBranch) ?? undefined;

  const toStartDate = (monthKey: string) => `${monthKey}-01`;
  const toEndDate = (monthKey: string) => {
    const [year, month] = monthKey.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${monthKey}-${String(lastDay).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        const [transactionsData, expensesData, barbersData, splitsData] = await Promise.all([
          listTransactions({
            branchId: selectedBranchId,
            startDate: startMonth ? toStartDate(startMonth) : undefined,
            endDate: endMonth ? toEndDate(endMonth) : undefined,
          }),
          listExpenses({
            branchId: selectedBranchId,
            startMonth: startMonth || undefined,
            endMonth: endMonth || undefined,
          }),
          listBarbers(),
          listServiceSplits(selectedBranchId ? { branchId: selectedBranchId } : undefined),
        ]);

        if (!isMounted) return;

        setTransactions(transactionsData);
        setExpenses(expensesData);
        setBarbers(barbersData);
        const splitMap: Record<string, Record<string, ServiceSplitSetting>> = {};
        splitsData.forEach((split) => {
          if (!split.branchId) return;
          splitMap[split.branchId] = {
            ...(splitMap[split.branchId] ?? {}),
            [split.serviceName]: { shopPct: split.shopPct, barberPct: split.barberPct },
          };
        });
        setServiceSplitsByBranch(splitMap);
      } catch {
        if (!isMounted) return;
        setTransactions([]);
        setExpenses([]);
        setBarbers([]);
        setServiceSplitsByBranch({});
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [endMonth, isAuthenticated, selectedBranchId, startMonth]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const filteredTransactions = useMemo(() => transactions, [transactions]);

  const filteredExpenses = useMemo(() => expenses, [expenses]);

  const findExpenseLog = (month: string) =>
    filteredExpenses.find((expense) => expense.month === month && expense.branch === effectiveSelectedBranch);

  const buildExpenseDraft = (month: string) => {
    const existingExpense = findExpenseLog(month);
    return {
      month,
      electricity: existingExpense ? String(existingExpense.electricity) : "",
      water: existingExpense ? String(existingExpense.water) : "",
      rent: existingExpense ? String(existingExpense.rent) : "",
      other: existingExpense ? String(existingExpense.other) : "",
    };
  };

  const openExpensesModal = () => {
    setExpenseDraft(buildExpenseDraft(currentMonthKey));
    setExpensesModalOpen(true);
  };

  const closeExpensesModal = () => {
    setExpensesModalOpen(false);
    setExpenseDraft(buildExpenseDraft(currentMonthKey));
  };

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

  const getSplitForTransaction = (transaction: Transaction) => {
    const transactionBranchId =
      transaction.branchId ?? resolveBranchId(transaction.branch ?? "") ?? selectedBranchId ?? "";
    return getSplitForServiceName(serviceSplitsByBranch[transactionBranchId] ?? {}, transaction.service);
  };

  const barberPerformance = barbers.map((barber) => {
    const barberTransactions = filteredTransactions.filter((transaction) => transaction.barber === barber.name);
    const barberRevenue = barberTransactions.reduce((sum, transaction) => sum + transaction.cost, 0);
    const barberShare = barberTransactions.reduce((sum, transaction) => {
      const split = getSplitForTransaction(transaction);
      return sum + transaction.cost * (split.barberPct / 100);
    }, 0);
    const shopShare = barberTransactions.reduce((sum, transaction) => {
      const split = getSplitForTransaction(transaction);
      return sum + transaction.cost * (split.shopPct / 100);
    }, 0);
    return {
      name: barber.name,
      services: barberTransactions.length,
      totalRevenue: barberRevenue,
      barberShare,
      shopShare,
    };
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <DashboardTopBar
        activeTab="expenses"
        branch={user.branch ?? undefined}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
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
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--muted)]">Start Month</label>
              <Input
                type="month"
                value={startMonth}
                onChange={(event) => setStartMonth(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--muted)]">End Month</label>
              <Input
                type="month"
                value={endMonth}
                onChange={(event) => setEndMonth(event.target.value)}
              />
            </div>
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
                  <option key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="md" onClick={openExpensesModal} className="sm:mb-0">
              <Receipt className="h-4 w-4" />
              Log Monthly Expenses
            </Button>
          </div>
        </div>

        <DashboardExpenses
          barberPerformance={barberPerformance}
          formatCurrency={formatCurrency}
          monthlyExpenses={monthlyExpenses}
          monthlyFinancials={monthlyFinancials}
          netProfit={netProfit}
          roi={roi}
          selectedBranch={effectiveSelectedBranch}
          totalExpenses={totalExpenses}
          totalRevenue={currentMonthRevenue}
        />
      </main>

      <Modal
        isOpen={expensesModalOpen}
        onClose={closeExpensesModal}
        title="Monthly Expenses"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={closeExpensesModal} className="flex-1">
              Close
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (effectiveSelectedBranch === "all") return;
                const created = await createExpense({
                  month: expenseDraft.month,
                  electricity: Number(expenseDraft.electricity || 0),
                  water: Number(expenseDraft.water || 0),
                  rent: Number(expenseDraft.rent || 0),
                  other: Number(expenseDraft.other || 0),
                  branchId: resolveBranchId(effectiveSelectedBranch),
                });
                setExpenses((current) => {
                  const withoutExisting = current.filter(
                    (expense) => !(expense.month === created.month && expense.branch === created.branch)
                  );
                  return [created, ...withoutExisting];
                });
                closeExpensesModal();
              }}
              className="flex-1"
              disabled={effectiveSelectedBranch === "all"}
            >
              Saved
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="month"
            label="Month"
            value={expenseDraft.month}
            onChange={(event) => setExpenseDraft(buildExpenseDraft(event.target.value))}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
                <Zap className="mr-1 inline h-4 w-4" />
                Electricity
              </label>
              <Input
                type="number"
                placeholder="0"
                value={expenseDraft.electricity}
                onChange={(event) => setExpenseDraft((current) => ({ ...current, electricity: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
                <Droplet className="mr-1 inline h-4 w-4" />
                Water
              </label>
              <Input
                type="number"
                placeholder="0"
                value={expenseDraft.water}
                onChange={(event) => setExpenseDraft((current) => ({ ...current, water: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
                <Building className="mr-1 inline h-4 w-4" />
                Rent
              </label>
              <Input
                type="number"
                placeholder="0"
                value={expenseDraft.rent}
                onChange={(event) => setExpenseDraft((current) => ({ ...current, rent: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
                <Receipt className="mr-1 inline h-4 w-4" />
                Other
              </label>
              <Input
                type="number"
                placeholder="0"
                value={expenseDraft.other}
                onChange={(event) => setExpenseDraft((current) => ({ ...current, other: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
