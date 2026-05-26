"use client";

import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Modal } from "@/app/components/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceCatalogContent } from "@/app/dashboard/services/_components/ServiceCatalogContent";
import { mockServices } from "@/app/dashboard/services/service-data";

export function ServicesPageContent() {
  const { isAdmin, isClient, logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedService(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting service:", selectedService);
    setDeleteModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab={null}
        activeShortcut="services"
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

      <ServiceCatalogContent
        filteredServices={filteredServices}
        searchTerm={searchTerm}
        services={mockServices}
        onDelete={handleDelete}
        onSearchTermChange={setSearchTerm}
      />

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Service"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="error" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--text)">
          Are you sure you want to delete this service? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
