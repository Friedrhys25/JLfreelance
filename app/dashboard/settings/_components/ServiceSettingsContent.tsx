"use client";

import { useEffect, useMemo, useState } from "react";
import { Percent, Plus, Save, Scissors, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  createService,
  deleteService as deleteServiceApi,
  listServiceSplits,
  listServices,
  saveServiceSplits,
  type ApiService,
} from "@/lib/api";
import {
  getSplitForServiceName,
  normalizeSplit,
  type ServiceSetting,
  type ServiceSplitSetting,
} from "@/app/dashboard/settings/service-settings-store";

function mapService(apiService: ApiService): ServiceSetting {
  return {
    id: apiService.id,
    name: apiService.name,
    price: apiService.price,
    duration: apiService.duration,
  };
}

export function ServiceSettingsContent() {
  const { branches } = useAuth();
  const [services, setServices] = useState<ServiceSetting[]>([]);
  const [splits, setSplits] = useState<Record<string, ServiceSplitSetting>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "30 min",
  });

  useEffect(() => {
    if (!selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      if (isMounted) setIsLoading(true);
      try {
        const [serviceList, splitList] = await Promise.all([
          listServices(),
          selectedBranchId ? listServiceSplits({ branchId: selectedBranchId }) : Promise.resolve([]),
        ]);
        if (!isMounted) return;

        setServices(serviceList.map(mapService));
        const nextSplits: Record<string, ServiceSplitSetting> = {};
        splitList.forEach((split) => {
          nextSplits[split.serviceName] = { shopPct: split.shopPct, barberPct: split.barberPct };
        });
        setSplits(nextSplits);
        setIsDirty(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [selectedBranchId]);

  const hasUnsavedChanges = useMemo(() => {
    return isDirty;
  }, [isDirty]);

  const updateSplit = (serviceName: string, next: Partial<ServiceSplitSetting>) => {
    setSplits((current) => ({
      ...current,
      [serviceName]: normalizeSplit({ ...getSplitForServiceName(current, serviceName), ...next }),
    }));
    setIsDirty(true);
  };

  const deleteService = async (id: string) => {
    await deleteServiceApi(id);
    setServices((current) => current.filter((service) => service.id !== id));
    setIsDirty(true);
  };

  const addService = async () => {
    const name = newService.name.trim();
    if (!name) return;

    const price = Number.parseFloat(newService.price);
    if (!Number.isFinite(price) || price < 0) return;

    const duration = newService.duration.trim() || "30 min";

    const created = await createService({
      name,
      description: "",
      price,
      duration,
      taxRate: 0,
      status: "active",
    });

    setServices((current) => [...current, mapService(created)]);

    setSplits((current) => ({
      ...current,
      [name]: getSplitForServiceName(current, name),
    }));

    setNewService({ name: "", price: "", duration: "30 min" });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!selectedBranchId) return;
    const splitPayload = services.map((service) => ({
      serviceId: service.id,
      ...getSplitForServiceName(splits, service.name),
      branchId: selectedBranchId,
    }));
    await saveServiceSplits(splitPayload);
    setIsDirty(false);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <p className="text-sm text-(--muted)">Loading settings...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-700">
            <Scissors className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-(--text)">Settings</h1>
            <p className="text-sm text-(--muted)">
              Manage services and configure store/barber splits per branch.
            </p>
          </div>
        </div>
        <div className="mt-4 flex max-w-sm flex-col gap-1.5">
          <label className="text-sm font-medium text-(--muted)">Branch</label>
          <select
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value)}
            className="h-10 rounded-lg border border-(--border) bg-white px-4 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-(--text)">Services</h2>
              <p className="text-sm text-(--muted)">Haircut, Hair Color, Hair Treatment, and more.</p>
            </div>
            <Badge variant="neutral">{services.length} services</Badge>
          </div>

          <div className="space-y-4">
            {services.map((service) => {
              const split = getSplitForServiceName(splits, service.name);
              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-(--border) bg-white p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-(--text)">{service.name}</p>
                      <p className="text-xs text-(--muted)">
                        {service.duration} · ₱{service.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-end md:justify-end">
                      <div className="flex gap-3">
                        <div className="w-28">
                          <Input
                            type="number"
                            label="Store %"
                            value={split.shopPct}
                            min={0}
                            max={100}
                            onChange={(event) => updateSplit(service.name, { shopPct: Number(event.target.value) })}
                            icon={<Percent className="h-4 w-4" />}
                          />
                        </div>
                        <div className="w-28">
                          <Input
                            type="number"
                            label="Barber %"
                            value={split.barberPct}
                            min={0}
                            max={100}
                            onChange={(event) =>
                              updateSplit(service.name, { barberPct: Number(event.target.value) })
                            }
                            icon={<Percent className="h-4 w-4" />}
                          />
                        </div>
                      </div>
                      <Button variant="error" size="sm" onClick={() => deleteService(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text)">Add Service</h3>
            <p className="mt-1 text-sm text-(--muted)">New services default to 60% store / 40% barber.</p>

            <div className="mt-5 space-y-4">
              <Input
                type="text"
                label="Name"
                placeholder="e.g. Beard Trim"
                value={newService.name}
                onChange={(event) => setNewService((current) => ({ ...current, name: event.target.value }))}
                icon={<Scissors className="h-4 w-4" />}
              />
              <Input
                type="number"
                label="Price (PHP)"
                placeholder="0"
                value={newService.price}
                onChange={(event) => setNewService((current) => ({ ...current, price: event.target.value }))}
              />
              <Input
                type="text"
                label="Duration"
                placeholder="30 min"
                value={newService.duration}
                onChange={(event) => setNewService((current) => ({ ...current, duration: event.target.value }))}
              />

              <Button variant="primary" fullWidth onClick={addService}>
                <Plus className="h-5 w-5" />
                Add Service
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text)">Save Changes</h3>
            <p className="mt-1 text-sm text-(--muted)">
              Saves services and splits to the database.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-5 w-full"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save className="h-5 w-5" />
              Save Settings
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
