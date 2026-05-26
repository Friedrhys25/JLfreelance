"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceFormContent } from "@/app/dashboard/services/_components/ServiceFormContent";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Creating service:", formData);
    router.push("/dashboard/services");
  };

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab={null}
        activeShortcut="new-service"
        branch={user.branch}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onOpenBarberModal={() => {}}
        onOpenUserModal={() => {}}
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
