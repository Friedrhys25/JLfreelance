"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "gradient";
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
}: CardProps) {
  const baseStyles =
    "bg-white border border-(--border) rounded-xl shadow-sm transition-all duration-200";

  const variantStyles = {
    default: "",
    subtle: "bg-(--muted-light)",
    gradient: "bg-gradient-to-br from-(--primary-light) to-white",
  };

  const hoverStyles = hover
    ? "hover:shadow-md hover:-translate-y-0.5"
    : "";

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        className
      )}
    >
      {children}
    </div>
  );
}
