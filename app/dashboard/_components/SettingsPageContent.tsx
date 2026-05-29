"use client";

import { useState } from "react";
import { Building, Scissors, Users } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceSettingsContent } from "@/app/dashboard/settings/_components/ServiceSettingsContent";
import { createBarber } from "@/lib/api";

export function SettingsPageContent() {
  const { addBranch, addUser, branches, deleteUser, isAdmin, isClient, logout, user, users } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addBarberModalOpen, setAddBarberModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addBranchModalOpen, setAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "cashier" as "admin" | "cashier" | "client",
    branch: "Main Branch",
  });
  const [newBarber, setNewBarber] = useState({
    name: "",
    specialty: "",
    branch: "Main Branch",
  });

  const resolveBranchId = (branchName: string) => branches.find((branch) => branch.name === branchName)?.id ?? null;
  const resolveBranchName = (branchId?: string | null) => branches.find((branch) => branch.id === branchId)?.name ?? null;
  const clientBranchId = isClient ? user.branchId ?? resolveBranchId(user.branch ?? "") : null;
  const clientBranchName = isClient ? user.branch ?? resolveBranchName(clientBranchId) : null;
  const barberBranchName = isClient ? clientBranchName ?? "" : newBarber.branch;
  const barberBranchId = isClient ? clientBranchId : resolveBranchId(newBarber.branch);
  const barberBranchOptions = isClient && clientBranchId
    ? branches.filter((branch) => branch.id === clientBranchId)
    : branches;
  const canAddBarber = Boolean(newBarber.name.trim()) && Boolean(barberBranchId);

  const resetNewBarber = () => {
    setNewBarber({ name: "", specialty: "", branch: clientBranchName ?? branches[0]?.name ?? "Main Branch" });
  };

  const openAddBarberModal = () => {
    setNewBarber((current) => ({
      ...current,
      branch: clientBranchName ?? current.branch ?? branches[0]?.name ?? "Main Branch",
    }));
    setAddBarberModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <DashboardTopBar
        activeTab={null}
        activeShortcut="settings"
        branch={user.branch ?? undefined}
        canManageUsers={isAdmin}
        canViewExpenses={isAdmin || isClient}
        mobileMenuOpen={mobileMenuOpen}
        role={user.role}
        onLogout={logout}
        onSetMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Settings</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">People and Access</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Add barbers or manage user access.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => setAddBranchModalOpen(true)}>
                <Building className="h-4 w-4" />
                Add Branch
              </Button>
            )}
            <Button variant="outline" onClick={openAddBarberModal}>
              <Scissors className="h-4 w-4" />
              Add Barber
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => setAddUserModalOpen(true)}>
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
            )}
          </div>
        </div>
      </div>

      <ServiceSettingsContent />

      <Modal
        isOpen={addBranchModalOpen}
        onClose={() => {
          setAddBranchModalOpen(false);
          setNewBranchName("");
        }}
        title="Add Branch"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddBranchModalOpen(false);
                setNewBranchName("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const name = newBranchName.trim();
                if (!name) {
                  return;
                }

                addBranch(name).finally(() => {
                  setAddBranchModalOpen(false);
                  setNewBranchName("");
                });
              }}
              className="flex-1"
            >
              Add Branch
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Branch Name"
            placeholder="Enter branch name"
            value={newBranchName}
            onChange={(event) => setNewBranchName(event.target.value)}
            icon={<Building className="h-4 w-4" />}
          />
        </div>
      </Modal>

      <Modal
        isOpen={addBarberModalOpen}
        onClose={() => {
          setAddBarberModalOpen(false);
          resetNewBarber();
        }}
        title="Add Barber"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddBarberModalOpen(false);
                resetNewBarber();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!canAddBarber) {
                  return;
                }

                createBarber({
                  name: newBarber.name.trim(),
                  specialty: newBarber.specialty,
                  branchId: barberBranchId,
                }).finally(() => {
                  resetNewBarber();
                  setAddBarberModalOpen(false);
                });
              }}
              disabled={!canAddBarber}
              className="flex-1"
            >
              Add Barber
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Barber Name"
            placeholder="Enter barber name"
            value={newBarber.name}
            onChange={(event) => setNewBarber((current) => ({ ...current, name: event.target.value }))}
            icon={<Users className="h-4 w-4" />}
          />
          <Input
            type="text"
            label="Specialty"
            placeholder="e.g. Fade & Taper"
            value={newBarber.specialty}
            onChange={(event) => setNewBarber((current) => ({ ...current, specialty: event.target.value }))}
            icon={<Scissors className="h-4 w-4" />}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Building className="mr-1 inline h-4 w-4" />
              Branch Location
            </label>
            <select
              value={barberBranchName}
              onChange={(event) => {
                if (isClient) return;
                setNewBarber((current) => ({ ...current, branch: event.target.value }));
              }}
              disabled={isClient}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              {barberBranchOptions.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
              {isClient && !clientBranchId && <option value="">No branch assigned</option>}
            </select>
            {isClient && !clientBranchId && (
              <p className="mt-2 text-xs text-red-600">Your account needs a branch before adding a barber.</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={addUserModalOpen}
        onClose={() => {
          setAddUserModalOpen(false);
          setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
        }}
        title="Manage Users"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddUserModalOpen(false);
                setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!newUser.username || !newUser.password) {
                  return;
                }

                addUser({
                  username: newUser.username,
                  password: newUser.password,
                  role: newUser.role,
                  branchId: resolveBranchId(newUser.branch),
                });
                setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
              }}
              className="flex-1"
            >
              Add User
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            type="text"
            label="Username"
            placeholder="Enter username"
            value={newUser.username}
            onChange={(event) => setNewUser((current) => ({ ...current, username: event.target.value }))}
            icon={<Users className="h-4 w-4" />}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
            icon={<Users className="h-4 w-4" />}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Users className="mr-1 inline h-4 w-4" />
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(event) =>
                setNewUser((current) => ({
                  ...current,
                  role: event.target.value as "admin" | "cashier" | "client",
                }))
              }
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
              <Building className="mr-1 inline h-4 w-4" />
              Branch Location
            </label>
            <select
              value={newUser.branch}
              onChange={(event) => setNewUser((current) => ({ ...current, branch: event.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          {users.length > 0 && (
            <div className="mt-6 border-t border-[var(--border)] pt-4">
              <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">Existing Users</h4>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {users.map((storedUser) => (
                  <div key={storedUser.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-alt)] p-3">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">{storedUser.username}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {storedUser.role} · {storedUser.branch ?? "No branch"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(storedUser.id)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
