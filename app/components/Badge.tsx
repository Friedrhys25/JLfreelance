"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full font-semibold";

  const variantStyles = {
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-amber-100 text-amber-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-slate-100 text-slate-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}>
      {children}
    </span>
  );
}

