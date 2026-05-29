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

const DEFAULT_SPLIT: ServiceSplitSetting = { shopPct: 60, barberPct: 40 };

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
