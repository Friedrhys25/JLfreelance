"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceFormContent } from "@/app/dashboard/services/_components/ServiceFormContent";
import { createService } from "@/lib/api";

export function NewServicePageContent() {
  const router = useRouter();
  const { isAdmin, isClient, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    taxRate: "10",
    duration: "",
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createService({
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price) || 0,
      duration: formData.duration,
      taxRate: Number.parseFloat(formData.taxRate) || 0,
      status: formData.status,
    });
    router.push("/dashboard/services");
  };

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab={null}
        branch={user.branch ?? undefined}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

      <ServiceFormContent
        backHref="/dashboard/services"
        description="Create a new service for your barbershop"
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        submitLabel="Save Service"
        title="Add New Service"
      />
    </div>
  );
}
