import os

path_spc = "app/dashboard/_components/SettingsPageContent.tsx"
with open(path_spc, "r", encoding="utf-8") as f:
    spc = f.read()

# 1. Imports
spc = spc.replace('import { changePassword, createBarber } from "@/lib/api";', 'import { changePassword, createBarber, listBarbers, deleteBarber } from "@/lib/api";\nimport type { ApiBarber } from "@/lib/api";')
spc = spc.replace('isAdmin, isClient, logout', 'isAdmin, isClient, isCashier, logout')
spc = spc.replace('disabled={isClient}', 'disabled={isClient || isCashier}')

# 2. States
state_orig = """  const [newBarber, setNewBarber] = useState({
    name: "",
    specialty: "",
    branch: "Main Branch",
  });"""
state_inj = """  const [newBarber, setNewBarber] = useState({
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
  const [newBranchDraft, setNewBranchDraft] = useState("");"""
spc = spc.replace(state_orig, state_inj)

# 3. Barber modal functions
func_orig = "  const resetNewBarber = () => {"
func_inj = """  const handleOpenAllBarbers = async () => {
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

  const resetNewBarber = () => {"""
spc = spc.replace(func_orig, func_inj)

# 4. Buttons
btn_orig = """<Button variant="outline" onClick={openAddBarberModal}>
              <Scissors className="h-4 w-4" />
              Add Barber
            </Button>"""
btn_inj = """<Button variant="outline" onClick={handleOpenAllBarbers}>
              <Users className="h-4 w-4" />
              All Barbers
            </Button>
            <Button variant="outline" onClick={openAddBarberModal}>
              <Scissors className="h-4 w-4" />
              Add Barber
            </Button>"""
spc = spc.replace(btn_orig, btn_inj)

# 5. Add Barber Loading inside Modal
add_barb_orig = """            <Button
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
            </Button>"""
add_barb_inj = """            <Button
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
            </Button>"""
spc = spc.replace(add_barb_orig, add_barb_inj)

# 6. Branch Modal Change
branch_orig = """            <Button
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
            </Button>"""
branch_inj = """            <Button
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
            </Button>"""
spc = spc.replace(branch_orig, branch_inj)

# 7. Add Modals at end of file
modals_inj = """
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
"""
spc = spc.replace('    </div>\n  );\n}\n', modals_inj)

with open(path_spc, "w", encoding="utf-8") as f:
    f.write(spc)
