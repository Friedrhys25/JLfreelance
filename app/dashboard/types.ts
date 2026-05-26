"use client";

export interface Transaction {
  id: string;
  date: string;
  time: string;
  clientName: string;
  barber: string;
  service: string;
  cost: number;
  status: string;
  branch?: string;
}

export interface Expense {
  id: string;
  month: string;
  electricity: number;
  water: number;
  rent: number;
  other: number;
  branch?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  branch?: string;
}

export type DashboardTab = "overview" | "expenses";
