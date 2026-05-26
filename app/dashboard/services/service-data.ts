"use client";

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  taxRate: number;
  status: "active" | "inactive";
  duration: string;
}

export const mockServices: ServiceCatalogItem[] = [
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
