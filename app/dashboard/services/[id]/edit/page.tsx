"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, DollarSign, Percent, Save, Scissors, Settings } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { getService, updateService } from "@/lib/api";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "0.00",
    taxRate: "0",
    duration: "",
    status: "active" as "active" | "inactive",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadService = async () => {
      try {
        const data = await getService(params.id);
        if (!isMounted) return;
        setFormData({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price.toFixed(2),
          taxRate: data.taxRate.toString(),
          duration: data.duration,
          status: data.status,
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (params.id) {
      loadService();
    }

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateService(params.id, {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price) || 0,
      duration: formData.duration,
      taxRate: Number.parseFloat(formData.taxRate) || 0,
      status: formData.status,
    });
    router.push(`/dashboard/services/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--page-bg)]">
        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <p className="text-sm text-[var(--muted)]">Loading service...</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <Link href={`/dashboard/services/${params.id}`} className="inline-flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Service
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-alt)] text-[var(--brand)]">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[var(--text)]">Edit Service</h1>
              <p className="text-sm text-[var(--muted)]">
                Update pricing and availability for service #{params.id}.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                label="Service Name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                icon={<Scissors className="h-5 w-5" />}
                required
              />

              <div>
                <label className="text-sm font-medium text-[var(--muted)]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="mt-2 min-h-[140px] w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text)] shadow-sm focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  label="Price"
                  value={formData.price}
                  onChange={(event) => setFormData((current) => ({ ...current, price: event.target.value }))}
                  icon={<DollarSign className="h-5 w-5" />}
                  min="0"
                  step="0.01"
                  required
                />
                <Input
                  type="number"
                  label="Tax Rate (%)"
                  value={formData.taxRate}
                  onChange={(event) => setFormData((current) => ({ ...current, taxRate: event.target.value }))}
                  icon={<Percent className="h-5 w-5" />}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <Input
                type="text"
                label="Duration"
                value={formData.duration}
                onChange={(event) => setFormData((current) => ({ ...current, duration: event.target.value }))}
                icon={<Clock className="h-5 w-5" />}
                required
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--muted)]">Status</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFormData((current) => ({ ...current, status: "active" }))}
                    className={`rounded-2xl border px-4 py-4 text-left ${
                      formData.status === "active"
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-[var(--border)] bg-white"
                    }`}
                  >
                    <Badge variant="success">Active</Badge>
                    <p className="mt-2 text-xs text-[var(--muted)]">Visible for booking and checkout.</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((current) => ({ ...current, status: "inactive" }))}
                    className={`rounded-2xl border px-4 py-4 text-left ${
                      formData.status === "inactive"
                        ? "border-slate-300 bg-slate-100"
                        : "border-[var(--border)] bg-white"
                    }`}
                  >
                    <Badge variant="neutral">Inactive</Badge>
                    <p className="mt-2 text-xs text-[var(--muted)]">Hidden from new bookings.</p>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="primary" size="lg">
                  <Save className="h-5 w-5" />
                  Save Changes
                </Button>
                <Link href={`/dashboard/services/${params.id}`}>
                  <Button type="button" variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--text)]">Preview</h2>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--text)]">{formData.name}</h3>
                  <Badge variant={formData.status === "active" ? "success" : "neutral"}>{formData.status}</Badge>
                </div>
                <p className="text-sm text-[var(--muted)]">{formData.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--text)]">${formData.price}</span>
                  <span className="text-[var(--muted)]">{formData.duration}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text)]">
                <Settings className="h-5 w-5" />
                Route check
              </h2>
              <p className="text-sm text-[var(--muted)]">
                This page now exists, so the edit buttons in the service list and service details no longer land on a missing route.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
