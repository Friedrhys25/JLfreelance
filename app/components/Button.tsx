"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "error" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variantStyles = {
    primary:
      "bg-[var(--brand)] text-white hover:bg-[var(--brand-strong)] shadow-sm",
    secondary:
      "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]",
    success: "bg-[var(--success)] text-white hover:bg-emerald-700",
    error: "bg-[var(--error)] text-white hover:bg-red-700",
    outline:
      "border border-[var(--border)] bg-white text-[var(--text)] hover:bg-[var(--muted-light)]",
    ghost:
      "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--muted-light)]",
  };

  const sizeStyles = {
    sm: "h-9 px-3 text-sm rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-12 px-6 text-base rounded-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
