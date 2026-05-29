"use client";

import { BarChart, Bar, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Building, Calendar, Clock3, Download, Plus, Trash2, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/Table";
import type { Barber, Transaction } from "@/app/dashboard/types";
import type { ApiBranch } from "@/lib/api";

interface OverviewProps {
  barbers: Barber[];
  branches: ApiBranch[];
  currentPage: number;
  endDate: string;
  filteredTransactions: Transaction[];
  isCashier: boolean;
  isBranchLocked: boolean;
  lockedBranchId?: string | null;
  paginatedTransactions: Transaction[];
  revenueChartData: Array<{ month: string; revenue: number }>;
  revenueChartType: "bar" | "line";
  selectedBranch: string;
  startDate: string;
  todayRevenue: number;
  totalPages: number;
  totalRevenue: number;
  totalTransactions: number;
  pieChartData: Array<{ name: string; value: number }>;
  queueCount: number;
  onDeleteTransaction: (id: string) => void;
  onExportCSV: () => void;
  onOpenQueueModal: () => void;
  onPageChange: (page: number) => void;
  onRevenueChartTypeChange: (type: "bar" | "line") => void;
  onSelectedBranchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

const PIE_COLORS = ["#737373", "#16a34a", "#f59e0b", "#d4d4d4", "#0f172a"];

export function DashboardOverview({
  barbers,
  branches,
  currentPage,
  endDate,
  filteredTransactions,
  formatCurrency,
  formatDate,
  isCashier,
  isBranchLocked,
  lockedBranchId,
  onDeleteTransaction,
  onEndDateChange,
  onExportCSV,
  onOpenQueueModal,
  onPageChange,
  onRevenueChartTypeChange,
  onSelectedBranchChange,
  onStartDateChange,
  paginatedTransactions,
  pieChartData,
  queueCount,
  revenueChartData,
  revenueChartType,
  selectedBranch,
  startDate,
  todayRevenue,
  totalPages,
  totalRevenue,
  totalTransactions,
}: OverviewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Actions</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Create a queue entry or export the current view.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="md" onClick={onOpenQueueModal}>
              <Plus className="h-4 w-4" />
              Add Queue
            </Button>
            <Button variant="outline" size="md" onClick={onExportCSV}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {!isCashier && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Total Revenue
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(totalRevenue)}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Filtered revenue across selected dates and branch.</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Today Revenue
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(todayRevenue)}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Based on today&apos;s completed and queued entries.</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Transactions
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{totalTransactions}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Filtered records currently shown in the table.</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Queue Status
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{queueCount}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{barbers.length} barbers available for assignment.</p>
          </Card>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Revenue Trend</h2>
              <p className="text-sm text-[var(--muted)]">Monthly gross revenue for the filtered dataset.</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={revenueChartType === "bar" ? "primary" : "outline"}
                size="sm"
                onClick={() => onRevenueChartTypeChange("bar")}
              >
                Bars
              </Button>
              <Button
                variant={revenueChartType === "line" ? "primary" : "outline"}
                size="sm"
                onClick={() => onRevenueChartTypeChange("line")}
              >
                Line
              </Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {revenueChartType === "bar" ? (
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#525252" />
                  <YAxis stroke="#525252" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                  <Bar dataKey="revenue" radius={[12, 12, 0, 0]} fill="#737373" />
                </BarChart>
              ) : (
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#525252" />
                  <YAxis stroke="#525252" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                  <Line type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={3} dot={{ fill: "#171717" }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">Service Mix</h2>
              <p className="text-sm text-[var(--muted)]">Revenue split by service type.</p>
            </div>
            <TrendingUp className="h-5 w-5 text-[var(--muted)]" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieChartData.map((item, index) => (
                    <Cell key={item.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            icon={<Calendar className="h-4 w-4" />}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            icon={<Calendar className="h-4 w-4" />}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--muted)]">Branch</label>
            <select
              value={selectedBranch}
              onChange={(event) => onSelectedBranchChange(event.target.value)}
              disabled={isBranchLocked}
              className="h-10 rounded-lg border border-[var(--border)] bg-white px-4 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)] disabled:bg-[var(--surface-alt)]"
            >
              {!isBranchLocked && <option value="all">All branches</option>}
              {(isBranchLocked && lockedBranchId ? branches.filter((branch) => branch.id === lockedBranchId) : branches).map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
              {isBranchLocked && !lockedBranchId && <option value="">No branch assigned</option>}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">Transaction History</h2>
            <p className="text-sm text-[var(--muted)]">
              {filteredTransactions.length} matching records across the current filters.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="neutral">{selectedBranch === "all" ? "All branches" : selectedBranch}</Badge>
            <Badge variant="neutral">{queueCount} queued</Badge>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.time}</TableCell>
                    <TableCell className="font-medium">{transaction.clientName}</TableCell>
                    <TableCell>{transaction.barber}</TableCell>
                    <TableCell>{transaction.service}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-[var(--muted)]" />
                        {transaction.branch ?? "Main Branch"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === "completed" ? "success" : "neutral"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(transaction.cost)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => onDeleteTransaction(transaction.id)}>
                        <Trash2 className="h-4 w-4 text-yellow-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 p-5">
                <p className="text-sm text-[var(--muted)]">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <Clock3 className="mx-auto h-12 w-12 text-neutral-300" />
            <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">No transactions found</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Adjust the filters or create a new queue entry to populate the table.
            </p>
          </div>
        )}
      </Card>

      {!isCashier && (
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-alt)]">
                <Users className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Barbers</p>
                <p className="text-2xl font-semibold text-[var(--text)]">{barbers.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-alt)]">
                <Building className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Branches</p>
                <p className="text-2xl font-semibold text-[var(--text)]">{branches.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-alt)]">
                <TrendingUp className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Average Ticket</p>
                <p className="text-2xl font-semibold text-[var(--text)]">
                  {formatCurrency(totalTransactions > 0 ? totalRevenue / totalTransactions : 0)}
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
