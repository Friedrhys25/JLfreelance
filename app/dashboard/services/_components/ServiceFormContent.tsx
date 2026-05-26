"use client";

import Link from "next/link";
import { ArrowLeft, Clock, DollarSign, FileText, Percent, Save, Scissors, X } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";

interface ServiceFormState {
  name: string;
  description: string;
  price: string;
  taxRate: string;
  duration: string;
  status: "active" | "inactive";
}

interface ServiceFormContentProps {
  backHref: string;
  description: string;
  formData: ServiceFormState;
  onFormChange: (next: ServiceFormState) => void;
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
  title: string;
}

export function ServiceFormContent({
  backHref,
  description,
  formData,
  onFormChange,
  onSubmit,
  submitLabel,
  title,
}: ServiceFormContentProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={backHref} className="mb-4 inline-flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>

        <div className="mb-2 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <Scissors className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-(--text)">{title}</h1>
            <p className="text-sm text-(--muted)">{description}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <Input
                type="text"
                label="Service Name"
                placeholder="e.g., Haircut, Hair Color, Beard Trim"
                value={formData.name}
                onChange={(event) => onFormChange({ ...formData, name: event.target.value })}
                icon={<Scissors className="h-5 w-5" />}
                required
              />

              <div>
                <label className="text-sm font-medium text-(--muted)">Description</label>
                <textarea
                  placeholder="Describe the service..."
                  value={formData.description}
                  onChange={(event) => onFormChange({ ...formData, description: event.target.value })}
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  label="Price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(event) => onFormChange({ ...formData, price: event.target.value })}
                  icon={<DollarSign className="h-5 w-5" />}
                  step="0.01"
                  min="0"
                  required
                />
                <Input
                  type="number"
                  label="Tax Rate (%)"
                  placeholder="10"
                  value={formData.taxRate}
                  onChange={(event) => onFormChange({ ...formData, taxRate: event.target.value })}
                  icon={<Percent className="h-5 w-5" />}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <Input
                type="text"
                label="Duration"
                placeholder="e.g., 30 min, 1 hour"
                value={formData.duration}
                onChange={(event) => onFormChange({ ...formData, duration: event.target.value })}
                icon={<Clock className="h-5 w-5" />}
                required
              />

              <div>
                <label className="text-sm font-medium text-(--muted)">Service Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onFormChange({ ...formData, status: "active" })}
                    className={`flex-1 rounded-2xl border px-4 py-4 text-left transition ${
                      formData.status === "active"
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-(--border) bg-white hover:border-emerald-300"
                    }`}
                  >
                    <Badge variant="success" size="md">
                      Active
                    </Badge>
                    <p className="mt-2 text-xs text-(--muted)">Service is available for booking</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onFormChange({ ...formData, status: "inactive" })}
                    className={`flex-1 rounded-2xl border px-4 py-4 text-left transition ${
                      formData.status === "inactive"
                        ? "border-slate-300 bg-slate-100"
                        : "border-(--border) bg-white hover:border-slate-300"
                    }`}
                  >
                    <Badge variant="neutral" size="md">
                      Inactive
                    </Badge>
                    <p className="mt-2 text-xs text-(--muted)">Service is hidden from booking</p>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="primary" size="lg">
                  <Save className="mr-2 h-5 w-5" />
                  {submitLabel}
                </Button>
                <Link href={backHref}>
                  <Button type="button" variant="outline" size="lg">
                    <X className="mr-2 h-5 w-5" />
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="gradient" className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-(--text)">
              <FileText className="h-5 w-5" />
              Preview
            </h3>
            <div className="space-y-3">
              <div className="rounded-2xl border border-(--border) bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-(--text)">{formData.name || "Service Name"}</h4>
                  <Badge variant={formData.status === "active" ? "success" : "neutral"}>{formData.status}</Badge>
                </div>
                <p className="mb-3 text-xs text-(--muted)">{formData.description || "Service description..."}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-(--text)">${formData.price || "0.00"}</span>
                  <span className="text-(--muted)">{formData.duration || "0 min"}</span>
                </div>
                <div className="mt-2 border-t border-(--border) pt-2">
                  <span className="text-xs text-(--muted)">Tax: {formData.taxRate || 0}%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-(--text)">Quick Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm text-(--muted)">Use clear, descriptive names that customers understand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />
                <span className="text-sm text-(--muted)">Set competitive prices based on your market</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm text-(--muted)">Accurate duration helps with scheduling</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
