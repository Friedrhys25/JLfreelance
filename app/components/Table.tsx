"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow)">
      <table className={cn("w-full", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead
      className={cn(
        "bg-(--surface-alt) border-b border-(--border)",
        className
      )}
    >
      {children}
    </thead>
  );
}

export function TableRow({
  children,
  className,
  hover = false,
}: TableProps & { hover?: boolean }) {
  return (
    <tr
      className={cn(
        "border-b border-(--border) last:border-b-0",
        hover ? "hover:bg-slate-50 transition-colors" : "",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: TableProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-(--muted)",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableProps) {
  return (
    <td className={cn("px-4 py-3 text-sm text-(--text)", className)}>
      {children}
    </td>
  );
}

