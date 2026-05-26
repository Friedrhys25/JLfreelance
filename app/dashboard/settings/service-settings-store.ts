"use client";

import dashboardData from "@/data/mockData.json";

export interface ServiceSetting {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface ServiceSplitSetting {
  shopPct: number;
  barberPct: number;
}

const SERVICES_KEY = "barbershop_services_v1";
const SPLITS_KEY = "barbershop_service_splits_v1";

const DEFAULT_SPLIT: ServiceSplitSetting = { shopPct: 60, barberPct: 40 };

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function loadServiceSettings(): ServiceSetting[] {
  if (typeof window === "undefined") return dashboardData.services as ServiceSetting[];

  const stored = safeParseJson<ServiceSetting[]>(window.localStorage.getItem(SERVICES_KEY));
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const defaults = dashboardData.services as ServiceSetting[];
  window.localStorage.setItem(SERVICES_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveServiceSettings(services: ServiceSetting[]) {
  window.localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function loadServiceSplits(): Record<string, ServiceSplitSetting> {
  if (typeof window === "undefined") return {};

  const stored = safeParseJson<Record<string, ServiceSplitSetting>>(window.localStorage.getItem(SPLITS_KEY));
  if (stored && typeof stored === "object") {
    return stored;
  }

  window.localStorage.setItem(SPLITS_KEY, JSON.stringify({}));
  return {};
}

export function saveServiceSplits(splits: Record<string, ServiceSplitSetting>) {
  window.localStorage.setItem(SPLITS_KEY, JSON.stringify(splits));
}

export function getSplitForServiceName(
  splits: Record<string, ServiceSplitSetting>,
  serviceName: string
): ServiceSplitSetting {
  return splits[serviceName] ?? DEFAULT_SPLIT;
}

export function normalizeSplit(input: Partial<ServiceSplitSetting>): ServiceSplitSetting {
  const shopPct = clampPercent(input.shopPct ?? DEFAULT_SPLIT.shopPct);
  const barberPct = clampPercent(input.barberPct ?? DEFAULT_SPLIT.barberPct);

  if (shopPct + barberPct === 100) return { shopPct, barberPct };

  // Keep shopPct as source of truth; barberPct becomes remainder.
  const fixedShop = clampPercent(shopPct);
  return { shopPct: fixedShop, barberPct: 100 - fixedShop };
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
