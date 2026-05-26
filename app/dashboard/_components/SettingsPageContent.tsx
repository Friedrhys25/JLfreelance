"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { SettingsContent } from "@/app/dashboard/settings/_components/SettingsContent";

export function SettingsPageContent() {
  const { isAdmin, isClient, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [taxRate, setTaxRate] = useState("10");
  const [currency, setCurrency] = useState("USD");
  const [discountCodes, setDiscountCodes] = useState([
    { code: "WELCOME10", type: "percentage" as const, value: 10, status: "active" as const },
    { code: "FIRSTVISIT", type: "fixed" as const, value: 5, status: "active" as const },
    { code: "SUMMER20", type: "percentage" as const, value: 20, status: "inactive" as const },
  ]);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
  });

  const handleAddDiscount = () => {
    if (!newDiscount.code || !newDiscount.value) {
      return;
    }

    setDiscountCodes((current) => [
      ...current,
      {
        code: newDiscount.code.toUpperCase(),
        type: newDiscount.type,
        value: Number.parseFloat(newDiscount.value),
        status: "active",
      },
    ]);
    setNewDiscount({ code: "", type: "percentage", value: "" });
  };

  const handleDeleteDiscount = (code: string) => {
    setDiscountCodes((current) => current.filter((discount) => discount.code !== code));
  };

  const handleToggleDiscount = (code: string) => {
    setDiscountCodes((current) =>
      current.map((discount) =>
        discount.code === code
          ? { ...discount, status: discount.status === "active" ? "inactive" : "active" }
          : discount
      )
    );
  };

  const handleSave = () => {
    console.log("Saving settings:", { taxRate, currency, discountCodes });
  };

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab={null}
        activeShortcut="settings"
        branch={user.branch}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onOpenBarberModal={() => {}}
        onOpenUserModal={() => {}}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

      <SettingsContent
        currency={currency}
        discountCodes={discountCodes}
        newDiscount={newDiscount}
        taxRate={taxRate}
        onAddDiscount={handleAddDiscount}
        onCurrencyChange={setCurrency}
        onDeleteDiscount={handleDeleteDiscount}
        onNewDiscountChange={setNewDiscount}
        onSave={handleSave}
        onTaxRateChange={setTaxRate}
        onToggleDiscount={handleToggleDiscount}
      />
    </div>
  );
}
