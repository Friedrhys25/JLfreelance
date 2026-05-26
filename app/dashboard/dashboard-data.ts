"use client";

import dashboardData from "@/data/mockData.json";
import type { Barber, Expense, Service, Transaction } from "@/app/dashboard/types";

export const SERVICES: Service[] = dashboardData.services as Service[];

export const INITIAL_BARBERS: Barber[] = [
  { id: "1", name: "Marco", avatar: "MC", specialty: "Fade & Taper", branch: "Main Branch" },
  { id: "2", name: "Andre", avatar: "AN", specialty: "Classic Cuts", branch: "Main Branch" },
  { id: "3", name: "Jun", avatar: "JN", specialty: "Color Specialist", branch: "Main Branch" },
  { id: "4", name: "Rico", avatar: "RC", specialty: "Beard & Mustache", branch: "Main Branch" },
];

export const INITIAL_TRANSACTIONS: Transaction[] = dashboardData.transactions as Transaction[];
export const INITIAL_EXPENSES: Expense[] = dashboardData.expenses as Expense[];

export const BARBER_SPECIALTIES = ["Haircut", "Hair Color", "Hair Treatment"] as const;

export const getServiceCategory = (serviceName: string) => {
  const lowered = serviceName.toLowerCase();

  if (lowered.includes("color")) {
    return "Hair Color";
  }

  if (lowered.includes("treatment")) {
    return "Hair Treatment";
  }

  return "Haircut";
};
