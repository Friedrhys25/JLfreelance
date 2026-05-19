"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Badge } from "@/app/components/Badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/Table";
import { Modal } from "@/app/components/Modal";
import {
  Scissors,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Percent,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

// Mock data for services
const mockServices = [
  {
    id: "1",
    name: "Haircut",
    description: "Professional haircut service",
    price: 35.0,
    taxRate: 10,
    status: "active",
    duration: "30 min",
  },
  {
    id: "2",
    name: "Hair Color",
    description: "Full hair coloring service",
    price: 85.0,
    taxRate: 10,
    status: "active",
    duration: "90 min",
  },
  {
    id: "3",
    name: "Hair Treatment",
    description: "Deep conditioning treatment",
    price: 50.0,
    taxRate: 10,
    status: "active",
    duration: "45 min",
  },
  {
    id: "4",
    name: "Beard Trim",
    description: "Professional beard shaping",
    price: 20.0,
    taxRate: 10,
    status: "inactive",
    duration: "15 min",
  },
];

export default function ServicesDashboard() {
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

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-xl border border-(--border) bg-white p-2 text-(--text) shadow-sm"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-(--text) mb-2">
                Service Catalog
              </h1>
              <p className="text-sm text-(--muted)">
                Module 2 - Manage services, pricing, and availability
              </p>
            </div>
            <Link href="/dashboard/services/new">
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Service
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-(--brand)">
                  <Scissors className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-(--muted)">
                    Total Services
                  </p>
                  <p className="text-2xl font-semibold text-(--text)">
                    {mockServices.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-(--muted)">
                    Avg. Price
                  </p>
                  <p className="text-2xl font-semibold text-(--text)">
                    $
                    {(
                      mockServices.reduce((acc, s) => acc + s.price, 0) /
                      mockServices.length
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-(--muted)">
                    Tax Rate
                  </p>
                  <p className="text-2xl font-semibold text-(--text)">
                    {mockServices[0]?.taxRate || 0}%
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-(--border) bg-white px-4 py-3 pl-11 text-sm text-(--text) shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-(--brand)"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-(--muted)" />
            </div>
            <Link href="/dashboard/settings">
              <Button variant="secondary" size="md">
                <Settings className="h-4 w-4" />
                Tax & Discount Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Services Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredServices.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell>
                    <div>
                      <div className="text-sm font-semibold text-(--text)">
                        {service.name}
                      </div>
                      <div className="text-xs text-(--muted)">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-(--text)">
                      ${service.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-(--text)">
                      {service.taxRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-(--text)">
                      {service.duration}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "active" ? "success" : "neutral"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/services/${service.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/services/${service.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="error"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <Card className="mt-4 py-12 text-center">
            <Scissors className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-semibold text-(--text) mb-2">
              No Services Found
            </h3>
            <p className="text-sm text-(--muted) mb-4">
              {searchTerm
                ? "Try adjusting your search term"
                : "Get started by adding your first service"}
            </p>
            {!searchTerm && (
              <Link href="/dashboard/services/new">
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Service
                </Button>
              </Link>
            )}
          </Card>
        )}
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
            <Button variant="error" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--text)">
          Are you sure you want to delete this service? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}

