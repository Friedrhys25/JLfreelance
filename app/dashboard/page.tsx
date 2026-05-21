"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import { Modal } from "@/app/components/Modal";
import { Input } from "@/app/components/Input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/Table";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Scissors,
  UserCircle,
  Sparkles,
  User,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Download,
  Search,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Trash2,
  TrendingUp,
  TrendingDown,
  Zap,
  Droplet,
  Building,
  Receipt,
  Wallet,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Plus,
  X as XIcon,
  Users,
  Clock3,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Filter, BarChart2 } from "lucide-react";
import dashboardData from "@/data/mockData.json";

interface Transaction {
  id: string;
  date: string;
  time: string;
  clientName: string;
  barber: string;
  service: string;
  cost: number;
  status: string;
  branch?: string;
}

interface Expense {
  id: string;
  month: string;
  electricity: number;
  water: number;
  rent: number;
  other: number;
  branch?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  branch?: string;
}

const SERVICES: Service[] = [
  { id: "1", name: "Haircut", price: 2699, duration: "30 min" },
  { id: "2", name: "Haircut with Treatment", price: 3100, duration: "45 min" },
  { id: "3", name: "Hair Color", price: 1699, duration: "60 min" },
];

const INITIAL_BARBERS: Barber[] = [
  { id: "1", name: "Marco", avatar: "👨‍🦱", specialty: "Fade & Taper" },
  { id: "2", name: "Andre", avatar: "🧔", specialty: "Classic Cuts" },
  { id: "3", name: "Jun", avatar: "👨", specialty: "Color Specialist" },
  { id: "4", name: "Rico", avatar: "🧑", specialty: "Beard & Mustache" },
];

