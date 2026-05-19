"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Plus,
  X as XIcon,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  time: string;
  clientName: string;
  barber: string;
  service: string;
  cost: number;
  status: string;
}

interface Expense {
  id: string;
  month: string;
  electricity: number;
  water: number;
  rent: number;
  other: number;
}

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posModalOpen, setPosModalOpen] = useState(false);
  const [expensesModalOpen, setExpensesModalOpen] = useState(false);
  const [posStep, setPosStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "expenses">("overview");
  const [revenueChartType, setRevenueChartType] = useState<"bar" | "line">("bar");
  const [expenseChartType, setExpenseChartType] = useState<"bar" | "line">("bar");
  const itemsPerPage = 10;

  const mockData = {
    services: [
      { id: "1", name: "Haircut", price: 2699, duration: "30 min" },
      { id: "2", name: "Haircut with Treatment", price: 3100, duration: "45 min" },
      { id: "3", name: "Hair Color", price: 1699, duration: "60 min" },
    ],
    barbers: [
      { id: "1", name: "Marco", avatar: "👨‍🦱", specialty: "Fade & Taper" },
      { id: "2", name: "Andre", avatar: "🧔", specialty: "Classic Cuts" },
      { id: "3", name: "Jun", avatar: "👨", specialty: "Color Specialist" },
      { id: "4", name: "Rico", avatar: "🧑", specialty: "Beard & Mustache" },
    ],
  };

  useEffect(() => {
    fetch("/data/mockData.json")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions);
        setExpenses(data.expenses);
      })
      .catch(() => {
        setTransactions([]);
        setExpenses([]);
      });
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
      barber: mockData.barbers.find((b) => b.id === selectedBarber)?.name || "",
      service: mockData.services.find((s) => s.id === selectedService)?.name || "",
      cost: mockData.services.find((s) => s.id === selectedService)?.price || 0,
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
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Revenue calculations
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.cost, 0);
  const todayTransactions = transactions.filter(
    (t) => t.date === new Date().toISOString().split("T")[0]
  );
  const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.cost, 0);

  // Monthly revenue for charts
  const monthlyRevenue = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7);
    acc[month] = (acc[month] || 0) + t.cost;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month: new Date(month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    revenue,
  }));

  // Service breakdown for pie chart
  const serviceBreakdown = transactions.reduce((acc, t) => {
    acc[t.service] = (acc[t.service] || 0) + t.cost;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(serviceBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"];

  // Expense calculations
  const currentMonthExpenses = expenses.find((e) => e.month === new Date().toISOString().substring(0, 7));
  const totalExpenses = currentMonthExpenses
    ? currentMonthExpenses.electricity + currentMonthExpenses.water + currentMonthExpenses.rent + currentMonthExpenses.other
    : 0;
  const monthlyExpenses = expenses.map((e) => ({
    month: new Date(e.month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    electricity: e.electricity,
    water: e.water,
    rent: e.rent,
    other: e.other,
    total: e.electricity + e.water + e.rent + e.other,
  }));
  const monthlyFinancials = expenses.map((e) => {
    const revenue = monthlyRevenue[e.month] || 0;
    const total = e.electricity + e.water + e.rent + e.other;
    const roiValue = total > 0 ? ((revenue - total) / total) * 100 : 0;
    return {
      month: new Date(e.month).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      revenue,
      expenses: total,
      roi: roiValue,
    };
  });

  // ROI Calculation
  const currentMonthRevenue = transactions
    .filter((t) => t.date.startsWith(new Date().toISOString().substring(0, 7)))
    .reduce((sum, t) => sum + t.cost, 0);
  
  const netProfit = currentMonthRevenue - totalExpenses;
  const roi = totalExpenses > 0 ? ((netProfit / totalExpenses) * 100) : 0;

  // Barber performance
  const barberPerformance = mockData.barbers.map((barber) => {
    const barberTransactions = transactions.filter((t) => t.barber === barber.name);
    const revenue = barberTransactions.reduce((sum, t) => sum + t.cost, 0);
    return {
      name: barber.name,
      services: barberTransactions.length,
      revenue,
    };
  });

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[var(--brand)] to-[var(--brand-strong)] p-2 rounded-xl shadow-sm">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-[var(--text)] hidden sm:block">
                Barbershop POS
              </span>
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
              <Button
                variant={activeTab === "expenses" ? "primary" : "outline"}
                size="sm"
                onClick={() => setActiveTab("expenses")}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Expenses & ROI
              </Button>
              <div className="w-px h-6 bg-[var(--border)]" />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--border)] bg-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--text)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--text)]" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[var(--border)] pt-4 flex flex-col gap-2">
              <Button
                variant={activeTab === "overview" ? "primary" : "outline"}
                size="sm"
                fullWidth
                onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeTab === "expenses" ? "primary" : "outline"}
                size="sm"
                fullWidth
                onClick={() => { setActiveTab("expenses"); setMobileMenuOpen(false); }}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Expenses & ROI
              </Button>
              <Link href="/login">
                <Button variant="error" size="sm" fullWidth>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
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
              <h1 className="text-3xl font-bold text-[var(--text)] mb-1">
                {activeTab === "overview" ? "Dashboard" : "Expenses & ROI"}
              </h1>
              <p className="text-sm text-[var(--muted)]">
                {activeTab === "overview" 
                  ? "Manage queue and view transactions" 
                  : "Track branch expenses and calculate ROI"}
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Today&apos;s Services
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {todayTransactions.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Today&apos;s Revenue
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {formatCurrency(todayRevenue)}
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Total Clients
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {filteredTransactions.length}
                      </p>
                    </div>
                    <div className="bg-sky-100 p-3 rounded-xl">
                      <UserCircle className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {formatCurrency(totalRevenue)}
                      </p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <Scissors className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Chart Choices</p>
                    <p className="text-xs text-[var(--muted)]">Switch chart types for available datasets.</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[var(--muted)]">Revenue Trend</span>
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
                      <span className="text-xs font-medium text-[var(--muted)]">Service Breakdown</span>
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
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
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
                        <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
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
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
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

          {activeTab === "expenses" && (
            <>
              {/* ROI Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Monthly Revenue
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {formatCurrency(currentMonthRevenue)}
                      </p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Monthly Expenses
                      </p>
                      <p className="text-3xl font-bold text-[var(--text)]">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-xl">
                      <Receipt className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        Net Profit
                      </p>
                      <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {formatCurrency(netProfit)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${netProfit >= 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                      {netProfit >= 0 ? (
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                        ROI
                      </p>
                      <p className={`text-3xl font-bold ${roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${roi >= 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-5 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">Chart Choices</p>
                    <p className="text-xs text-[var(--muted)]">Switch chart types for available datasets.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--muted)]">Expenses Breakdown</span>
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
                <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
                  Monthly Expenses Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  {expenseChartType === "bar" ? (
                    <BarChart data={monthlyExpenses}>
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
                      <Legend />
                      <Bar dataKey="electricity" fill="#f59e0b" name="Electricity" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="water" fill="#0ea5e9" name="Water" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rent" fill="#ef4444" name="Rent" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="other" fill="#64748b" name="Other" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={monthlyExpenses}>
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
                      <Legend />
                      <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="water" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="rent" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="other" stroke="#64748b" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Monthly Sales, Expenses, ROI
                  </h3>
                  <Badge variant="outline">Per Month</Badge>
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
                          <TableCell className="font-medium">{row.month}</TableCell>
                          <TableCell>{formatCurrency(row.revenue)}</TableCell>
                          <TableCell>{formatCurrency(row.expenses)}</TableCell>
                          <TableCell className={row.roi >= 0 ? "text-emerald-600" : "text-red-600"}>
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
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Zap className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">Electricity</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--text)]">
                      {formatCurrency(currentMonthExpenses.electricity)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-sky-100 p-2 rounded-lg">
                        <Droplet className="w-5 h-5 text-sky-600" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">Water</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--text)]">
                      {formatCurrency(currentMonthExpenses.water)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Building className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">Rent</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--text)]">
                      {formatCurrency(currentMonthExpenses.rent)}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <Receipt className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">Other</span>
                    </div>
                    <p className="text-xl font-bold text-[var(--text)]">
                      {formatCurrency(currentMonthExpenses.other)}
                    </p>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Filters */}
            <Card className="p-4 mb-6">
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
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                      className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
                    />
                    <span className="text-sm text-[var(--muted)]">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                      className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStartDate("");
                      setEndDate("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            {/* Transactions Table */}
            <Card>
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2 className="text-sm font-semibold text-[var(--text)] flex items-center gap-2">
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
                <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
                  <p className="text-sm text-[var(--muted)]">
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
                  <UserCircle className="w-16 h-16 text-[var(--muted)] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                    No Transactions Found
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4">
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
          /* Barber Performance Table */
          <Card>
            <div className="p-4 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">
                Barber Performance
              </h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barber</TableHead>
                  <TableHead>Services Done</TableHead>
                  <TableHead>Revenue Generated</TableHead>
                  <TableHead>Avg. per Service</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {barberPerformance.map((barber) => (
                  <TableRow key={barber.name}>
                    <TableCell className="font-medium">{barber.name}</TableCell>
                    <TableCell>{barber.services}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(barber.revenue)}</TableCell>
                    <TableCell>
                      {barber.services > 0 ? formatCurrency(barber.revenue / barber.services) : "-"}
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
                      ? "bg-[var(--brand)]"
                      : step < posStep
                      ? "bg-emerald-500"
                      : "bg-[var(--border)]"
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
            <h3 className="text-base font-semibold text-[var(--text)] text-center">
              Step 1: Choose a Barber
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {mockData.barbers.map((barber) => (
                <button
                  key={barber.id}
                  onClick={() => setSelectedBarber(barber.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedBarber === barber.id
                      ? "border-[var(--brand)] bg-[var(--primary-light)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
                  }`}
                >
                  <div className="text-3xl mb-2">{barber.avatar}</div>
                  <div className="font-semibold text-[var(--text)]">{barber.name}</div>
                  <div className="text-xs text-[var(--muted)]">{barber.specialty}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {posStep === 2 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[var(--text)] text-center">
              Step 2: Choose a Service
            </h3>
            {mockData.services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  selectedService === service.id
                    ? "border-[var(--brand)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] bg-white hover:border-[var(--brand)]"
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold text-[var(--text)]">{service.name}</div>
                  <div className="text-xs text-[var(--muted)]">Duration: {service.duration}</div>
                </div>
                <div className="font-bold text-[var(--text)]">
                  ₱{service.price.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}

        {posStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[var(--text)] text-center">
              Step 3: Client Information
            </h3>
            <div className="bg-[var(--muted-light)] p-4 rounded-xl space-y-2">
              <p className="text-sm text-[var(--muted)]">
                Barber: <span className="font-semibold text-[var(--text)]">
                  {mockData.barbers.find((b) => b.id === selectedBarber)?.name}
                </span>
              </p>
              <p className="text-sm text-[var(--muted)]">
                Service: <span className="font-semibold text-[var(--text)]">
                  {mockData.services.find((s) => s.id === selectedService)?.name}
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
            <h3 className="text-base font-semibold text-[var(--text)] text-center">
              Step 4: Confirm & Add to Queue
            </h3>
            <Card className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Barber</span>
                <span className="font-semibold text-[var(--text)]">
                  {mockData.barbers.find((b) => b.id === selectedBarber)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Service</span>
                <span className="font-semibold text-[var(--text)]">
                  {mockData.services.find((s) => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Client</span>
                <span className="font-semibold text-[var(--text)]">{clientName}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                <span className="font-medium text-[var(--text)]">Total Cost</span>
                <span className="font-bold text-[var(--brand)]">
                  ₱{mockData.services.find((s) => s.id === selectedService)?.price.toLocaleString()}
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
              <label className="text-sm font-medium text-[var(--muted)] mb-1.5 block">
                <Zap className="w-4 h-4 inline mr-1" />
                Electricity
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--muted)] mb-1.5 block">
                <Droplet className="w-4 h-4 inline mr-1" />
                Water
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--muted)] mb-1.5 block">
                <Building className="w-4 h-4 inline mr-1" />
                Rent
              </label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--muted)] mb-1.5 block">
                <Receipt className="w-4 h-4 inline mr-1" />
                Other
              </label>
              <Input type="number" placeholder="0" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
