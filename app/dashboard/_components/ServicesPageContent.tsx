"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/Button";
import { Modal } from "@/app/components/Modal";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceCatalogContent } from "@/app/dashboard/services/_components/ServiceCatalogContent";
import { deleteService, listServices, type ApiService } from "@/lib/api";

export function ServicesPageContent() {
  const { isAdmin, isClient, logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<ApiService[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const data = await listServices();
        if (isMounted) setServices(data);
      } catch {
        if (isMounted) setServices([]);
      }
    };

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedService(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;
    await deleteService(selectedService);
    setServices((current) => current.filter((service) => service.id !== selectedService));
    setDeleteModalOpen(false);
    setSelectedService(null);
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

      <ServiceCatalogContent
        filteredServices={filteredServices}
        searchTerm={searchTerm}
        services={services}
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
