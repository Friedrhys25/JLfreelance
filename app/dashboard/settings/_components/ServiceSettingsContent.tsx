"use client";

import { useEffect, useMemo, useState } from "react";
import { Percent, Plus, Save, Scissors, Trash2 } from "lucide-react";
import { Badge } from "@/app/components/Badge";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { Input } from "@/app/components/Input";
import {
  getSplitForServiceName,
  loadServiceSettings,
  loadServiceSplits,
  normalizeSplit,
  saveServiceSettings,
  saveServiceSplits,
  type ServiceSetting,
  type ServiceSplitSetting,
} from "@/app/dashboard/settings/service-settings-store";

export function ServiceSettingsContent() {
  const [services, setServices] = useState<ServiceSetting[]>(() => loadServiceSettings());
  const [splits, setSplits] = useState<Record<string, ServiceSplitSetting>>(() => loadServiceSplits());
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "30 min",
  });

  useEffect(() => {
    // Keep settings in sync if another tab updates localStorage.
    const handler = () => {
      setServices(loadServiceSettings());
      setSplits(loadServiceSplits());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    // We persist on save only; treat any session edit as dirty once services loaded.
    return services.length > 0;
  }, [services.length]);

  const updateSplit = (serviceName: string, next: Partial<ServiceSplitSetting>) => {
    setSplits((current) => ({
      ...current,
      [serviceName]: normalizeSplit({ ...getSplitForServiceName(current, serviceName), ...next }),
    }));
  };

  const deleteService = (id: string) => {
    setServices((current) => current.filter((service) => service.id !== id));
  };

  const addService = () => {
    const name = newService.name.trim();
    if (!name) return;

    const price = Number.parseFloat(newService.price);
    if (!Number.isFinite(price) || price < 0) return;

    const id = `svc_${Date.now()}`;
    const duration = newService.duration.trim() || "30 min";

    setServices((current) => [
      ...current,
      {
        id,
        name,
        price,
        duration,
      },
    ]);

    setSplits((current) => ({
      ...current,
      [name]: getSplitForServiceName(current, name),
    }));

    setNewService({ name: "", price: "", duration: "30 min" });
  };

  const handleSave = () => {
    saveServiceSettings(services);
    saveServiceSplits(splits);
  };

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
              Manage services and configure the default store/barber split per service queue.
            </p>
          </div>
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

                  <div className="mt-3 text-xs text-(--muted)">
                    Split applied: <span className="font-semibold text-(--text)">{split.shopPct}% store</span> /{" "}
                    <span className="font-semibold text-(--text)">{split.barberPct}% barber</span>
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
              Saves services and splits to this device (localStorage).
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
