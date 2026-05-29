"use client";

import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/app/components/Badge";
import { Card } from "@/app/components/Card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/Table";

interface DashboardExpensesProps {
  barberPerformance: Array<{
    name: string;
    services: number;
    totalRevenue: number;
    barberShare: number;
    shopShare: number;
  }>;
  formatCurrency: (amount: number) => string;
  monthlyExpenses: Array<{
    month: string;
    label: string;
    electricity: number;
    water: number;
    rent: number;
    other: number;
    total: number;
  }>;
  monthlyFinancials: Array<{
    month: string;
    label: string;
    revenue: number;
    expenses: number;
    roi: number;
  }>;
  netProfit: number;
  roi: number;
  selectedBranch: string;
  totalExpenses: number;
  totalRevenue: number;
}

const EXPENSE_BREAKDOWN_COLORS = ["#171717", "#737373", "#f59e0b", "#d4d4d4"];

export function DashboardExpenses({
  barberPerformance,
  formatCurrency,
  monthlyExpenses,
  monthlyFinancials,
  netProfit,
  roi,
  selectedBranch,
  totalExpenses,
  totalRevenue,
}: DashboardExpensesProps) {
  const totalBarberShare = barberPerformance.reduce((sum, row) => sum + row.barberShare, 0);
  const totalShopShare = barberPerformance.reduce((sum, row) => sum + row.shopShare, 0);
  const expenseBreakdownData = [
    {
      name: "Electricity",
      value: monthlyExpenses.reduce((sum, row) => sum + row.electricity, 0),
    },
    {
      name: "Water",
      value: monthlyExpenses.reduce((sum, row) => sum + row.water, 0),
    },
    {
      name: "Rent",
      value: monthlyExpenses.reduce((sum, row) => sum + row.rent, 0),
    },
    {
      name: "Other",
      value: monthlyExpenses.reduce((sum, row) => sum + row.other, 0),
    },
  ].filter((item) => item.value > 0);
  const formatTooltipValue = (value: unknown) => {
    if (typeof value === "number") {
      return formatCurrency(value);
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? formatCurrency(parsed) : value;
    }

    return formatCurrency(0);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Expenses</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(totalExpenses)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Net Profit</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{formatCurrency(netProfit)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">ROI</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--text)]">{roi.toFixed(1)}%</p>
        </Card>
      </section>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">Revenue vs Expenses</h2>
            <p className="text-sm text-[var(--muted)]">
              {selectedBranch === "all" ? "All branches" : selectedBranch} monthly performance.
            </p>
          </div>
          <Badge variant="neutral">{monthlyFinancials.length} months</Badge>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="label" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Tooltip formatter={(value) => formatTooltipValue(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={3} dot={{ fill: "#171717" }} />
                <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-[var(--text)]">Expense Breakdown</h3>
              <p className="text-xs text-[var(--muted)]">Cost mix for the selected months.</p>
            </div>
            <div className="h-52">
              {expenseBreakdownData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={3}
                    >
                      {expenseBreakdownData.map((item, index) => (
                        <Cell key={item.name} fill={EXPENSE_BREAKDOWN_COLORS[index % EXPENSE_BREAKDOWN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatTooltipValue(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-full border border-dashed border-[var(--border)] text-xs text-[var(--muted)]">
                  No expenses
                </div>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {expenseBreakdownData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: EXPENSE_BREAKDOWN_COLORS[index % EXPENSE_BREAKDOWN_COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="border-b border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold text-[var(--text)]">Barber Revenue Split</h2>
        </div>

        <div className="grid gap-3 border-b border-[var(--border)] p-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Total Barber Share</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{formatCurrency(totalBarberShare)}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Sum across all barbers in this filter.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Total Shop Share</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{formatCurrency(totalShopShare)}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Sum across all barbers in this filter.</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barber</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Barber Share</TableHead>
              <TableHead>Shop Share</TableHead>
              <TableHead>Avg. Ticket</TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {barberPerformance.map((barber) => (
              <TableRow key={barber.name} hover>
                <TableCell className="font-medium">{barber.name}</TableCell>
                <TableCell>{barber.services}</TableCell>
                <TableCell>{formatCurrency(barber.totalRevenue)}</TableCell>
                <TableCell className="text-green-700">{formatCurrency(barber.barberShare)}</TableCell>
                <TableCell>{formatCurrency(barber.shopShare)}</TableCell>
                <TableCell>
                  {formatCurrency(barber.services > 0 ? barber.totalRevenue / barber.services : 0)}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
