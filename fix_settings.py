import re
import os

# 1. FIX SettingsPageContent.tsx
path_spc = "app/dashboard/_components/SettingsPageContent.tsx"
with open(path_spc, "r", encoding="utf-8") as f:
    spc = f.read()

spc = spc.replace('import { changePassword, createBarber } from "@/lib/api";', 'import { changePassword, createBarber, listBarbers, deleteBarber } from "@/lib/api";\nimport type { ApiBarber } from "@/lib/api";')
spc = spc.replace('isAdmin, isClient, logout', 'isAdmin, isClient, isCashier, logout')
spc = spc.replace('disabled={isClient}', 'disabled={isClient || isCashier}')

state_inj = """  const [isSubmittingBarber, setIsSubmittingBarber] = useState(false);
  const [allBarbersModalOpen, setAllBarbersModalOpen] = useState(false);
  const [barbersList, setBarbersList] = useState<ApiBarber[]>([]);
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
  const [barberToDelete, setBarberToDelete] = useState<ApiBarber | null>(null);
  const [isDeletingBarber, setIsDeletingBarber] = useState(false);
  const [confirmBranchModalOpen, setConfirmBranchModalOpen] = useState(false);
  const [isSubmittingBranch, setIsSubmittingBranch] = useState(false);
  const [newBranchDraft, setNewBranchDraft] = useState("");"""
spc = spc.replace("const [isSubmittingBarber, setIsSubmittingBarber] = useState(false);", state_inj)

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

  const resetNewBarber"""
spc = spc.replace("const resetNewBarber", func_inj)

btn_inj = """<Button variant="outline" onClick={handleOpenAllBarbers}>
              <Users className="h-4 w-4" />
              All Barbers
            </Button>
            <Button variant="outline" onClick={openAddBarberModal}>"""
spc = spc.replace("<Button variant=\"outline\" onClick={openAddBarberModal}>", btn_inj)

# Replace add branch logic
spc = re.sub(
    r'<Modal\s+isOpen=\{addBranchModalOpen\}.*?title="Add Branch".*?</Modal>',
    """<Modal
        isOpen={addBranchModalOpen}
        onClose={() => {
          setAddBranchModalOpen(false);
          setNewBranchName("");
        }}
        title="Add Branch"
        footer={
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => { setAddBranchModalOpen(false); setNewBranchName(""); }} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
                const name = newBranchName.trim();
                if (!name) return;
                setNewBranchDraft(name);
                setConfirmBranchModalOpen(true);
              }} className="flex-1">
              Next
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input type="text" label="Branch Name" placeholder="Enter branch name" value={newBranchName} onChange={(event) => setNewBranchName(event.target.value)} icon={<Building className="h-4 w-4" />} />
        </div>
      </Modal>""",
    spc,
    flags=re.DOTALL
)

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
spc = re.sub(r'    </div>\s*<[a-zA-Z0-9_/]+Modal.*?</Modal>\s*</div>\s*\);\s*\}\s*$', modals_inj, spc, flags=re.DOTALL)
if "title=\"Remove Barber\"" not in spc:
    # fallback
    spc = spc.replace("    </div>\n  );\n}\n", modals_inj)

with open(path_spc, "w", encoding="utf-8") as f:
    f.write(spc)


# 2. FIX ServiceSettingsContent.tsx
path_svc = "app/dashboard/settings/_components/ServiceSettingsContent.tsx"
with open(path_svc, "r", encoding="utf-8") as f:
    svc = f.read()

svc = svc.replace('const [services, setServices] = useState<ServiceSetting[]>([]);', 'const [services, setServices] = useState<ServiceSetting[]>([]);\n  const [pendingServices, setPendingServices] = useState<any[]>([]);\n  const [isSaving, setIsSaving] = useState(false);\n  const [cashierWarningModalOpen, setCashierWarningModalOpen] = useState(false);\n  const combinedServices = [...services, ...pendingServices.map((s, i) => ({ id: `pending-${i}`, name: s.name, price: s.price, duration: s.duration }))];')

svc = re.sub(r'const addService = async \(\) => \{.*?\n  \};\n\n  const handleSave = async \(\) => \{.*?\n  \};', """const addService = async () => {
    if (isCashierReadOnly) return;
    const name = newService.name.trim();
    if (!name) return;

    const price = Number.parseFloat(newService.price);
    if (!Number.isFinite(price) || price < 0) return;

    const value = newService.durationValue.trim();
    const unit = newService.durationUnit === "hrs" ? "hrs" : "min";
    const numeric = Number.parseFloat(value);
    const duration = Number.isFinite(numeric) && numeric > 0 ? `${numeric} ${unit}` : `30 ${unit}`;

    setPendingServices((curr) => [...curr, { name, description: "", price, duration, taxRate: 0, status: "active", branchId: selectedBranchId }]);
    setNewService({ name: "", price: "", durationValue: "30", durationUnit: "min" });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (isCashierReadOnly || !selectedBranchId) return;
    setIsSaving(true);
    try {
      for (const svc of pendingServices) {
        await createService(svc);
      }
      await saveServiceSplits([{ ...branchSplit, branchId: selectedBranchId }]);
      setPendingServices([]);
      setIsDirty(false);
      const serviceList = await listServices({ branchId: selectedBranchId });
      setServices(serviceList.map((s) => ({ id: s.id, name: s.name, price: s.price, duration: s.duration })));
    } finally {
      setIsSaving(false);
    }
  };""", svc, flags=re.DOTALL)

svc = svc.replace('{services.map((service) => (', '{combinedServices.map((service) => (')
svc = svc.replace('onClick={() => setServiceToDelete(service)}', 'onClick={() => isCashierReadOnly ? setCashierWarningModalOpen(true) : setServiceToDelete(service)}')
svc = svc.replace('onClick={handleSave}', 'onClick={handleSave}')
svc = svc.replace('Save Settings', '{isSaving ? "Saving..." : "Save Settings"}')

svc_modal = """
      <Modal
        isOpen={cashierWarningModalOpen}
        onClose={() => setCashierWarningModalOpen(false)}
        title="Permission Denied"
        footer={<Button variant="primary" onClick={() => setCashierWarningModalOpen(false)} className="w-full">OK</Button>}
      >
        <p className="text-sm text-[var(--muted)]">Admin and Client only can delete a service.</p>
      </Modal>
    </main>
  );
}
"""
svc = svc.replace('    </main>\n  );\n}\n', svc_modal)

with open(path_svc, "w", encoding="utf-8") as f:
    f.write(svc)

print("SUCCESS")
