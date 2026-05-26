"use client";

import { DollarSign, Percent, Plus, Save, Settings, Tag, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";

interface DiscountCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  status: "active" | "inactive";
}

interface NewDiscountForm {
  code: string;
  type: "percentage" | "fixed";
  value: string;
}

interface SettingsContentProps {
  currency: string;
  discountCodes: DiscountCode[];
  newDiscount: NewDiscountForm;
  taxRate: string;
  onAddDiscount: () => void;
  onCurrencyChange: (value: string) => void;
  onDeleteDiscount: (code: string) => void;
  onNewDiscountChange: (value: NewDiscountForm) => void;
  onSave: () => void;
  onTaxRateChange: (value: string) => void;
  onToggleDiscount: (code: string) => void;
}

export function SettingsContent({
  currency,
  discountCodes,
  newDiscount,
  onAddDiscount,
  onCurrencyChange,
  onDeleteDiscount,
  onNewDiscountChange,
  onSave,
  onTaxRateChange,
  onToggleDiscount,
  taxRate,
}: SettingsContentProps) {
  const parsedTaxRate = Number.parseFloat(taxRate || "0");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-(--text)">Tax & Discount Settings</h1>
            <p className="text-sm text-(--muted)">Module 2 - Configure tax rates and discount codes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <Percent className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-(--text)">Tax Configuration</h2>
          </div>

          <div className="space-y-6">
            <Input
              type="number"
              label="Default Tax Rate (%)"
              placeholder="10"
              value={taxRate}
              onChange={(event) => onTaxRateChange(event.target.value)}
              icon={<Percent className="h-5 w-5" />}
              min="0"
              max="100"
            />

            <div>
              <label className="text-sm font-medium text-(--muted)">Currency</label>
              <select
                value={currency}
                onChange={(event) => onCurrencyChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="PHP">PHP - Philippine Peso</option>
              </select>
            </div>

            <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
              <h4 className="mb-3 text-sm font-semibold text-(--text)">Tax Calculation Preview</h4>
              <div className="space-y-2 text-sm text-(--muted)">
                <div className="flex justify-between">
                  <span>Service Price:</span>
                  <span className="font-semibold text-(--text)">$35.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-semibold text-(--text)">${((35 * parsedTaxRate) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-(--border) pt-2">
                  <span>Total:</span>
                  <span className="font-semibold text-(--text)">${(35 * (1 + parsedTaxRate / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
              <Tag className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-(--text)">Discount Codes</h2>
          </div>

          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                label="Code"
                placeholder="CODE123"
                value={newDiscount.code}
                onChange={(event) => onNewDiscountChange({ ...newDiscount, code: event.target.value })}
              />
              <div>
                <label className="text-sm font-medium text-(--muted)">Type</label>
                <select
                  value={newDiscount.type}
                  onChange={(event) =>
                    onNewDiscountChange({
                      ...newDiscount,
                      type: event.target.value as "percentage" | "fixed",
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
                placeholder={newDiscount.type === "percentage" ? "10" : "5.00"}
                value={newDiscount.value}
                onChange={(event) => onNewDiscountChange({ ...newDiscount, value: event.target.value })}
                icon={
                  newDiscount.type === "percentage" ? (
                    <Percent className="h-5 w-5" />
                  ) : (
                    <DollarSign className="h-5 w-5" />
                  )
                }
              />
              <div className="flex items-end">
                <Button variant="primary" onClick={onAddDiscount}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {discountCodes.map((discount) => (
              <div
                key={discount.code}
                className="flex items-center justify-between rounded-2xl border border-(--border) bg-white px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${discount.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-(--text)">{discount.code}</span>
                      <Badge variant={discount.status === "active" ? "success" : "neutral"} size="sm">
                        {discount.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-(--muted)">
                      {discount.type === "percentage" ? `${discount.value}% off` : `$${discount.value.toFixed(2)} off`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onToggleDiscount(discount.code)}>
                    {discount.status === "active" ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="error" size="sm" onClick={() => onDeleteDiscount(discount.code)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="primary" size="lg" onClick={onSave}>
          <Save className="mr-2 h-5 w-5" />
          Save Settings
        </Button>
      </div>

      <Card className="mt-8 p-6">
        <h3 className="mb-4 text-lg font-semibold text-(--text)">How It Works</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--text)">
              <Percent className="h-5 w-5" />
              Tax Rates
            </h4>
            <p className="text-sm text-(--muted)">
              The default tax rate is applied to all services automatically during checkout. You can override this for
              individual services in the service catalog.
            </p>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-(--text)">
              <Tag className="h-5 w-5" />
              Discount Codes
            </h4>
            <p className="text-sm text-(--muted)">
              Create promotional codes that cashiers can apply during checkout. Percentage discounts are applied before
              fixed amount discounts.
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}
