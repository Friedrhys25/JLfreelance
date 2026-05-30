"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import { Modal } from "@/app/components/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { deleteService, getService, type ApiService } from "@/lib/api";
import {
  Scissors,
  ArrowLeft,
  DollarSign,
  Percent,
  Clock,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, isClient, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [service, setService] = useState<ApiService | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const serviceId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  useEffect(() => {
    let isMounted = true;
    const loadService = async () => {
      try {
        const data = await getService(serviceId);
        if (isMounted) setService(data);
      } catch {
        if (isMounted) setService(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const priceWithTax = service ? service.price * (1 + service.taxRate / 100) : 0;

  const handleDelete = async () => {
    if (!serviceId) return;
    await deleteService(serviceId);
    router.push("/dashboard/services");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <DashboardTopBar
          activeTab="overview"
          branch={user.branch ?? undefined}
          canManageUsers={isAdmin}
          canViewExpenses={isAdmin || isClient}
          mobileMenuOpen={mobileMenuOpen}
          role={user.role}
          onLogout={logout}
          onSetMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <p className="text-sm text-(--muted)">Loading service...</p>
          </Card>
        </main>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <DashboardTopBar
          activeTab="overview"
          branch={user.branch ?? undefined}
          canManageUsers={isAdmin}
          canViewExpenses={isAdmin || isClient}
          mobileMenuOpen={mobileMenuOpen}
          role={user.role}
          onLogout={logout}
          onSetMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <p className="text-sm text-(--muted)">Service not found.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab="overview"
        branch={user.branch ?? undefined}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

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
                      {service.createdAt ? new Date(service.createdAt).toLocaleDateString("en-US") : "-"}
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
                      {service.updatedAt ? new Date(service.updatedAt).toLocaleDateString("en-US") : "-"}
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
                    0
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
                    $0.00
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
                    -
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