const BARBER_SPECIALTIES = ["Haircut", "Hair Color", "Hair Treatment"] as const;
const getServiceCategory = (serviceName: string) => {
  const lowered = serviceName.toLowerCase();

  if (lowered.includes("color")) return "Hair Color";
  if (lowered.includes("treatment")) return "Hair Treatment";
  return "Haircut";
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAdmin, isCashier, isClient, isAuthenticated, users, addUser, deleteUser, branches } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [addBarberModalOpen, setAddBarberModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [posStep, setPosStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(dashboardData.transactions as Transaction[]);
  const [expenses, setExpenses] = useState<Expense[]>(dashboardData.expenses as Expense[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">("overview");
  const [revenueChartType, setRevenueChartType] = useState<"bar" | "line">("bar");
  const [expenseChartType, setExpenseChartType] = useState<"bar" | "line">("bar");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedChartDataType, setSelectedChartDataType] = useState<"revenue" | "services" | "barber">("revenue");
  const [serviceTrendChartType, setServiceTrendChartType] = useState<"bar" | "area">("bar");
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
  const itemsPerPage = 10;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Cashier can only see overview tab
  useEffect(() => {
    if (isCashier && activeTab === "expenses") {
      setActiveTab("overview");
    }
  }, [isCashier, activeTab]);

  // Clients are locked to their assigned branch
  useEffect(() => {
    if (isClient && user.branch) {
      setSelectedBranch(user.branch);
    }
  }, [isClient, user.branch]);

  useEffect(() => {
    setTransactions(dashboardData.transactions as Transaction[]);
    setExpenses(dashboardData.expenses as Expense[]);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddToQueue = () => {
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      clientName,
      barber: barbers.find((b) => b.id === selectedBarber)?.name || "",
      service: SERVICES.find((s) => s.id === selectedService)?.name || "",
      cost: SERVICES.find((s) => s.id === selectedService)?.price || 0,
      status: "queued",
    };

    setTransactions([newTransaction, ...transactions]);
    resetPosForm();
    setPosModalOpen(false);
  };

  const resetPosForm = () => {
    setPosStep(1);
    setSelectedBarber(null);
    setSelectedService(null);
    setClientName("");
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Time", "Client Name", "Barber", "Service", "Cost", "Status"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.time,
      t.clientName,
      t.barber,
      t.service,
      t.cost.toString(),
      t.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.barber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = startDate ? t.date >= startDate : true;
    const matchesEndDate = endDate ? t.date <= endDate : true;
    const matchesBranch = selectedBranch === "all" || (t.branch || "Main Branch") === selectedBranch;
    return matchesSearch && matchesStartDate && matchesEndDate && matchesBranch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Revenue calculations
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.cost, 0);
  const todayTransactions = filteredTransactions.filter(
    (t) => t.date === new Date().toISOString().split("T")[0]
  );
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.cost, 0);
  const serviceTrendData = BARBER_SPECIALTIES.map((label) => ({
    label,
    count: todayTransactions.filter((t) => getServiceCategory(t.service) === label).length,
  }));

  // Monthly revenue for charts (filtered by branch)
  const monthlyRevenue = filteredTransactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + t.cost;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month: new Date(month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    revenue,
  }));

  // Service breakdown for pie chart (filtered by branch)
  const serviceBreakdown = filteredTransactions.reduce((acc, t) => {
    acc[t.service] = (acc[t.service] || 0) + t.cost;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(serviceBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#737373", "#16a34a", "#f59e0b", "#fbbf24"];

  // Expense calculations (filtered by branch)
  const filteredExpenses = selectedBranch === "all" 
    ? expenses 
    : expenses.filter((e) => (e.branch || "Main Branch") === selectedBranch);
  
  const currentMonthKey = new Date().toISOString().substring(0, 7);
  const getLatestExpenseMonthKey = (branch?: string) => {
    const latest = expenses
      .filter((e) => (branch ? (e.branch || "Main Branch") === branch : true))
      .reduce((max, e) => (e.month > max ? e.month : max), "");

    return latest || currentMonthKey;
  };
  const aggregatedExpensesByMonth = filteredExpenses.reduce((acc, e) => {
    const existing = acc[e.month] || {
      electricity: 0,
      water: 0,
      rent: 0,
      other: 0,
    };

    acc[e.month] = {
      electricity: existing.electricity + e.electricity,
      water: existing.water + e.water,
      rent: existing.rent + e.rent,
      other: existing.other + e.other,
    };

    return acc;
  }, {} as Record<string, { electricity: number; water: number; rent: number; other: number }>);

  const expenseSummaryMonthKey = getLatestExpenseMonthKey(
    selectedBranch === "all" ? undefined : selectedBranch
  );
  const currentMonthExpenses = aggregatedExpensesByMonth[expenseSummaryMonthKey];
  const totalExpenses = currentMonthExpenses
    ? currentMonthExpenses.electricity + currentMonthExpenses.water + currentMonthExpenses.rent + currentMonthExpenses.other
    : 0;
  const monthlyExpenses = Object.entries(aggregatedExpensesByMonth)
    .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
    .map(([month, totals]) => ({
      month,
      label: new Date(month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      electricity: totals.electricity,
      water: totals.water,
      rent: totals.rent,
      other: totals.other,
      total: totals.electricity + totals.water + totals.rent + totals.other,
    }));
  const monthlyFinancials = monthlyExpenses.map((row) => {
    const revenue = monthlyRevenue[row.month] || 0;
    return {
      month: row.month,
      label: row.label,
      revenue,
      expenses: row.total,
      roi: row.total > 0 ? ((revenue - row.total) / row.total) * 100 : 0,
    };
  });
  const getBranchFinancialSummary = (branch?: string) => {
    const summaryMonthKey = getLatestExpenseMonthKey(branch);
    const branchTransactions = transactions.filter((t) => {
      if (t.status !== "completed") return false;
      if (!t.date.startsWith(summaryMonthKey)) return false;
      return branch ? (t.branch || "Main Branch") === branch : true;
    });
    const branchRevenue = branchTransactions.reduce((sum, t) => sum + t.cost, 0);

    const branchCurrentMonthExpense = expenses.find((e) => {
      if (e.month !== summaryMonthKey) return false;
      return branch ? (e.branch || "Main Branch") === branch : true;
    });
    const branchExpensesTotal = branchCurrentMonthExpense
      ? branchCurrentMonthExpense.electricity +
        branchCurrentMonthExpense.water +
        branchCurrentMonthExpense.rent +
        branchCurrentMonthExpense.other
      : 0;
    const branchNet = branchRevenue - branchExpensesTotal;
    const branchRoi = branchExpensesTotal > 0 ? (branchNet / branchExpensesTotal) * 100 : 0;

    return {
      revenue: branchRevenue,
      expenses: branchExpensesTotal,
      net: branchNet,
      roi: branchRoi,
    };
  };

  // ROI Calculation (filtered by branch)
  const currentMonthRevenue = filteredTransactions
    .filter((t) => t.date.startsWith(expenseSummaryMonthKey))
    .reduce((sum, t) => sum + t.cost, 0);

  const netProfit = currentMonthRevenue - totalExpenses;
  const roi = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100) : 0;

  // Revenue Split (60% Barber / 40% Shop)
  const BARBER_SHARE = 0.6;
  const SHOP_SHARE = 0.4;

  // Barber performance with 60/40 split (filtered by branch)
  const barberPerformance = barbers.map((barber) => {
    const barberTransactions = filteredTransactions.filter((t) => t.barber === barber.name);
    const totalRevenue = barberTransactions.reduce((sum, t) => sum + t.cost, 0);
    const barberShare = totalRevenue * BARBER_SHARE;
    const shopShare = totalRevenue * SHOP_SHARE;
    return {
      name: barber.name,
      services: barberTransactions.length,
      totalRevenue,
      barberShare,
      shopShare,
    };
  });

  // Total splits for stats
  const totalBarberShare = totalRevenue * BARBER_SHARE;
  const totalShopShare = totalRevenue * SHOP_SHARE;

  return (
    <div className="min-h-screen bg-(--page-bg)">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-(--border) bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-(--brand) to-(--brand-strong) p-2 rounded-xl shadow-sm">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-(--text) block">
                  Barbershop POS
                </span>
                <span className="text-xs text-(--muted) capitalize">{user.role} view</span>
                {user.branch && (
                  <span className="text-xs text-(--brand) flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" />
                    {user.branch}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button
                variant={activeTab === "overview" ? "primary" : "outline"}
                size="sm"
                onClick={() => setActiveTab("overview")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </Button>
              {(isAdmin || isClient) && (
                <>
                  <Button
                    variant={activeTab === "expenses" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("expenses")}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    Expenses & ROI
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddBarberModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Barber
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddUserModalOpen(true)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                  )}
                </>
              )}
              <div className="w-px h-6 bg-(--border)" />
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-(--border) bg-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-(--text)" />
              ) : (
                <Menu className="w-5 h-5 text-(--text)" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-(--border) pt-4 flex flex-col gap-2">
              <Button
                variant={activeTab === "overview" ? "primary" : "outline"}
                size="sm"
                fullWidth
                onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </Button>
              {(isAdmin || isClient) && (
                <Button
                  variant={activeTab === "expenses" ? "primary" : "outline"}
                  size="sm"
                  fullWidth
                  onClick={() => { setActiveTab("expenses"); setMobileMenuOpen(false); }}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Expenses & ROI
                </Button>
              )}
              {(isAdmin || isClient) && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    setAddBarberModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Barber
                </Button>
              )}
              <Button variant="error" size="sm" fullWidth onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-(--text) mb-1">
                Dashboard
              </h1>
              <p className="text-sm text-(--muted)">
                {isAdmin 
                  ? "Manage queue, view transactions, and track expenses" 
                  : "Manage queue and view daily transactions"}
              </p>
            </div>
            <div className="flex gap-3">
              {activeTab === "expenses" ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setExpensesModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    resetPosForm();
                    setPosModalOpen(true);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  New Service
                </Button>
              )}
            </div>
          </div>

          {activeTab === "overview" && (
            <>
              {/* Branch Selector Cards - Admin Only */}
              {isAdmin && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-(--text) mb-3">Select Branch to View Data</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* All Branches Card */}
                    <button
                      onClick={() => setSelectedBranch("all")}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedBranch === "all"
                          ? "border-(--brand) bg-(--primary-light)"
                          : "border-(--border) bg-white hover:border-(--brand)"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-(--brand)" />
                        <span className="font-semibold text-(--text)">All Branches</span>
                      </div>
                      <p className="text-xs text-(--muted)">Combined data from all locations</p>
                    </button>
                    {/* Individual Branch Cards */}
                    {branches.map((branch) => {
                      const branchTxnCount = transactions.filter(t => (t.branch || "Main Branch") === branch && t.status === "completed").length;
                      const branchRevenue = transactions.filter(t => (t.branch || "Main Branch") === branch && t.status === "completed").reduce((sum, t) => sum + t.cost, 0);
                      return (
                        <button
                          key={branch}
                          onClick={() => setSelectedBranch(branch)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedBranch === branch
                              ? "border-(--brand) bg-(--primary-light)"
                              : "border-(--border) bg-white hover:border-(--brand)"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="w-5 h-5 text-(--brand)" />
                            <span className="font-semibold text-(--text) truncate">{branch}</span>
                          </div>
                          <p className="text-xs text-(--muted)">{branchTxnCount} services • {formatCurrency(branchRevenue)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className={`grid gap-4 mb-6 ${isAdmin ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Today&apos;s Services
                      </p>
                      <p className="text-3xl font-bold text-(--text)">
                        {todayTransactions.length}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <Calendar className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </Card>

                {isAdmin && (
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                          Today&apos;s Revenue
                        </p>
                        <p className="text-3xl font-bold text-(--text)">
                          {formatCurrency(todayRevenue)}
                        </p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-xl">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </Card>
                )}

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Total Clients
                      </p>
                      <p className="text-3xl font-bold text-(--text)">
                        {filteredTransactions.length}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <UserCircle className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </Card>

                {isAdmin && (
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                          Total Revenue
                        </p>
                        <p className="text-3xl font-bold text-(--text)">
                          {formatCurrency(totalRevenue)}
                        </p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-xl">
                        <Scissors className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Revenue Split Stats - Admin Only */}
              {isAdmin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="p-5 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Barbers&apos; Share (60%)
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(totalBarberShare)}
                      </p>
                      <p className="text-xs text-(--muted) mt-1">
                        Total earnings for all barbers
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl">
                      <UserCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-l-4 border-l-gray-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Shop Income (40%)
                      </p>
                      <p className="text-3xl font-bold text-gray-600">
                        {formatCurrency(totalShopShare)}
                      </p>
                      <p className="text-xs text-(--muted) mt-1">
                        Shop revenue before expenses
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <Building className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </Card>
              </div>
              )}

              {/* Charts Row - Admin Only */}
              {isAdmin && (
              <>
              <Card className="p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-(--text)">Chart Choices</p>
                    <p className="text-xs text-(--muted)">Switch chart types for available datasets.</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-(--muted)">Revenue Trend</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={revenueChartType === "bar" ? "primary" : "outline"}
                          onClick={() => setRevenueChartType("bar")}
                        >
                          Bar
                        </Button>
                        <Button
                          size="sm"
                          variant={revenueChartType === "line" ? "primary" : "outline"}
                          onClick={() => setRevenueChartType("line")}
                        >
                          Line
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-(--muted)">Service Breakdown</span>
                      <Button size="sm" variant="outline" disabled>
                        Pie
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-(--text) mb-4">
                    Monthly Revenue Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    {revenueChartType === "bar" ? (
                      <BarChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => formatCurrency(Number(value || 0))}
                        />
                        <Bar dataKey="revenue" fill="#737373" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    ) : (
                      <LineChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                          formatter={(value) => formatCurrency(Number(value || 0))}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#737373"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-(--text) mb-4">
                    Service Revenue Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => formatCurrency(Number(value || 0))}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
              </>
              )}

              {/* Service Trends - For Cashier */}
              {isCashier && (
              <Card className="p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h3 className="text-sm font-semibold text-(--text)">
                    Today&apos;s Service Trends
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-(--muted)">Chart</span>
                    <Button
                      size="sm"
                      variant={serviceTrendChartType === "bar" ? "primary" : "outline"}
                      onClick={() => setServiceTrendChartType("bar")}
                    >
                      Bar
                    </Button>
                    <Button
                      size="sm"
                      variant={serviceTrendChartType === "area" ? "primary" : "outline"}
                      onClick={() => setServiceTrendChartType("area")}
                    >
                      Area
                    </Button>
                  </div>
                </div>
                {todayTransactions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 text-center">
                      {serviceTrendData.map((row) => (
                        <div key={row.label} className="flex-1 rounded-lg border border-(--border) p-3">
                          <p className="text-xs text-(--muted)">{row.label}</p>
                          <p className="text-2xl font-bold text-(--text)">{row.count}</p>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      {serviceTrendChartType === "bar" ? (
                        <BarChart data={serviceTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                          <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                            }}
                            formatter={(value) => [`${value} services`, "Count"]}
                          />
                          <Bar dataKey="count" fill="#737373" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : (
                        <AreaChart data={serviceTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                          <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                            }}
                            formatter={(value) => [`${value} services`, "Count"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#737373"
                            fill="#e5e5e5"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8 text-(--muted)">
                    <Clock3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No services today</p>
                  </div>
                )}
              </Card>
              )}
            </>
          )}

          {activeTab === "expenses" && (
            <>
              {/* Branch Selector Cards - Admin Only */}
              {isAdmin && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-(--text) mb-3">Select Branch to View Expenses & ROI Data</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {/* All Branches Card */}
                    <button
                      onClick={() => setSelectedBranch("all")}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedBranch === "all"
                          ? "border-(--brand) bg-(--primary-light)"
                          : "border-(--border) bg-white hover:border-(--brand)"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="w-5 h-5 text-(--brand)" />
                        <span className="font-semibold text-(--text)">All Branches</span>
                      </div>
                      {(() => {
                        const allSummary = getBranchFinancialSummary();
                        return (
                          <div className="space-y-1 text-xs text-(--muted)">
                            <p>Revenue: {formatCurrency(allSummary.revenue)}</p>
                            <p>Expenses: {formatCurrency(allSummary.expenses)}</p>
                            <p>ROI: {allSummary.roi.toFixed(1)}%</p>
                          </div>
                        );
                      })()}
                    </button>
                    {/* Individual Branch Cards */}
                    {branches.map((branch) => {
                      const branchSummary = getBranchFinancialSummary(branch);
                      return (
                        <button
                          key={branch}
                          onClick={() => setSelectedBranch(branch)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedBranch === branch
                              ? "border-(--brand) bg-(--primary-light)"
                              : "border-(--border) bg-white hover:border-(--brand)"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="w-5 h-5 text-(--brand)" />
                            <span className="font-semibold text-(--text) truncate">{branch}</span>
                          </div>
                          <div className="space-y-1 text-xs text-(--muted)">
                            <p>Revenue: {formatCurrency(branchSummary.revenue)}</p>
                            <p>Expenses: {formatCurrency(branchSummary.expenses)}</p>
                            <p>ROI: {branchSummary.roi.toFixed(1)}%</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ROI Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Monthly Revenue
                      </p>
                      <p className="text-3xl font-bold text-(--text)">
                        {formatCurrency(currentMonthRevenue)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Monthly Expenses
                      </p>
                      <p className="text-3xl font-bold text-(--text)">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <Receipt className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Net Profit
                      </p>
                      <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-yellow-600"}`}>
                        {formatCurrency(netProfit)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${netProfit >= 0 ? "bg-green-100" : "bg-yellow-100"}`}>
                      {netProfit >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        ROI
                      </p>
                      <p className={`text-3xl font-bold ${roi >= 0 ? "text-green-600" : "text-yellow-600"}`}>
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${roi >= 0 ? "bg-green-100" : "bg-yellow-100"}`}>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Revenue Split Stats for Expenses Tab */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card className="p-5 border-l-4 border-l-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Barbers&apos; Share (60%)
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(currentMonthRevenue * BARBER_SHARE)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-xl">
                      <UserCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-l-4 border-l-gray-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Shop Income (40%)
                      </p>
                      <p className="text-2xl font-bold text-gray-600">
                        {formatCurrency(currentMonthRevenue * SHOP_SHARE)}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <Building className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5 border-l-4 border-l-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-(--muted) mb-1">
                        Shop Net (After Expenses)
                      </p>
                      <p className={`text-2xl font-bold ${((currentMonthRevenue * SHOP_SHARE) - totalExpenses) >= 0 ? "text-green-600" : "text-yellow-600"}`}>
                        {formatCurrency((currentMonthRevenue * SHOP_SHARE) - totalExpenses)}
                      </p>
                    </div>
                    <div className={`p-2 rounded-xl ${((currentMonthRevenue * SHOP_SHARE) - totalExpenses) >= 0 ? "bg-green-100" : "bg-yellow-100"}`}>
                      <Wallet className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-(--text)">Chart Choices</p>
                    <p className="text-xs text-(--muted)">Switch chart types for available datasets.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-(--muted)">Expenses Breakdown</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={expenseChartType === "bar" ? "primary" : "outline"}
                        onClick={() => setExpenseChartType("bar")}
                      >
                        Bar
                      </Button>
                      <Button
                        size="sm"
                        variant={expenseChartType === "line" ? "primary" : "outline"}
                        onClick={() => setExpenseChartType("line")}
                      >
                        Line
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Expense Breakdown Chart */}
              <Card className="p-6 mb-6">
                <h3 className="text-sm font-semibold text-(--text) mb-4">
                  Monthly Expenses Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  {expenseChartType === "bar" ? (
                    <BarChart data={monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => formatCurrency(Number(value || 0))}
                      />
                      <Legend />
                      <Bar dataKey="electricity" fill="#f59e0b" name="Electricity" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="water" fill="#22c55e" name="Water" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rent" fill="#fbbf24" name="Rent" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="other" fill="#737373" name="Other" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={monthlyExpenses}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => formatCurrency(Number(value || 0))}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="water" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="rent" stroke="#fbbf24" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="other" stroke="#737373" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-(--text)">
                    Monthly Sales, Expenses, ROI
                  </h3>
                  <Badge variant="neutral">Per Month</Badge>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>ROI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {monthlyFinancials.map((row) => (
                        <TableRow key={row.month}>
                          <TableCell className="font-medium">{row.label}</TableCell>
                          <TableCell>{formatCurrency(row.revenue)}</TableCell>
                          <TableCell>{formatCurrency(row.expenses)}</TableCell>
                          <TableCell className={row.roi >= 0 ? "text-green-600" : "text-yellow-600"}>
                            {row.roi.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>

              {/* Current Month Expense Details */}
              {currentMonthExpenses && (
                <div className="grid sm:grid-cols-4 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium text-(--muted)">Electricity</span>
                    </div>
                    <p className="text-xl font-bold text-(--text)">
                      {formatCurrency(currentMonthExpenses.electricity)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Droplet className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-(--muted)">Water</span>
                    </div>
                    <p className="text-xl font-bold text-(--text)">
                      {formatCurrency(currentMonthExpenses.water)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <Building className="w-5 h-5 text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium text-(--muted)">Rent</span>
                    </div>
                    <p className="text-xl font-bold text-(--text)">
                      {formatCurrency(currentMonthExpenses.rent)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Receipt className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-(--muted)">Other</span>
                    </div>
                    <p className="text-xl font-bold text-(--text)">
                      {formatCurrency(currentMonthExpenses.other)}
                    </p>
                  </Card>
                </div>
              )}

              {/* Branch Sales Analytics Table */}
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-(--text)">
                      Branch Sales Analytics
                    </h3>
                    <p className="text-xs text-(--muted)">
                      {selectedBranch === "all" 
                        ? "Sales performance across all branch locations" 
                        : `Sales performance for ${selectedBranch}`}
                    </p>
                  </div>
                </div>

                {/* Branch Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {branches.map((branch) => {
                    const branchTransactions = transactions.filter((t) => (t.branch || "Main Branch") === branch && t.status === "completed");
                    const branchRevenue = branchTransactions.reduce((sum, t) => sum + t.cost, 0);
                    const branchCount = branchTransactions.length;

                    if (selectedBranch !== "all" && selectedBranch !== branch) return null;

                    return (
                      <Card key={branch} className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-(--brand)" />
                          <span className="text-xs font-medium text-(--muted) truncate">{branch}</span>
                        </div>
                        <p className="text-2xl font-bold text-(--text) mb-1">
                          {formatCurrency(branchRevenue)}
                        </p>
                        <p className="text-xs text-(--muted)">
                          {branchCount} transaction{branchCount !== 1 ? "s" : ""}
                        </p>
                      </Card>
                    );
                  })}
                </div>

                {/* Branch Sales Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead>Total Sales</TableHead>
                        <TableHead>Transactions</TableHead>
                        <TableHead>Avg. per Transaction</TableHead>
                        <TableHead>Barber Share (60%)</TableHead>
                        <TableHead>Shop Income (40%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {branches.map((branch) => {
                        const branchTransactions = transactions.filter((t) => (t.branch || "Main Branch") === branch && t.status === "completed");
                        const branchRevenue = branchTransactions.reduce((sum, t) => sum + t.cost, 0);
                        const branchCount = branchTransactions.length;
                        const avgTransaction = branchCount > 0 ? branchRevenue / branchCount : 0;
                        const barberShare = branchRevenue * BARBER_SHARE;
                        const shopShare = branchRevenue * SHOP_SHARE;

                        if (selectedBranch !== "all" && selectedBranch !== branch) return null;

                        return (
                          <TableRow key={branch}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4 text-(--brand)" />
                                {branch}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{formatCurrency(branchRevenue)}</TableCell>
                            <TableCell>{branchCount}</TableCell>
                            <TableCell>{formatCurrency(avgTransaction)}</TableCell>
                            <TableCell className="text-green-600">{formatCurrency(barberShare)}</TableCell>
                            <TableCell className="text-gray-600">{formatCurrency(shopShare)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </>
          )}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Filters */}
            <Card className="p-4 mb-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full lg:w-80">
                    <Input
                      type="text"
                      placeholder="Search by client, barber, or service..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-(--muted)" />
                        <select
                          value={selectedBranch}
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          className="rounded-lg border border-(--border) bg-white px-3 py-2 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
                        >
                          <option value="all">All Branches</option>
                          {branches.map((branch) => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                        className="rounded-lg border border-(--border) bg-white px-3 py-2 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
                      />
                      <span className="text-sm text-(--muted)">to</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                        className="rounded-lg border border-(--border) bg-white px-3 py-2 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setStartDate("");
                        setEndDate("");
                        setSelectedBranch(isClient && user.branch ? user.branch : "all");
                        setCurrentPage(1);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Chart Data Type Filter - Admin Only */}
                {isAdmin && (
                  <div className="flex items-center gap-4 pt-4 border-t border-(--border)">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-(--muted)" />
                      <span className="text-sm font-medium text-(--text)">Chart Data:</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedChartDataType === "revenue" ? "primary" : "outline"}
                          onClick={() => setSelectedChartDataType("revenue")}
                        >
                          Revenue
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedChartDataType === "services" ? "primary" : "outline"}
                          onClick={() => setSelectedChartDataType("services")}
                        >
                          Services
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedChartDataType === "barber" ? "primary" : "outline"}
                          onClick={() => setSelectedChartDataType("barber")}
                        >
                          Barber
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Transactions Table */}
            <Card>
              <div className="flex items-center justify-between p-4 border-b border-(--border)">
                <h2 className="text-sm font-semibold text-(--text) flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Transaction Queue
                </h2>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Barber</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {paginatedTransactions.map((txn) => (
                    <TableRow key={txn.id} hover>
                      <TableCell>{formatDate(txn.date)}</TableCell>
                      <TableCell>{txn.time}</TableCell>
                      <TableCell className="font-medium">{txn.clientName}</TableCell>
                      <TableCell>{txn.barber}</TableCell>
                      <TableCell>{txn.service}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(txn.cost)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={txn.status === "completed" ? "success" : "warning"}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTransactions(
                                transactions.map((t) =>
                                  t.id === txn.id
                                    ? { ...t, status: t.status === "completed" ? "queued" : "completed" }
                                    : t
                                )
                              );
                            }}
                          >
                            {txn.status === "completed" ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTransaction(txn.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-(--border)">
                  <p className="text-sm text-(--muted)">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                    {filteredTransactions.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <UserCircle className="w-16 h-16 text-(--muted) mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-(--text) mb-2">
                    No Transactions Found
                  </h3>
                  <p className="text-sm text-(--muted) mb-4">
                    {searchTerm || startDate || endDate
                      ? "Try adjusting your filters"
                      : "Start by adding your first service"}
                  </p>
                </div>
              )}
            </Card>
          </>
        )}

        {activeTab === "expenses" && (
          /* Barber Performance Table with 60/40 Split */
          <Card>
            <div className="p-4 border-b border-(--border)">
              <h2 className="text-sm font-semibold text-(--text)">
                Barber Performance & Revenue Split
              </h2>
              <p className="text-xs text-(--muted) mt-1">
                Revenue is split 60% to barber, 40% to shop
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barber</TableHead>
                  <TableHead>Services Done</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Barber Share (60%)</TableHead>
                  <TableHead>Shop Income (40%)</TableHead>
                  <TableHead>Avg. per Service</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {barberPerformance.map((barber) => (
                  <TableRow key={barber.name}>
                    <TableCell className="font-medium">{barber.name}</TableCell>
                    <TableCell>{barber.services}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(barber.totalRevenue)}</TableCell>
                    <TableCell className="font-semibold text-green-600">{formatCurrency(barber.barberShare)}</TableCell>
                    <TableCell className="font-semibold text-gray-600">{formatCurrency(barber.shopShare)}</TableCell>
                    <TableCell>
                      {barber.services > 0 ? formatCurrency(barber.totalRevenue / barber.services) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </main>

      {/* POS Modal - 4 Step Process */}
      <Modal
        isOpen={posModalOpen}
        onClose={() => {
          setPosModalOpen(false);
          resetPosForm();
        }}
        title="New Service Queue"
        footer={
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step === posStep
                      ? "bg-(--brand)"
                      : step < posStep
                      ? "bg-green-500"
                      : "bg-(--border)"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {posStep > 1 && (
                <Button variant="outline" onClick={() => setPosStep(posStep - 1)}>
                  Back
                </Button>
              )}
              {posStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={() => setPosStep(posStep + 1)}
                  disabled={
                    (posStep === 1 && !selectedBarber) ||
                    (posStep === 2 && !selectedService)
                  }
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleAddToQueue}
                  disabled={!clientName.trim()}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Add to Queue
                </Button>
              )}
            </div>
          </div>
        }
      >
        {posStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-(--text) text-center">
              Step 1: Choose a Barber
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {barbers.map((barber) => (
                <button
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedBarber === barber.id
                      ? "border-(--brand) bg-(--primary-light)"
                      : "border-(--border) bg-white hover:border-(--brand)"
                  }`}
                >
                  <div className="text-3xl mb-2">{barber.avatar}</div>
                  <div className="font-semibold text-(--text)">{barber.name}</div>
                  <div className="text-xs text-(--muted)">{barber.specialty}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {posStep === 2 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-(--text) text-center">
              Step 2: Choose a Service
            </h3>
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  selectedService === service.id
                    ? "border-(--brand) bg-(--primary-light)"
                    : "border-(--border) bg-white hover:border-(--brand)"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-(--text)">{service.name}</div>
                  <div className="text-xs text-(--muted)">Duration: {service.duration}</div>
                </div>
                <div className="font-bold text-(--text)">
                  ₱{service.price.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}

        {posStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-(--text) text-center">
              Step 3: Client Information
            </h3>
            <div className="bg-(--muted-light) p-4 rounded-xl space-y-2">
              <p className="text-sm text-(--muted)">
                Barber: <span className="font-semibold text-(--text)">
                  {barbers.find((b) => b.id === selectedBarber)?.name}
                </span>
              </p>
              <p className="text-sm text-(--muted)">
                Service: <span className="font-semibold text-(--text)">
                  {SERVICES.find((s) => s.id === selectedService)?.name}
                </span>
              </p>
            </div>
            <Input
              type="text"
              label="Client Name"
              placeholder="Enter client full name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              autoFocus
            />
          </div>
        )}

        {posStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-(--text) text-center">
              Step 4: Confirm & Add to Queue
            </h3>
            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-(--muted)">Barber</span>
                <span className="font-semibold text-(--text)">
                  {barbers.find((b) => b.id === selectedBarber)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-(--muted)">Service</span>
                <span className="font-semibold text-(--text)">
                  {SERVICES.find((s) => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-(--muted)">Client</span>
                <span className="font-semibold text-(--text)">{clientName}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-(--border)">
                <span className="font-medium text-(--text)">Total Cost</span>
                <span className="font-bold text-(--brand)">
                  ₱{SERVICES.find((s) => s.id === selectedService)?.price.toLocaleString()}
                </span>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Expenses Modal */}
      <Modal
        isOpen={expensesModalOpen}
        onClose={() => setExpensesModalOpen(false)}
        title="Add Monthly Expenses"
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => setExpensesModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setExpensesModalOpen(false)} className="flex-1">
              Save Expenses
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="month"
            label="Month"
            defaultValue={new Date().toISOString().substring(0, 7)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-(--muted) mb-1.5 block">
                <Zap className="w-4 h-4 inline mr-1" />
                Electricity
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-(--muted) mb-1.5 block">
                <Droplet className="w-4 h-4 inline mr-1" />
                Water
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-(--muted) mb-1.5 block">
                <Building className="w-4 h-4 inline mr-1" />
                Rent
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-(--muted) mb-1.5 block">
                <Receipt className="w-4 h-4 inline mr-1" />
                Other
              </label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Barber Modal */}
      <Modal
        isOpen={addBarberModalOpen}
        onClose={() => {
          setAddBarberModalOpen(false);
          setNewBarber({ name: "", specialty: "Haircut", branch: "Main Branch" });
        }}
        title="Add Barber"
        footer={
          <div className="flex gap-2 w-full">
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
                if (newBarber.name.trim()) {
                  setBarbers([
                    ...barbers,
                    {
                      id: `barber_${Date.now()}`,
                      name: newBarber.name.trim(),
                      avatar: "👤",
                      specialty: newBarber.specialty,
                      branch: newBarber.branch,
                    },
                  ]);
                  setNewBarber({ name: "", specialty: "Haircut", branch: "Main Branch" });
                  setAddBarberModalOpen(false);
                }
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
            onChange={(e) => setNewBarber({ ...newBarber, name: e.target.value })}
            icon={<User className="w-4 h-4" />}
          />
          <div>
            <label className="text-sm font-medium text-(--muted) mb-1.5 block">
              <Scissors className="w-4 h-4 inline mr-1" />
              Specialty
            </label>
            <select
              value={newBarber.specialty}
              onChange={(e) =>
                setNewBarber({
                  ...newBarber,
                  specialty: e.target.value as typeof BARBER_SPECIALTIES[number],
                })
              }
              className="w-full rounded-lg border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
            >
              {BARBER_SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-(--muted) mb-1.5 block">
              <Building className="w-4 h-4 inline mr-1" />
              Branch Location
            </label>
            <select
              value={newBarber.branch}
              onChange={(e) => setNewBarber({ ...newBarber, branch: e.target.value })}
              className="w-full rounded-lg border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
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

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => {
          setAddUserModalOpen(false);
          setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
        }}
        title="Add New User"
        footer={
          <div className="flex gap-2 w-full">
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
                if (newUser.username && newUser.password) {
                  addUser({
                    username: newUser.username,
                    password: newUser.password,
                    role: newUser.role,
                    branch: newUser.branch,
                  });
                  setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
                  setAddUserModalOpen(false);
                }
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
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            icon={<User className="w-4 h-4" />}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            icon={<User className="w-4 h-4" />}
          />
          <div>
            <label className="text-sm font-medium text-(--muted) mb-1.5 block">
              <Users className="w-4 h-4 inline mr-1" />
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  role: e.target.value as "admin" | "cashier" | "client",
                })
              }
              className="w-full rounded-lg border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-(--muted) mb-1.5 block">
              <Building className="w-4 h-4 inline mr-1" />
              Branch Location
            </label>
            <select
              value={newUser.branch}
              onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
              className="w-full rounded-lg border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Existing Users List */}
          {users.length > 0 && (
            <div className="mt-6 pt-4 border-t border-(--border)">
              <h4 className="text-sm font-semibold text-(--text) mb-3">Existing Users</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.map((storedUser) => (
                  <div key={storedUser.id} className="flex items-center justify-between p-2 rounded-lg bg-(--muted-light)">
                    <div>
                      <p className="text-sm font-medium text-(--text)">{storedUser.username}</p>
                      <p className="text-xs text-(--muted) flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {storedUser.role}
                      </p>
                      {storedUser.branch && (
                        <p className="text-xs text-(--muted) flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {storedUser.branch}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUser(storedUser.username)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Trash2 className="w-4 h-4" />
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
