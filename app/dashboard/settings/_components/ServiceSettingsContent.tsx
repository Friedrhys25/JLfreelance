"use client";

import { useEffect, useMemo, useState } from "react";
import { Percent, Plus, Save, Scissors, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
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
  BRANCH_SPLIT_KEY,
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
  const { branches, isCashier, isClient, user } = useAuth();
  const [services, setServices] = useState<ServiceSetting[]>([]);
  const [splits, setSplits] = useState<Record<string, ServiceSplitSetting>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranchIdState, setSelectedBranchIdState] = useState("");
  const [serviceToDelete, setServiceToDelete] = useState<ServiceSetting | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    durationValue: "30",
    durationUnit: "min",
  });

  const clientBranchId = isClient ? user.branchId ?? branches.find((branch) => branch.name === user.branch)?.id ?? "" : "";
  const selectedBranchId = clientBranchId || selectedBranchIdState || branches[0]?.id || "";
  const visibleBranches = clientBranchId ? branches.filter((branch) => branch.id === clientBranchId) : branches;
  const branchSplit = getSplitForServiceName(splits, BRANCH_SPLIT_KEY);
  const isCashierReadOnly = isCashier;

  useEffect(() => {
    let isMounted = true;
    const loadSettings = async () => {
      if (!selectedBranchId) return;
      if (isMounted) setIsLoading(true);
      try {
        const [serviceList, splitList] = await Promise.all([
          listServices({ branchId: selectedBranchId }),
          listServiceSplits({ branchId: selectedBranchId }),
        ]);
        if (!isMounted) return;

        setServices(serviceList.map(mapService));
        const nextSplits: Record<string, ServiceSplitSetting> = {};
        splitList.forEach((split) => {
          nextSplits[split.serviceName || BRANCH_SPLIT_KEY] = { shopPct: split.shopPct, barberPct: split.barberPct };
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

  const updateBranchSplit = (next: Partial<ServiceSplitSetting>) => {
    if (isCashierReadOnly) return;
    setSplits((current) => ({
      ...current,
      [BRANCH_SPLIT_KEY]: normalizeSplit({ ...getSplitForServiceName(current, BRANCH_SPLIT_KEY), ...next }),
    }));
    setIsDirty(true);
  };

  const deleteService = async (id: string) => {
    await deleteServiceApi(id);
    setServices((current) => current.filter((service) => service.id !== id));
    setIsDirty(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    await deleteService(serviceToDelete.id);
    setServiceToDelete(null);
  };

  const addService = async () => {
    if (isCashierReadOnly) return;
    const name = newService.name.trim();
    if (!name) return;

    const price = Number.parseFloat(newService.price);
    if (!Number.isFinite(price) || price < 0) return;

    const value = newService.durationValue.trim();
    const unit = newService.durationUnit === "hrs" ? "hrs" : "min";
    const numeric = Number.parseFloat(value);
    const duration = Number.isFinite(numeric) && numeric > 0 ? `${numeric} ${unit}` : `30 ${unit}`;

    const created = await createService({
      name,
      description: "",
      price,
      duration,
      taxRate: 0,
      status: "active",
      branchId: selectedBranchId,
    });

    setServices((current) => [...current, mapService(created)]);

    setNewService({ name: "", price: "", durationValue: "30", durationUnit: "min" });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (isCashierReadOnly) return;
    if (!selectedBranchId) return;
    await saveServiceSplits([{ ...branchSplit, branchId: selectedBranchId }]);
    setIsDirty(false);
  };

  const handleBranchChange = (branchId: string) => {
    if (isClient) return;
    setSelectedBranchIdState(branchId);
    setIsDirty(false);
  };

  if (!selectedBranchId) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <p className="text-sm text-(--muted)">No branch found.</p>
        </Card>
      </main>
    );
  }

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
            onChange={(event) => handleBranchChange(event.target.value)}
            disabled={isClient}
            className="h-10 rounded-lg border border-(--border) bg-white px-4 text-sm text-(--text) focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light) disabled:bg-(--surface-alt)"
          >
            {visibleBranches.map((branch) => (
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
            {services.map((service) => (
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
                  <Button variant="error" size="sm" onClick={() => setServiceToDelete(service)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text)">Branch Percentage</h3>
            <p className="mt-1 text-sm text-(--muted)">Applied to every service in selected branch.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Input
                type="number"
                label="Store %"
                value={branchSplit.shopPct}
                min={0}
                max={100}
                disabled={isCashierReadOnly}
                onChange={(event) => updateBranchSplit({ shopPct: Number(event.target.value) })}
                icon={<Percent className="h-4 w-4" />}
              />
              <Input
                type="number"
                label="Barber %"
                value={branchSplit.barberPct}
                min={0}
                max={100}
                disabled={isCashierReadOnly}
                onChange={(event) => updateBranchSplit({ barberPct: Number(event.target.value) })}
                icon={<Percent className="h-4 w-4" />}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-(--text)">Add Service</h3>
            <p className="mt-1 text-sm text-(--muted)">New service belongs to selected branch only.</p>

            <div className="mt-5 space-y-4">
              <Input
                type="text"
                label="Name"
                placeholder="e.g. Beard Trim"
                value={newService.name}
                disabled={isCashierReadOnly}
                onChange={(event) => setNewService((current) => ({ ...current, name: event.target.value }))}
                icon={<Scissors className="h-4 w-4" />}
              />
              <Input
                type="number"
                label="Price (PHP)"
                placeholder="0"
                value={newService.price}
                disabled={isCashierReadOnly}
                onChange={(event) => setNewService((current) => ({ ...current, price: event.target.value }))}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  label="Duration"
                  placeholder="30"
                  value={newService.durationValue}
                  disabled={isCashierReadOnly}
                  onChange={(event) => setNewService((current) => ({ ...current, durationValue: event.target.value }))}
                />
                <div className="w-28">
                  <label className="text-xs font-medium text-(--muted)">Unit</label>
                  <select
                    value={newService.durationUnit}
                    disabled={isCashierReadOnly}
                    onChange={(event) => setNewService((current) => ({ ...current, durationUnit: event.target.value }))}
                    className="mt-1 h-10 w-full rounded-lg border border-(--border) bg-white px-3 text-sm text-(--text)"
                  >
                    <option value="min">min</option>
                    <option value="hrs">hrs</option>
                  </select>
                </div>
              </div>

              <Button variant="primary" fullWidth onClick={addService} disabled={isCashierReadOnly}>
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
              disabled={isCashierReadOnly || !hasUnsavedChanges}
            >
              <Save className="h-5 w-5" />
              Save Settings
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        title="Delete service"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setServiceToDelete(null)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-(--muted)">
          This will permanently delete {serviceToDelete?.name ?? "this service"} and its split settings.
        </p>
      </Modal>
    </main>
  );
}
