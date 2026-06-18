import { Plus, X } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { getColumnTitle, mandateTypes, statusOptions, teamMembers } from "../../data/board";
import { useBoardStore } from "../../store/useBoardStore";
import type { ColumnId, MandateType, NewClientInput, Priority, StatusTag, TeamMember } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const statusByColumn: Record<ColumnId, StatusTag> = {
  "new-inquiry": "new-lead",
  "consultation-scheduled": "consultation-booked",
  "qualified-fit": "qualified",
  "documents-requested": "waiting-documents",
  "documents-review": "internal-review",
  "contract-sent": "awaiting-signature",
  "signed-active": "active",
  paused: "paused",
};

const initialForm: NewClientInput = {
  name: "",
  email: "",
  phone: "",
  mandateType: "GmbH",
  assignedTo: "Sophie Weber",
  status: "new-lead",
  priority: "Normal",
  notes: "",
};

export function AddClientDrawer() {
  const columnId = useBoardStore((state) => state.addClientColumnId);
  const addClient = useBoardStore((state) => state.addClient);
  const closeAddClient = useBoardStore((state) => state.closeAddClient);
  const [form, setForm] = useState<NewClientInput>(initialForm);

  useEffect(() => {
    if (!columnId) return;
    setForm({
      ...initialForm,
      status: statusByColumn[columnId],
    });
  }, [columnId]);

  if (!columnId) return null;
  const activeColumnId = columnId;

  function update<K extends keyof NewClientInput>(key: K, value: NewClientInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    addClient(activeColumnId, {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim() || "Prepare onboarding context and confirm next step.",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-guhr-text/18 backdrop-blur-sm">
      <button
        className="hidden flex-1 cursor-default lg:block"
        aria-label="Close add client"
        onClick={closeAddClient}
      />
      <aside className="scrollbar-soft h-full w-full overflow-y-auto border-l border-guhr-border bg-guhr-background shadow-soft sm:max-w-[520px]">
        <div className="sticky top-0 z-10 border-b border-guhr-border bg-guhr-background/92 px-5 py-4 backdrop-blur-2xl sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-guhr-muted">Add client to</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal text-guhr-text">
                {getColumnTitle(activeColumnId)}
              </h2>
            </div>
            <Button size="icon" variant="ghost" onClick={closeAddClient} aria-label="Close drawer">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form className="space-y-5 px-5 py-5 sm:px-6" onSubmit={handleSubmit}>
          <div className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <div className="grid gap-4">
              <Field label="Client name">
                <Input
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  placeholder="Example GmbH"
                  required
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="client@example.de"
                    required
                  />
                </Field>
                <Field label="Phone">
                  <Input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+49 30 ..."
                  />
                </Field>
              </div>

              <Field label="Mandate type">
                <Select
                  value={form.mandateType}
                  onChange={(event) => update("mandateType", event.target.value as MandateType)}
                >
                  {mandateTypes.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Assigned team member">
                  <Select
                    value={form.assignedTo}
                    onChange={(event) => update("assignedTo", event.target.value as TeamMember)}
                  >
                    {teamMembers.map((member) => (
                      <option value={member} key={member}>
                        {member}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Priority">
                  <Select
                    value={form.priority}
                    onChange={(event) => update("priority", event.target.value as Priority)}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </Select>
                </Field>
              </div>

              <Field label="Status">
                <Select
                  value={form.status}
                  onChange={(event) => update("status", event.target.value as StatusTag)}
                >
                  {statusOptions.map((status) => (
                    <option value={status.value} key={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Notes / next step">
                <Textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder="Summarize the current situation and the next useful action."
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={closeAddClient}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="h-4 w-4" />
              Add client
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-guhr-muted">{label}</span>
      {children}
    </label>
  );
}
