"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
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
  expenseChartType: "bar" | "area";
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
  onExpenseChartTypeChange: (type: "bar" | "area") => void;
}

export function DashboardExpenses({
  barberPerformance,
  expenseChartType,
  formatCurrency,
  monthlyExpenses,
  monthlyFinancials,
  netProfit,
  onExpenseChartTypeChange,
  roi,
  selectedBranch,
  totalExpenses,
  totalRevenue,
}: DashboardExpensesProps) {
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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyFinancials}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="label" stroke="#525252" />
              <YAxis stroke="#525252" />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#171717" strokeWidth={3} dot={{ fill: "#171717" }} />
              <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">Expense Breakdown</h2>
            <p className="text-sm text-[var(--muted)]">Utilities and operating costs by month.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={expenseChartType === "bar" ? "primary" : "outline"}
              size="sm"
              onClick={() => onExpenseChartTypeChange("bar")}
            >
              Bars
            </Button>
            <Button
              variant={expenseChartType === "area" ? "primary" : "outline"}
              size="sm"
              onClick={() => onExpenseChartTypeChange("area")}
            >
              Area
            </Button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {expenseChartType === "bar" ? (
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="label" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="electricity" stackId="a" fill="#171717" />
                <Bar dataKey="water" stackId="a" fill="#737373" />
                <Bar dataKey="rent" stackId="a" fill="#f59e0b" />
                <Bar dataKey="other" stackId="a" fill="#d4d4d4" />
              </BarChart>
            ) : (
              <AreaChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="label" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="electricity" stackId="1" stroke="#171717" fill="#171717" fillOpacity={0.85} />
                <Area type="monotone" dataKey="water" stackId="1" stroke="#737373" fill="#737373" fillOpacity={0.85} />
                <Area type="monotone" dataKey="rent" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.85} />
                <Area type="monotone" dataKey="other" stackId="1" stroke="#d4d4d4" fill="#d4d4d4" fillOpacity={0.9} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="border-b border-[var(--border)] p-5">
          <h2 className="text-lg font-semibold text-[var(--text)]">Barber Revenue Split</h2>
          <p className="text-sm text-[var(--muted)]">60% barber share and 40% shop share based on filtered revenue.</p>
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
