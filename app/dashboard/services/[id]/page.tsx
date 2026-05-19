"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import { Modal } from "@/app/components/Modal";
import {
  Scissors,
  ArrowLeft,
  DollarSign,
  Percent,
  Clock,
  Edit,
  Trash2,
  Home,
  Settings,
  LogOut,
  Menu,
  X as XIcon,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";

// Mock service data
const mockService = {
  id: "1",
  name: "Haircut",
  description:
    "Professional haircut service including consultation, wash, cut, and style. Our experienced barbers will work with you to achieve your desired look.",
  price: 35.0,
  taxRate: 10,
  status: "active" as "active" | "inactive",
  duration: "30 min",
  createdAt: "2026-01-15",
  updatedAt: "2026-04-20",
  totalBookings: 245,
  revenue: 8575.0,
  rating: 4.8,
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const service = mockService;
  const priceWithTax = service.price * (1 + service.taxRate / 100);

  const handleDelete = () => {
    console.log("Deleting service:", params.id);
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
        {/* Back Button */}
          <Link href="/dashboard/services" className="inline-flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header Card */}
            <Card className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-(--brand)">
                    <Scissors className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-semibold text-(--text)">
                        {service.name}
                      </h1>
                      <Badge
                        variant={service.status === "active" ? "success" : "neutral"}
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-(--muted)">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 border-t border-(--border) pt-6">
                <Link href={`/dashboard/services/${service.id}/edit`}>
                  <Button variant="secondary" size="md">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Service
                  </Button>
                </Link>
                <Button
                  variant="error"
                  size="md"
                  onClick={() => setDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>

            {/* Service Details */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold text-(--text) mb-6">
                Service Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Base Price
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    ${service.price.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Percent className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Tax Rate
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    {service.taxRate}%
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Duration
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    {service.duration}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border) bg-(--surface-alt) p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Price with Tax
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    ${priceWithTax.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Timestamps */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-(--text) mb-4">
                History
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-(--muted)" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-(--muted)">
                      Created
                    </p>
                    <p className="text-sm font-semibold text-(--text)">
                      {service.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-(--muted)" />
                  <div>
                    <p className="text-xs font-semibold uppercase text-(--muted)">
                      Last Updated
                    </p>
                    <p className="text-sm font-semibold text-(--text)">
                      {service.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card variant="gradient" className="p-6">
              <h2 className="text-lg font-semibold text-(--text) mb-6">
                Performance
              </h2>

              <div className="space-y-4">
                <div className="rounded-2xl border border-(--border) bg-white p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Total Bookings
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    {service.totalBookings}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border) bg-white p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Total Revenue
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    ${service.revenue.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border) bg-white p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-6 w-6 text-(--muted)" />
                    <span className="text-xs font-semibold uppercase text-(--muted)">
                      Customer Rating
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-(--text)">
                    {service.rating}
                    <span className="text-sm text-(--muted)">
                      {" "}
                      / 5.0
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-(--text) mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link href="/dashboard/services" className="block">
                  <Button variant="outline" size="md" fullWidth>
                    View All Services
                  </Button>
                </Link>
                <Link href="/dashboard/services/new" className="block">
                  <Button variant="primary" size="md" fullWidth>
                    Add New Service
                  </Button>
                </Link>
                <Link href="/dashboard/settings" className="block">
                  <Button variant="secondary" size="md" fullWidth>
                    Tax Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete} className="flex-1">
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--text) mb-3">
          Are you sure you want to delete &quot;{service.name}&quot;?
        </p>
        <p className="text-sm text-(--error)">
          This action cannot be undone. All associated booking data will be
          archived.
        </p>
      </Modal>
    </div>
  );
}
