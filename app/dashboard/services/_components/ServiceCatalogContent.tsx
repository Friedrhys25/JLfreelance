"use client";

import Link from "next/link";
import { DollarSign, Edit, Eye, Percent, Plus, Scissors, Search, Settings, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/Table";
import type { ServiceCatalogItem } from "@/app/dashboard/services/service-data";

interface ServiceCatalogContentProps {
  filteredServices: ServiceCatalogItem[];
  searchTerm: string;
  services: ServiceCatalogItem[];
  onDelete: (id: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function ServiceCatalogContent({
  filteredServices,
  onDelete,
  onSearchTermChange,
  searchTerm,
  services,
}: ServiceCatalogContentProps) {
  const averagePrice =
    services.length > 0
      ? (services.reduce((total, service) => total + service.price, 0) / services.length).toFixed(2)
      : "0.00";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-semibold text-(--text)">Service Catalog</h1>
            <p className="text-sm text-(--muted)">Module 2 - Manage services, pricing, and availability</p>
          </div>
          <Link href="/dashboard/services/new">
            <Button variant="primary" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Service
            </Button>
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
                <Scissors className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-(--muted)">Total Services</p>
                <p className="text-2xl font-semibold text-(--text)">{services.length}</p>
              </div>
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-(--muted)">Avg. Price</p>
                <p className="text-2xl font-semibold text-(--text)">${averagePrice}</p>
              </div>
            </div>
          </Card>

          <Card className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600">
                <Percent className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-(--muted)">Tax Rate</p>
                <p className="text-2xl font-semibold text-(--text)">{services[0]?.taxRate ?? 0}%</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
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
                    <div className="text-sm font-semibold text-(--text)">{service.name}</div>
                    <div className="text-xs text-(--muted)">{service.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-semibold text-(--text)">${service.price.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-(--text)">{service.taxRate}%</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-(--text)">{service.duration}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={service.status === "active" ? "success" : "neutral"}>{service.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/services/${service.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/services/${service.id}/edit`}>
                      <Button variant="secondary" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="error" size="sm" onClick={() => onDelete(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>

      {filteredServices.length === 0 && (
        <Card className="mt-4 py-12 text-center">
          <Scissors className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-xl font-semibold text-(--text)">No Services Found</h3>
          <p className="mb-4 text-sm text-(--muted)">
            {searchTerm ? "Try adjusting your search term" : "Get started by adding your first service"}
          </p>
          {!searchTerm && (
            <Link href="/dashboard/services/new">
              <Button variant="primary" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Service
              </Button>
            </Link>
          )}
        </Card>
      )}
    </main>
  );
}
