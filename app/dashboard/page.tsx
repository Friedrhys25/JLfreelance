"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ChevronRight, User } from "lucide-react";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardOverview } from "@/app/dashboard/_components/DashboardOverview";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import type { Barber, Transaction } from "@/app/dashboard/types";
import {
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  listBarbers,
  listServices,
  listTransactions,
  type ApiService,
} from "@/lib/api";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const router = useRouter();
  const { branches, isAdmin, isAuthenticated, isCashier, isClient, logout, user } = useAuth();
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [posStep, setPosStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<ApiService[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState(todayKey);
  const [endDate, setEndDate] = useState(todayKey);
  const [currentPage, setCurrentPage] = useState(1);
  const [revenueChartType, setRevenueChartType] = useState<"bar" | "line">("bar");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [deleteQueueModalOpen, setDeleteQueueModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const loadData = async () => {
      try {
        const [barbersData, servicesData] = await Promise.all([listBarbers(), listServices()]);

        if (!isMounted) return;
        setBarbers(barbersData);
        setServices(servicesData);
      } catch {
        if (!isMounted) return;
        setBarbers([]);
        setServices([]);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const effectiveSelectedBranch = isClient && user.branch ? user.branch : selectedBranch;
  const canViewExpenses = isAdmin || isClient;
  const resolveBranchId = (branchName: string) => branches.find((branch) => branch.name === branchName)?.id ?? null;
  const selectedBranchId = effectiveSelectedBranch === "all" ? undefined : resolveBranchId(effectiveSelectedBranch) ?? undefined;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesStartDate = startDate ? transaction.date >= startDate : true;
      const matchesEndDate = endDate ? transaction.date <= endDate : true;
      const matchesBranch =
        effectiveSelectedBranch === "all" ||
        (transaction.branch ?? "Main Branch") === effectiveSelectedBranch;

      return matchesStartDate && matchesEndDate && matchesBranch;
    });
  }, [effectiveSelectedBranch, endDate, startDate, transactions]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    const loadTransactions = async () => {
      try {
        const transactionsData = await listTransactions({
          branchId: selectedBranchId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });

        if (!isMounted) return;
        setTransactions(transactionsData);
      } catch {
        if (!isMounted) return;
        setTransactions([]);
      }
    };

    loadTransactions();
    return () => {
      isMounted = false;
    };
  }, [endDate, isAuthenticated, selectedBranchId, startDate]);

  const queueCount = filteredTransactions.filter((transaction) => transaction.status === "queued").length;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (visiblePage - 1) * ITEMS_PER_PAGE,
    visiblePage * ITEMS_PER_PAGE
  );

  const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.cost, 0);
  const todayRevenue = filteredTransactions
    .filter((transaction) => transaction.date === todayKey)
    .reduce((sum, transaction) => sum + transaction.cost, 0);

  const isSingleDayRange = Boolean(startDate && endDate && startDate === endDate);

  const revenueChartData = isSingleDayRange
    ? Object.entries(
        filteredTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
          const dateKey = transaction.date;
          accumulator[dateKey] = (accumulator[dateKey] ?? 0) + transaction.cost;
          return accumulator;
        }, {})
      ).map(([dateKey, revenue]) => ({
        month: formatDate(dateKey),
        revenue,
      }))
    : Object.entries(
        filteredTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
          const month = transaction.date.slice(0, 7);
          accumulator[month] = (accumulator[month] ?? 0) + transaction.cost;
          return accumulator;
        }, {})
      ).map(([month, revenue]) => {
        const [year, monthIndex] = month.split("-").map(Number);
        const labelDate = new Date(year, monthIndex - 1, 1);
        return {
          month: labelDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          revenue,
        };
      });

  const pieChartData = Object.entries(
    filteredTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
      accumulator[transaction.service] = (accumulator[transaction.service] ?? 0) + transaction.cost;
      return accumulator;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const resetPosForm = () => {
    setPosStep(1);
    setSelectedBarber(null);
    setSelectedService(null);
    setClientName("");
  };

  const handleAddToQueue = async () => {
    if (!selectedBarber || !selectedService || !clientName.trim()) {
      return;
    }

    const barber = barbers.find((item) => item.id === selectedBarber);
    const service = services.find((item) => item.id === selectedService);

    if (!barber || !service) {
      return;
    }

    try {
      const branchId = isClient && user.branchId
        ? user.branchId
        : selectedBranch === "all"
          ? null
          : resolveBranchId(selectedBranch);
      const created = await createTransaction({
        barberId: barber.id,
        serviceId: service.id,
        clientName: clientName.trim(),
        status: "queued",
        branchId,
      });
      setTransactions((currentTransactions) => [created, ...currentTransactions]);
      setPosModalOpen(false);
      resetPosForm();
    } catch {
      return;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransactionApi(id);
    setTransactions((currentTransactions) => currentTransactions.filter((transaction) => transaction.id !== id));
  };

  const confirmDeleteQueue = async () => {
    if (!pendingDeleteId) return;
    await handleDeleteTransaction(pendingDeleteId);
    setPendingDeleteId(null);
    setDeleteQueueModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Time", "Client Name", "Barber", "Service", "Branch", "Cost", "Status"];
    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.time,
      transaction.clientName,
      transaction.barber,
      transaction.service,
      transaction.branch ?? "Main Branch",
      transaction.cost.toString(),
      transaction.status,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${todayKey}.csv`;
    link.click();
  };

  const pageDescription = isAdmin
    ? "Run the floor, manage services, and monitor branch performance."
    : isCashier
      ? "Process transactions and keep the queue moving."
      : "Review your assigned branch performance and expense health.";

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <DashboardTopBar
        activeTab="overview"
        branch={user.branch ?? undefined}
        canManageUsers={isAdmin}
        canViewExpenses={canViewExpenses}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--text)] md:text-4xl">Operations center</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{pageDescription}</p>
          </div>
        </div>

        <DashboardOverview
          barbers={barbers}
          branches={branches}
          currentPage={visiblePage}
          endDate={endDate}
          filteredTransactions={filteredTransactions}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          isAdmin={isAdmin}
          isClient={isClient}
          onDeleteTransaction={(id) => {
            setPendingDeleteId(id);
            setDeleteQueueModalOpen(true);
          }}
          onEndDateChange={(value) => {
            setEndDate(value);
            setCurrentPage(1);
          }}
          onExportCSV={handleExportCSV}
          onOpenQueueModal={() => setPosModalOpen(true)}
          onPageChange={setCurrentPage}
          onRevenueChartTypeChange={setRevenueChartType}
          onSelectedBranchChange={(value) => {
            setSelectedBranch(value);
            setCurrentPage(1);
          }}
          onStartDateChange={(value) => {
            setStartDate(value);
            setCurrentPage(1);
          }}
          paginatedTransactions={paginatedTransactions}
          pieChartData={pieChartData}
          queueCount={queueCount}
          revenueChartData={revenueChartData}
          revenueChartType={revenueChartType}
          selectedBranch={effectiveSelectedBranch}
          startDate={startDate}
          todayRevenue={todayRevenue}
          totalPages={totalPages}
          totalRevenue={totalRevenue}
          totalTransactions={filteredTransactions.length}
        />
      </main>

      <Modal
        isOpen={posModalOpen}
        onClose={() => {
          setPosModalOpen(false);
          resetPosForm();
        }}
        title="New Service Queue"
        footer={
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-2 w-2 rounded-full ${
                    step === posStep ? "bg-[var(--brand)]" : step < posStep ? "bg-green-500" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {posStep > 1 && (
                <Button variant="outline" onClick={() => setPosStep((current) => current - 1)}>
                  Back
                </Button>
              )}
              {posStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={() => setPosStep((current) => current + 1)}
                  disabled={(posStep === 1 && !selectedBarber) || (posStep === 2 && !selectedService)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAddToQueue} disabled={!clientName.trim()}>
                  <CheckCircle className="h-4 w-4" />
                  Add to Queue
                </Button>
              )}
            </div>
          </div>
        }
      >
        {posStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-center text-base font-semibold text-[var(--text)]">Step 1: Choose a barber</h3>
            <div className="grid grid-cols-2 gap-3">
              {barbers.map((barber) => (
                <button
                  key={barber.id}
                  type="button"
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    selectedBarber === barber.id
                      ? "border-[var(--brand)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-alt)] text-sm font-semibold text-[var(--text)]">
                    {barber.avatar}
                  </div>
                  <div className="font-semibold text-[var(--text)]">{barber.name}</div>
                  <div className="text-xs text-[var(--muted)]">{barber.specialty}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {posStep === 2 && (
          <div className="space-y-3">
            <h3 className="text-center text-base font-semibold text-[var(--text)]">Step 2: Choose a service</h3>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 p-4 transition ${
                  selectedService === service.id
                    ? "border-[var(--brand)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-[var(--text)]">{service.name}</div>
                  <div className="text-xs text-[var(--muted)]">Duration: {service.duration}</div>
                </div>
                <div className="font-bold text-[var(--text)]">{formatCurrency(service.price)}</div>
              </button>
            ))}
          </div>
        )}

        {posStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-center text-base font-semibold text-[var(--text)]">Step 3: Client information</h3>
            <div className="space-y-2 rounded-2xl bg-[var(--surface-alt)] p-4">
              <p className="text-sm text-[var(--muted)]">
                Barber: <span className="font-semibold text-[var(--text)]">{barbers.find((item) => item.id === selectedBarber)?.name}</span>
              </p>
              <p className="text-sm text-[var(--muted)]">
                Service: <span className="font-semibold text-[var(--text)]">{services.find((item) => item.id === selectedService)?.name}</span>
              </p>
            </div>
            <Input
              type="text"
              label="Client Name"
              placeholder="Enter client full name"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              icon={<User className="h-4 w-4" />}
              autoFocus
            />
          </div>
        )}

        {posStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-center text-base font-semibold text-[var(--text)]">Step 4: Confirm queue entry</h3>
            <Card className="space-y-3 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Barber</span>
                <span className="font-semibold text-[var(--text)]">{barbers.find((item) => item.id === selectedBarber)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Service</span>
                <span className="font-semibold text-[var(--text)]">{services.find((item) => item.id === selectedService)?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Client</span>
                <span className="font-semibold text-[var(--text)]">{clientName}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-3">
                <span className="font-medium text-[var(--text)]">Total Cost</span>
                <span className="font-bold text-[var(--brand)]">
                  {formatCurrency(services.find((item) => item.id === selectedService)?.price ?? 0)}
                </span>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteQueueModalOpen}
        onClose={() => {
          setDeleteQueueModalOpen(false);
          setPendingDeleteId(null);
        }}
        title="Delete queue entry"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteQueueModalOpen(false);
                setPendingDeleteId(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="error" onClick={confirmDeleteQueue} className="flex-1">
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted)]">
          This will permanently remove the queue entry from the transaction history.
        </p>
      </Modal>
    </div>
  );
}
