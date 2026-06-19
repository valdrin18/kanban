import {
  Briefcase,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createChecklist, getColumnTitle, type ChecklistTemplates } from "../../data/board";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useBoardStore } from "../../store/useBoardStore";
import type { ChecklistItem, MandateType, NewClientInput, Priority, TeamMember } from "../../types";
import { ChecklistEditor } from "./ChecklistEditor";
import { Button } from "../ui/Button";
import { FormField, embeddedFieldClassName, embeddedSelectClassName } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

function checklistItemId(label: string) {
  const normalized = label.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${normalized || "checklist-item"}-${Date.now().toString(36)}`;
}

function makeInitialForm(
  mandateTypes: string[],
  teamMembers: string[],
  leadSources: string[],
  checklistTemplates: ChecklistTemplates,
): NewClientInput {
  const mandateType = mandateTypes[0] ?? "";

  return {
    name: "",
    email: "",
    phone: "",
    mandateType,
    assignedTo: teamMembers[0] ?? "",
    leadSource: leadSources[0] ?? "",
    priority: "Normal",
    notes: "",
    checklist: mandateType ? createChecklist([mandateType], checklistTemplates) : [],
  };
}

export function AddClientDrawer() {
  const columnId = useBoardStore((state) => state.addClientColumnId);
  const addClient = useBoardStore((state) => state.addClient);
  const closeAddClient = useBoardStore((state) => state.closeAddClient);
  const boardColumns = useBoardStore((state) => state.boardColumns);
  const mandateOptions = useBoardStore((state) => state.mandateTypes);
  const teamOptions = useBoardStore((state) => state.teamMembers);
  const leadSourceOptions = useBoardStore((state) => state.leadSources);
  const checklistTemplates = useBoardStore((state) => state.checklistTemplates);
  const isSaving = useBoardStore((state) => state.isSaving);
  const mandateTypes = useMemo(() => mandateOptions.map((option) => option.name), [mandateOptions]);
  const teamMembers = useMemo(() => teamOptions.map((option) => option.name), [teamOptions]);
  const leadSources = useMemo(
    () => leadSourceOptions.map((option) => option.name),
    [leadSourceOptions],
  );
  const [form, setForm] = useState<NewClientInput>(() =>
    makeInitialForm(mandateTypes, teamMembers, leadSources, checklistTemplates),
  );
  useBodyScrollLock(Boolean(columnId));

  useEffect(() => {
    if (!columnId) return;
    setForm(makeInitialForm(mandateTypes, teamMembers, leadSources, checklistTemplates));
  }, [checklistTemplates, columnId, leadSources, mandateTypes, teamMembers]);

  if (!columnId) return null;
  const activeColumnId = columnId;

  function update<K extends keyof NewClientInput>(key: K, value: NewClientInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateMandateType(mandateType: MandateType) {
    setForm((current) => ({
      ...current,
      mandateType,
      checklist: createChecklist([mandateType], checklistTemplates),
    }));
  }

  function addChecklistItem(label: string) {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    setForm((current) => ({
      ...current,
      checklist: [
        ...current.checklist,
        {
          id: checklistItemId(trimmedLabel),
          label: trimmedLabel,
          completed: false,
        },
      ],
    }));
  }

  function renameChecklistItem(itemId: string, label: string) {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    setForm((current) => ({
      ...current,
      checklist: current.checklist.map((item) =>
        item.id === itemId ? { ...item, label: trimmedLabel } : item,
      ),
    }));
  }

  function removeChecklistItem(itemId: string) {
    setForm((current) => ({
      ...current,
      checklist: current.checklist.filter((item) => item.id !== itemId),
    }));
  }

  function toggleChecklistItem(itemId: string) {
    setForm((current) => ({
      ...current,
      checklist: current.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.mandateType || !form.assignedTo) return;

    await addClient(activeColumnId, {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      leadSource: form.leadSource.trim() || leadSources[0] || "",
      notes: form.notes.trim() || "Prepare onboarding context and confirm next step.",
      checklist: form.checklist.map((item): ChecklistItem => ({
        ...item,
        label: item.label.trim(),
      })),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-guhr-text/18 backdrop-blur-sm">
      <button
        className="hidden flex-1 cursor-default lg:block"
        aria-label="Close add client"
        onClick={closeAddClient}
      />
      <aside className="scrollbar-soft h-full w-full overflow-y-auto border-l border-guhr-border bg-guhr-background shadow-soft sm:max-w-[760px]">
        <div className="sticky top-0 z-10 border-b border-guhr-border bg-guhr-background/92 px-5 py-4 backdrop-blur-2xl sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-guhr-muted">Add client to</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-normal text-guhr-text">
                {getColumnTitle(activeColumnId, boardColumns)}
              </h2>
            </div>
            <Button size="icon" variant="ghost" onClick={closeAddClient} aria-label="Close drawer">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form className="space-y-6 px-5 py-6 sm:px-7" onSubmit={handleSubmit}>
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormField icon={UserRound} label="Client name">
              <Input
                className={embeddedFieldClassName}
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Example GmbH"
                required
              />
            </FormField>
            <FormField icon={Mail} label="Email">
              <Input
                className={embeddedFieldClassName}
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="client@example.de"
                required
              />
            </FormField>
            <FormField icon={Phone} label="Phone">
              <Input
                className={embeddedFieldClassName}
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="+49 30 ..."
              />
            </FormField>
            <FormField icon={Briefcase} label="Mandate" select>
              <Select
                className={embeddedSelectClassName}
                value={form.mandateType}
                onChange={(event) => updateMandateType(event.target.value as MandateType)}
              >
                {mandateTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField icon={UserRound} label="Assigned" select>
              <Select
                className={embeddedSelectClassName}
                value={form.assignedTo}
                onChange={(event) => update("assignedTo", event.target.value as TeamMember)}
              >
                {teamMembers.map((member) => (
                  <option value={member} key={member}>
                    {member}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField icon={CalendarDays} label="Priority" select>
              <Select
                className={embeddedSelectClassName}
                value={form.priority}
                onChange={(event) => update("priority", event.target.value as Priority)}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </Select>
            </FormField>
            <FormField icon={FileText} label="Lead source" select>
              <Select
                className={embeddedSelectClassName}
                value={form.leadSource}
                onChange={(event) => update("leadSource", event.target.value)}
              >
                {leadSources.map((source) => (
                  <option value={source} key={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </FormField>
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-guhr-text">Notes / next steps</h3>
            <Textarea
              className="mt-4 min-h-40 bg-white"
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Internal notes and the next useful action."
            />
          </section>

          <ChecklistEditor
            checklist={form.checklist}
            onAdd={addChecklistItem}
            onRemove={removeChecklistItem}
            onRename={renameChecklistItem}
            onToggle={toggleChecklistItem}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={closeAddClient}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              <Plus className="h-4 w-4" />
              {isSaving ? "Adding..." : "Add client"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
