"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building, CheckCircle, ChevronRight, Scissors, User, Users } from "lucide-react";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { BARBER_SPECIALTIES, INITIAL_BARBERS, INITIAL_TRANSACTIONS } from "@/app/dashboard/dashboard-data";
import { DashboardOverview } from "@/app/dashboard/_components/DashboardOverview";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import type { Barber, Transaction } from "@/app/dashboard/types";
import { loadServiceSettings, type ServiceSetting } from "@/app/dashboard/settings/service-settings-store";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const router = useRouter();
  const { addUser, branches, deleteUser, isAdmin, isAuthenticated, isCashier, isClient, logout, user, users } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [addBarberModalOpen, setAddBarberModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [posStep, setPosStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [services] = useState<ServiceSetting[]>(() => loadServiceSettings());
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [revenueChartType, setRevenueChartType] = useState<"bar" | "line">("bar");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "cashier" as "admin" | "cashier" | "client",
    branch: "Main Branch",
  });
  const [newBarber, setNewBarber] = useState({
    name: "",
    specialty: "Haircut" as typeof BARBER_SPECIALTIES[number],
    branch: "Main Branch",
  });
  const transactionSequence = useRef(INITIAL_TRANSACTIONS.length);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);


  const effectiveSelectedBranch = isClient && user.branch ? user.branch : selectedBranch;
  const canViewExpenses = isAdmin || isClient;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.barber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStartDate = startDate ? transaction.date >= startDate : true;
      const matchesEndDate = endDate ? transaction.date <= endDate : true;
      const matchesBranch =
        effectiveSelectedBranch === "all" ||
        (transaction.branch ?? "Main Branch") === effectiveSelectedBranch;

      return matchesSearch && matchesStartDate && matchesEndDate && matchesBranch;
    });
  }, [effectiveSelectedBranch, endDate, searchTerm, startDate, transactions]);

  const queueCount = filteredTransactions.filter((transaction) => transaction.status === "queued").length;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (visiblePage - 1) * ITEMS_PER_PAGE,
    visiblePage * ITEMS_PER_PAGE
  );

  const totalRevenue = filteredTransactions.reduce((sum, transaction) => sum + transaction.cost, 0);
  const todayKey = new Date().toISOString().split("T")[0];
  const todayRevenue = filteredTransactions
    .filter((transaction) => transaction.date === todayKey)
    .reduce((sum, transaction) => sum + transaction.cost, 0);

  const monthlyRevenue = filteredTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
    const month = transaction.date.slice(0, 7);
    accumulator[month] = (accumulator[month] ?? 0) + transaction.cost;
    return accumulator;
  }, {});

  const revenueChartData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month: new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    revenue,
  }));

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

  const handleAddToQueue = () => {
    if (!selectedBarber || !selectedService || !clientName.trim()) {
      return;
    }

    transactionSequence.current += 1;
    const now = new Date();
    const barber = barbers.find((item) => item.id === selectedBarber);
    const service = services.find((item) => item.id === selectedService);

    if (!barber || !service) {
      return;
    }

    const newTransaction: Transaction = {
      id: `txn_${transactionSequence.current}`,
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      clientName: clientName.trim(),
      barber: barber.name,
      service: service.name,
      cost: service.price,
      status: "queued",
      branch: isClient && user.branch ? user.branch : newBarber.branch || user.branch || "Main Branch",
    };

    setTransactions((currentTransactions) => [newTransaction, ...currentTransactions]);
    setPosModalOpen(false);
    resetPosForm();
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((currentTransactions) => currentTransactions.filter((transaction) => transaction.id !== id));
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
        branch={user.branch}
        canManageUsers={isAdmin}
        canViewExpenses={canViewExpenses}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onOpenBarberModal={() => setAddBarberModalOpen(true)}
        onOpenUserModal={() => setAddUserModalOpen(true)}
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
          onDeleteTransaction={handleDeleteTransaction}
          onEndDateChange={(value) => {
            setEndDate(value);
            setCurrentPage(1);
          }}
          onExportCSV={handleExportCSV}
          onOpenQueueModal={() => setPosModalOpen(true)}
          onPageChange={setCurrentPage}
          onRevenueChartTypeChange={setRevenueChartType}
          onSearchTermChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
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
          searchTerm={searchTerm}
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
        isOpen={addBarberModalOpen}
        onClose={() => {
          setAddBarberModalOpen(false);
          setNewBarber({ name: "", specialty: "Haircut", branch: "Main Branch" });
        }}
        title="Add Barber"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddBarberModalOpen(false);
                setNewBarber({ name: "", specialty: "Haircut", branch: "Main Branch" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!newBarber.name.trim()) {
                  return;
                }

                setBarbers((currentBarbers) => [
                  ...currentBarbers,
                  {
                    id: `barber_${currentBarbers.length + 1}`,
                    name: newBarber.name.trim(),
                    avatar: newBarber.name.trim().slice(0, 2).toUpperCase(),
                    specialty: newBarber.specialty,
                    branch: newBarber.branch,
                  },
                ]);
                setNewBarber({ name: "", specialty: "Haircut", branch: "Main Branch" });
                setAddBarberModalOpen(false);
              }}
              className="flex-1"
            >
              Add Barber
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Barber Name"
            placeholder="Enter barber name"
            value={newBarber.name}
            onChange={(event) => setNewBarber((current) => ({ ...current, name: event.target.value }))}
            icon={<User className="h-4 w-4" />}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Scissors className="mr-1 inline h-4 w-4" />
              Specialty
            </label>
            <select
              value={newBarber.specialty}
              onChange={(event) =>
                setNewBarber((current) => ({
                  ...current,
                  specialty: event.target.value as typeof BARBER_SPECIALTIES[number],
                }))
              }
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              {BARBER_SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Building className="mr-1 inline h-4 w-4" />
              Branch Location
            </label>
            <select
              value={newBarber.branch}
              onChange={(event) => setNewBarber((current) => ({ ...current, branch: event.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={addUserModalOpen}
        onClose={() => {
          setAddUserModalOpen(false);
          setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
        }}
        title="Manage Users"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddUserModalOpen(false);
                setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!newUser.username || !newUser.password) {
                  return;
                }

                addUser({
                  username: newUser.username,
                  password: newUser.password,
                  role: newUser.role,
                  branch: newUser.branch,
                });
                setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
              }}
              className="flex-1"
            >
              Add User
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Username"
            placeholder="Enter username"
            value={newUser.username}
            onChange={(event) => setNewUser((current) => ({ ...current, username: event.target.value }))}
            icon={<User className="h-4 w-4" />}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
            icon={<User className="h-4 w-4" />}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Users className="mr-1 inline h-4 w-4" />
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(event) =>
                setNewUser((current) => ({
                  ...current,
                  role: event.target.value as "admin" | "cashier" | "client",
                }))
              }
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Building className="mr-1 inline h-4 w-4" />
              Branch Location
            </label>
            <select
              value={newUser.branch}
              onChange={(event) => setNewUser((current) => ({ ...current, branch: event.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
          {users.length > 0 && (
            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Existing Users</h4>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {users.map((storedUser) => (
                  <div key={storedUser.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-alt)] p-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{storedUser.username}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {storedUser.role} · {storedUser.branch ?? "No branch"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(storedUser.username)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
