"use client";

import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const portalContainer = typeof document === "undefined" ? null : document.body;

  if (!isOpen || !portalContainer) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-(--border) bg-(--surface) shadow-(--shadow-strong)">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--border) bg-(--surface-alt) px-5 py-4">
          <h3 className="text-lg font-semibold text-(--text)">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-(--muted) transition hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-(--border) bg-(--surface-alt) px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    portalContainer
  );
}
