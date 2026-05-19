"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import {
  Scissors,
  ArrowLeft,
  DollarSign,
  Percent,
  Clock,
  FileText,
  Save,
  X,
  Home,
  Settings,
  LogOut,
  Menu,
  X as XIcon,
} from "lucide-react";

export default function NewServicePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    taxRate: "10",
    duration: "",
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating service:", formData);
    router.push("/dashboard/services");
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
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" fullWidth>
                  <Settings className="h-4 w-4" />
                  Settings
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
          <Link href="/dashboard/services" className="inline-flex items-center gap-2 mb-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-(--text)">
                Add New Service
              </h1>
              <p className="text-sm text-(--muted)">
                Create a new service for your barbershop
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="text"
                  label="Service Name"
                  placeholder="e.g., Haircut, Hair Color, Beard Trim"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  icon={<Scissors className="w-5 h-5" />}
                  required
                />

                <div>
                  <label className="text-sm font-medium text-(--muted)">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the service..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-2 min-h-[120px] w-full rounded-xl border border-(--border) bg-white px-4 py-3 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type="number"
                      label="Price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      icon={<DollarSign className="w-5 h-5" />}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Input
                      type="number"
                      label="Tax Rate (%)"
                      placeholder="10"
                      value={formData.taxRate}
                      onChange={(e) =>
                        setFormData({ ...formData, taxRate: e.target.value })
                      }
                      icon={<Percent className="w-5 h-5" />}
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    label="Duration"
                    placeholder="e.g., 30 min, 1 hour"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    icon={<Clock className="w-5 h-5" />}
                    required
                  />
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="text-sm font-medium text-(--muted)">
                    Service Status
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "active" })
                      }
                      className={`flex-1 rounded-2xl border px-4 py-4 text-left transition ${
                        formData.status === "active"
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-(--border) bg-white hover:border-emerald-300"
                      }`}
                    >
                      <Badge variant="success" size="md">
                        Active
                      </Badge>
                      <p className="mt-2 text-xs text-(--muted)">
                        Service is available for booking
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, status: "inactive" })
                      }
                      className={`flex-1 rounded-2xl border px-4 py-4 text-left transition ${
                        formData.status === "inactive"
                          ? "border-slate-300 bg-slate-100"
                          : "border-(--border) bg-white hover:border-slate-300"
                      }`}
                    >
                      <Badge variant="neutral" size="md">
                        Inactive
                      </Badge>
                      <p className="mt-2 text-xs text-(--muted)">
                        Service is hidden from booking
                      </p>
                    </button>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="primary" size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Save Service
                  </Button>
                  <Link href="/dashboard/services">
                    <Button type="button" variant="outline" size="lg">
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar - Preview & Info */}
          <div className="space-y-6">
            {/* Service Preview */}
            <Card variant="gradient" className="p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-(--text) mb-4">
                <FileText className="h-5 w-5" />
                Preview
              </h3>
              <div className="space-y-3">
                <div className="rounded-2xl border border-(--border) bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-(--text)">
                      {formData.name || "Service Name"}
                    </h4>
                    <Badge
                      variant={
                        formData.status === "active" ? "success" : "neutral"
                      }
                    >
                      {formData.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-(--muted) mb-3">
                    {formData.description || "Service description..."}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-(--text)">
                      ${formData.price || "0.00"}
                    </span>
                    <span className="text-(--muted)">
                      {formData.duration || "0 min"}
                    </span>
                  </div>
                  <div className="mt-2 border-t border-(--border) pt-2">
                    <span className="text-xs text-(--muted)">
                      Tax: {formData.taxRate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-(--text) mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
                  <span className="text-sm text-(--muted)">
                    Use clear, descriptive names that customers understand
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />
                  <span className="text-sm text-(--muted)">
                    Set competitive prices based on your market
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-sm text-(--muted)">
                    Accurate duration helps with scheduling
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

