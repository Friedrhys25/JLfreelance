"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import {
  Scissors,
  Percent,
  Tag,
  Save,
  Plus,
  Trash2,
  Home,
  Settings,
  LogOut,
  Menu,
  X as XIcon,
  DollarSign,
} from "lucide-react";

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [taxRate, setTaxRate] = useState("10");
  const [currency, setCurrency] = useState("USD");
  const [discountCodes, setDiscountCodes] = useState([
    { code: "WELCOME10", type: "percentage", value: 10, status: "active" },
    { code: "FIRSTVISIT", type: "fixed", value: 5, status: "active" },
    { code: "SUMMER20", type: "percentage", value: 20, status: "inactive" },
  ]);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
  });

  const handleAddDiscount = () => {
    if (newDiscount.code && newDiscount.value) {
      setDiscountCodes([
        ...discountCodes,
        {
          code: newDiscount.code.toUpperCase(),
          type: newDiscount.type,
          value: parseFloat(newDiscount.value),
          status: "active" as "active" | "inactive",
        },
      ]);
      setNewDiscount({ code: "", type: "percentage", value: "" });
    }
  };

  const handleDeleteDiscount = (code: string) => {
    setDiscountCodes(discountCodes.filter((d) => d.code !== code));
  };

  const handleToggleDiscount = (code: string) => {
    setDiscountCodes(
      discountCodes.map((d) =>
        d.code === code
          ? { ...d, status: d.status === "active" ? "inactive" : "active" }
          : d
      )
    );
  };

  const handleSave = () => {
    console.log("Saving settings:", { taxRate, currency, discountCodes });
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 border-b border-(--border) bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--brand) text-white shadow-(--shadow)">
                <Scissors className="h-5 w-5" />
              </div>
              <span className="hidden text-lg font-semibold tracking-tight text-(--text) sm:block">
                Barbershop POS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Services
                </Button>
              </Link>
              <Button variant="error" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-xl border border-(--border) bg-white p-2 text-(--text) shadow-sm"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-2 border-t border-(--border) pb-4 pt-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" fullWidth>
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/services">
                <Button variant="outline" size="sm" fullWidth>
                  <Settings className="h-4 w-4" />
                  Services
                </Button>
              </Link>
              <Button variant="error" size="sm" fullWidth>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-(--text)">
                Tax & Discount Settings
              </h1>
              <p className="text-sm text-(--muted)">
                Module 2 - Configure tax rates and discount codes
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Tax Settings */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Percent className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-(--text)">
                Tax Configuration
              </h2>
            </div>

            <div className="space-y-6">
              <Input
                type="number"
                label="Default Tax Rate (%)"
                placeholder="10"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                icon={<Percent className="w-5 h-5" />}
                min="0"
                max="100"
              />

              <div>
                <label className="text-sm font-medium text-(--muted)">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="PHP">PHP - Philippine Peso</option>
                </select>
              </div>

              <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
                <h4 className="text-sm font-semibold text-(--text) mb-3">
                  Tax Calculation Preview
                </h4>
                <div className="space-y-2 text-sm text-(--muted)">
                  <div className="flex justify-between">
                    <span>
                      Service Price:
                    </span>
                    <span className="font-semibold text-(--text)">$35.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Tax ({taxRate}%):
                    </span>
                    <span className="font-semibold text-(--text)">
                      ${(35 * parseFloat(taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-(--border) pt-2">
                    <span>Total:</span>
                    <span className="font-semibold text-(--text)">
                      ${(35 * (1 + parseFloat(taxRate) / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Discount Codes */}
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <Tag className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-(--text)">
                Discount Codes
              </h2>
            </div>

            {/* Add New Discount */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  label="Code"
                  placeholder="CODE123"
                  value={newDiscount.code}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, code: e.target.value })
                  }
                />
                <div>
                  <label className="text-sm font-medium text-(--muted)">
                    Type
                  </label>
                  <select
                    value={newDiscount.type}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  >
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed $</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Input
                  type="number"
                  label="Value"
                  placeholder={
                    newDiscount.type === "percentage" ? "10" : "5.00"
                  }
                  value={newDiscount.value}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, value: e.target.value })
                  }
                  icon={
                    newDiscount.type === "percentage" ? (
                      <Percent className="w-5 h-5" />
                    ) : (
                      <DollarSign className="w-5 h-5" />
                    )
                  }
                />
                <div className="flex items-end">
                  <Button variant="primary" onClick={handleAddDiscount}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Discount List */}
            <div className="space-y-3">
              {discountCodes.map((discount) => (
                <div
                  key={discount.code}
                  className="flex items-center justify-between rounded-2xl border border-(--border) bg-white px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        discount.status === "active"
                          ? "bg-emerald-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-(--text)">
                          {discount.code}
                        </span>
                        <Badge
                          variant={
                            discount.status === "active" ? "success" : "neutral"
                          }
                          size="sm"
                        >
                          {discount.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-(--muted)">
                        {discount.type === "percentage"
                          ? `${discount.value}% off`
                          : `$${discount.value.toFixed(2)} off`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleDiscount(discount.code)}
                    >
                      {discount.status === "active" ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="error"
                      size="sm"
                      onClick={() => handleDeleteDiscount(discount.code)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button variant="primary" size="lg" onClick={handleSave}>
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-(--text) mb-4">
            How It Works
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-(--text) mb-2">
                <Percent className="h-5 w-5" />
                Tax Rates
              </h4>
              <p className="text-sm text-(--muted)">
                The default tax rate is applied to all services automatically
                during checkout. You can override this for individual services
                in the service catalog.
              </p>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-(--text) mb-2">
                <Tag className="h-5 w-5" />
                Discount Codes
              </h4>
              <p className="text-sm text-(--muted)">
                Create promotional codes that cashiers can apply during
                checkout. Percentage discounts are applied before fixed amount
                discounts.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

