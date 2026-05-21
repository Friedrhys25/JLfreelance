"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-(--muted)"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-(--border) bg-white px-4 py-2.5 text-sm text-(--text) transition-all duration-200",
              "placeholder:text-(--muted)",
              "focus:border-(--brand) focus:outline-none focus:ring-2 focus:ring-(--brand-light)",
              icon ? "pl-10" : "",
              error
                ? "border-(--error) focus:border-(--error) focus:ring-(--error-light)"
                : "",
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs font-medium text-(--error)">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
