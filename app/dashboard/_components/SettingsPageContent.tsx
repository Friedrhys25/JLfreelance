"use client";

import { useState } from "react";
import { Building, Eye, EyeOff, KeyRound, Scissors, Users } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Modal } from "@/app/components/Modal";
import { DashboardTopBar } from "@/app/dashboard/_components/DashboardTopBar";
import { ServiceSettingsContent } from "@/app/dashboard/settings/_components/ServiceSettingsContent";
import { changePassword, createBarber, listBarbers, deleteBarber } from "@/lib/api";
import type { ApiBarber } from "@/lib/api";

export function SettingsPageContent() {
  const { addBranch, addUser, branches, deleteUser, isAdmin, isClient, isCashier, logout, user, users } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addBarberModalOpen, setAddBarberModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addBranchModalOpen, setAddBranchModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [usernameTakenModalOpen, setUsernameTakenModalOpen] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [userToDelete, setUserToDelete] = useState<(typeof users)[number] | null>(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [passwordDraft, setPasswordDraft] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
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
  const [isSubmittingBarber, setIsSubmittingBarber] = useState(false);
  const [allBarbersModalOpen, setAllBarbersModalOpen] = useState(false);
  const [barbersList, setBarbersList] = useState<ApiBarber[]>([]);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
  const [barberToDelete, setBarberToDelete] = useState<ApiBarber | null>(null);
  const [isDeletingBarber, setIsDeletingBarber] = useState(false);
  const [confirmBranchModalOpen, setConfirmBranchModalOpen] = useState(false);
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);
  const [newBranchDraft, setNewBranchDraft] = useState("");

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

  const handleOpenAllBarbers = async () => {
    setAllBarbersModalOpen(true);
    setIsLoadingBarbers(true);
    try {
      const data = await listBarbers();
      setBarbersList(data);
    } finally {
      setIsLoadingBarbers(false);
    }
  };

  const handleDeleteBarber = async () => {
    if (!barberToDelete) return;
    setIsDeletingBarber(true);
    try {
      await deleteBarber(barberToDelete.id);
      setBarbersList((current) => current.filter(b => b.id !== barberToDelete.id));
      setBarberToDelete(null);
    } finally {
      setIsDeletingBarber(false);
    }
  };

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

  const resetNewUser = () => {
    setNewUser({ username: "", password: "", role: "cashier", branch: "Main Branch" });
    setShowUserPassword(false);
  };

  const handleAddUser = async () => {
    const username = newUser.username.trim();
    if (!username || !newUser.password) {
      return;
    }

    const usernameExists = users.some((storedUser) => storedUser.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      setUsernameTakenModalOpen(true);
      return;
    }

    try {
      await addUser({
        username,
        password: newUser.password,
        role: newUser.role,
        branchId: resolveBranchId(newUser.branch),
      });
      resetNewUser();
    } catch {
      setUsernameTakenModalOpen(true);
    }
  };

  const resetPasswordDraft = () => {
    setPasswordDraft({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordMessage("");
    setShowPasswordFields(false);
  };

  const handleChangePassword = async () => {
    if (!passwordDraft.currentPassword || !passwordDraft.newPassword || !passwordDraft.confirmPassword) {
      setPasswordMessage("Fill in all password fields.");
      return;
    }

    if (passwordDraft.newPassword !== passwordDraft.confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordDraft.currentPassword,
        newPassword: passwordDraft.newPassword,
      });
      setPasswordMessage("Password changed.");
      setTimeout(() => {
        setChangePasswordModalOpen(false);
        resetPasswordDraft();
      }, 700);
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Failed to change password.");
    }
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
            <Button variant="outline" onClick={() => setChangePasswordModalOpen(true)}>
              <KeyRound className="h-4 w-4" />
              Change Password
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => setAddBranchModalOpen(true)}>
                <Building className="h-4 w-4" />
                Add Branch
              </Button>
            )}
            <Button variant="outline" onClick={handleOpenAllBarbers}>
              <Users className="h-4 w-4" />
              All Barbers
            </Button>
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
                setNewBranchDraft(name);
                setConfirmBranchModalOpen(true);
              }}
              className="flex-1"
            >
              Next
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
                if (!canAddBarber || isSubmittingBarber) {
                  return;
                }

                setIsSubmittingBarber(true);
                createBarber({
                  name: newBarber.name.trim(),
                  specialty: newBarber.specialty,
                  branchId: barberBranchId,
                }).finally(() => {
                  resetNewBarber();
                  setAddBarberModalOpen(false);
                  setIsSubmittingBarber(false);
                });
              }}
              disabled={!canAddBarber || isSubmittingBarber}
              className="flex-1"
            >
              {isSubmittingBarber ? "Adding..." : "Add Barber"}
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
              disabled={isClient || isCashier}
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
          resetNewUser();
        }}
        title="Manage Users"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAddUserModalOpen(false);
                resetNewUser();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddUser}
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
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-user-password" className="text-sm font-medium text-[var(--muted)]">
              Password
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="new-user-password"
                type={showUserPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newUser.password}
                onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] bg-white px-10 py-2.5 text-sm text-[var(--text)] transition-all duration-200 placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
              />
              <button
                type="button"
                onClick={() => setShowUserPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--text)]"
                aria-label={showUserPassword ? "Hide password" : "Show password"}
              >
                {showUserPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
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
                    {storedUser.role !== "admin" && (
                      <Button variant="ghost" size="sm" onClick={() => setUserToDelete(storedUser)}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={changePasswordModalOpen}
        onClose={() => {
          setChangePasswordModalOpen(false);
          resetPasswordDraft();
        }}
        title="Change Password"
        footer={
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setChangePasswordModalOpen(false);
                resetPasswordDraft();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleChangePassword} className="flex-1">
              Save Password
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {[
            { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
            { key: "newPassword", label: "New Password", placeholder: "Enter new password" },
            { key: "confirmPassword", label: "Confirm Password", placeholder: "Confirm new password" },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={field.key} className="text-sm font-medium text-[var(--muted)]">
                {field.label}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id={field.key}
                  type={showPasswordFields ? "text" : "password"}
                  placeholder={field.placeholder}
                  value={passwordDraft[field.key as keyof typeof passwordDraft]}
                  onChange={(event) =>
                    setPasswordDraft((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-white px-10 py-2.5 text-sm text-[var(--text)] transition-all duration-200 placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-light)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordFields((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--text)]"
                  aria-label={showPasswordFields ? "Hide passwords" : "Show passwords"}
                >
                  {showPasswordFields ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          {passwordMessage && (
            <p className="rounded-lg bg-[var(--surface-alt)] px-3 py-2 text-sm text-[var(--muted)]">
              {passwordMessage}
            </p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={usernameTakenModalOpen}
        onClose={() => setUsernameTakenModalOpen(false)}
        title="Username Taken"
        footer={
          <Button variant="primary" onClick={() => setUsernameTakenModalOpen(false)} className="w-full">
            OK
          </Button>
        }
      >
        <p className="text-sm text-[var(--muted)]">The username is already taken.</p>
      </Modal>

      <Modal
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        title="Remove User"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => setUserToDelete(null)} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="error"
              onClick={async () => {
                if (!userToDelete) return;
                await deleteUser(userToDelete.id);
                setUserToDelete(null);
              }}
              className="flex-1"
            >
              Remove
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted)]">
          Remove {userToDelete?.username ?? "this user"} from access?
        </p>
      </Modal>

      <Modal
        isOpen={confirmBranchModalOpen}
        onClose={() => setConfirmBranchModalOpen(false)}
        title="Confirm New Branch"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => setConfirmBranchModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" disabled={isSubmittingBranch} onClick={async () => {
                setIsSubmittingBranch(true);
                try {
                  await addBranch(newBranchDraft);
                  setAddBranchModalOpen(false);
                  setConfirmBranchModalOpen(false);
                  setNewBranchName("");
                } finally {
                  setIsSubmittingBranch(false);
                }
              }} className="flex-1">
              {isSubmittingBranch ? "Adding..." : "Confirm"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted)]">Are you sure you want to add the branch "{newBranchDraft}"?</p>
      </Modal>

      <Modal
        isOpen={allBarbersModalOpen}
        onClose={() => setAllBarbersModalOpen(false)}
        title="All Barbers"
        footer={
          <Button variant="outline" onClick={() => setAllBarbersModalOpen(false)} className="w-full">
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          {isLoadingBarbers ? (
            <p className="text-sm text-[var(--muted)]">Loading barbers...</p>
          ) : barbersList.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No barbers found.</p>
          ) : (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-2">
              {barbersList.map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-alt)] p-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{b.name}</p>
                    <p className="text-xs text-[var(--muted)]">{b.specialty || "No specialty"} · {b.branch || "No branch"}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setBarberToDelete(b)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(barberToDelete)}
        onClose={() => setBarberToDelete(null)}
        title="Remove Barber"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => setBarberToDelete(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="error" disabled={isDeletingBarber} onClick={handleDeleteBarber} className="flex-1">
              {isDeletingBarber ? "Removing..." : "Remove"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[var(--muted)]">Remove {barberToDelete?.name} permanently?</p>
      </Modal>

    </div>
  );
}
