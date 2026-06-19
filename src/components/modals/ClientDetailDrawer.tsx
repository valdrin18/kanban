import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Clipboard,
  Copy,
  FileText,
  Mail,
  PencilLine,
  Phone,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getStatusMeta } from "../../data/board";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useBoardStore } from "../../store/useBoardStore";
import type { ClientCard, ColumnId, MandateType, TeamMember } from "../../types";
import { generateAiFollowUp } from "../../utils/aiFollowUp";
import { formatDateTime } from "../../utils/dates";
import { isFollowUpRecommended } from "../../utils/recommendations";
import { ChecklistEditor } from "./ChecklistEditor";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FormField, embeddedFieldClassName, embeddedSelectClassName } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

interface ClientDraft {
  name: string;
  email: string;
  phone: string;
  mandateType: MandateType;
  assignedTo: TeamMember;
  leadSource: string;
  dateAdded: string;
  currentStage: ColumnId;
  notes: string;
}

function toInputDate(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function inputDateToIso(value: string, fallback: string) {
  if (!value) return fallback;
  const date = new Date(`${value}T09:00:00`);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
}

function draftFromClient(client: ClientCard): ClientDraft {
  return {
    name: client.name,
    email: client.email,
    phone: client.phone,
    mandateType: client.mandateTypes[0] ?? "",
    assignedTo: client.assignedTo,
    leadSource: client.leadSource,
    dateAdded: toInputDate(client.dateAdded),
    currentStage: client.currentStage,
    notes: client.notes || client.nextStep,
  };
}

export function ClientDetailDrawer() {
  const selectedClientId = useBoardStore((state) => state.selectedClientId);
  const client = useBoardStore((state) =>
    state.clients.find((item) => item.id === state.selectedClientId),
  );
  const closeClient = useBoardStore((state) => state.closeClient);
  const updateClient = useBoardStore((state) => state.updateClient);
  const toggleChecklistItem = useBoardStore((state) => state.toggleChecklistItem);
  const updateChecklistItem = useBoardStore((state) => state.updateChecklistItem);
  const addChecklistItem = useBoardStore((state) => state.addChecklistItem);
  const removeChecklistItem = useBoardStore((state) => state.removeChecklistItem);
  const boardColumns = useBoardStore((state) => state.boardColumns);
  const statusOptions = useBoardStore((state) => state.statusOptions);
  const mandateOptions = useBoardStore((state) => state.mandateTypes);
  const teamOptions = useBoardStore((state) => state.teamMembers);
  const leadSourceOptions = useBoardStore((state) => state.leadSources);
  const isSaving = useBoardStore((state) => state.isSaving);
  const mandateTypes = useMemo(() => mandateOptions.map((option) => option.name), [mandateOptions]);
  const teamMembers = useMemo(() => teamOptions.map((option) => option.name), [teamOptions]);
  const leadSources = useMemo(
    () => leadSourceOptions.map((option) => option.name),
    [leadSourceOptions],
  );
  const [draft, setDraft] = useState<ClientDraft | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  useBodyScrollLock(Boolean(selectedClientId));

  useEffect(() => {
    if (client) {
      setDraft(draftFromClient(client));
    }
    setGeneratedMessage("");
    setGenerationError("");
    setIsGenerating(false);
    setCopied(false);
  }, [selectedClientId]);

  if (!client || !draft) return null;

  const status = getStatusMeta(client.status, statusOptions);
  const needsFollowUp = isFollowUpRecommended(client);
  const [subjectLine, ...messageLines] = generatedMessage.split("\n");
  const messageSubject = subjectLine?.replace(/^Subject:\s*/, "") ?? "";
  const messageBody = messageLines.join("\n").trim();

  function updateDraft<K extends keyof ClientDraft>(key: K, value: ClientDraft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave() {
    if (!client || !draft) return;
    const notes = draft.notes.trim();

    await updateClient(client.id, {
      name: draft.name.trim() || client.name,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      mandateTypes: [draft.mandateType],
      assignedTo: draft.assignedTo,
      leadSource: draft.leadSource,
      dateAdded: inputDateToIso(draft.dateAdded, client.dateAdded),
      currentStage: draft.currentStage,
      notes,
      nextStep: notes || "Review onboarding context and prepare next step.",
    });
  }

  async function handleGenerate() {
    if (!client) return;
    setIsGenerating(true);
    setCopied(false);
    setGeneratedMessage("");
    setGenerationError("");

    try {
      const message = await generateAiFollowUp(client);
      setGeneratedMessage(message);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not generate the follow-up email. Please check the AI configuration.";
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedMessage) return;

    await navigator.clipboard?.writeText(generatedMessage);
    setCopied(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-guhr-text/18 backdrop-blur-sm">
      <button
        className="hidden flex-1 cursor-default lg:block"
        aria-label="Close client detail"
        onClick={closeClient}
      />
      <aside className="scrollbar-soft h-full w-full overflow-y-auto border-l border-guhr-border bg-guhr-background shadow-soft sm:max-w-[760px]">
        <div className="sticky top-0 z-10 border-b border-guhr-border bg-guhr-background/92 px-5 py-4 backdrop-blur-2xl sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone={status.tone}>{status.label}</Badge>
                <Badge tone={client.priority === "High" ? "orange" : client.priority === "Low" ? "gray" : "neutral"}>
                  {client.priority} priority
                </Badge>
                {needsFollowUp && <Badge tone="red">Follow-up recommended</Badge>}
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-guhr-text">
                {client.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="primary" onClick={handleSave} disabled={isSaving}>
                <CheckCircle2 className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button size="icon" variant="ghost" onClick={closeClient} aria-label="Close drawer">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-7">
          <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <FormField icon={UserRound} label="Client name">
              <Input
                className={embeddedFieldClassName}
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
              />
            </FormField>
            <FormField icon={Mail} label="Email">
              <Input
                className={embeddedFieldClassName}
                type="email"
                value={draft.email}
                onChange={(event) => updateDraft("email", event.target.value)}
              />
            </FormField>
            <FormField icon={Phone} label="Phone">
              <Input
                className={embeddedFieldClassName}
                value={draft.phone}
                onChange={(event) => updateDraft("phone", event.target.value)}
              />
            </FormField>
            <FormField icon={Briefcase} label="Mandate" select>
              <Select
                className={embeddedSelectClassName}
                value={draft.mandateType}
                onChange={(event) => updateDraft("mandateType", event.target.value as MandateType)}
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
                value={draft.assignedTo}
                onChange={(event) => updateDraft("assignedTo", event.target.value as TeamMember)}
              >
                {teamMembers.map((member) => (
                  <option value={member} key={member}>
                    {member}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField icon={CalendarDays} label="Date added">
              <Input
                className={embeddedFieldClassName}
                type="date"
                value={draft.dateAdded}
                onChange={(event) => updateDraft("dateAdded", event.target.value)}
              />
            </FormField>
            <FormField icon={FileText} label="Lead source" select>
              <Select
                className={embeddedSelectClassName}
                value={draft.leadSource}
                onChange={(event) => updateDraft("leadSource", event.target.value)}
              >
                {leadSources.map((source) => (
                  <option value={source} key={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField icon={Clock3} label="Current stage" select>
              <Select
                className={embeddedSelectClassName}
                value={draft.currentStage}
                onChange={(event) => updateDraft("currentStage", event.target.value as ColumnId)}
              >
                {boardColumns.map((column) => (
                  <option value={column.id} key={column.id}>
                    {column.title}
                  </option>
                ))}
              </Select>
            </FormField>
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-guhr-text">Notes / next steps</h3>
            <Textarea
              className="mt-4 min-h-40 bg-white"
              value={draft.notes}
              onChange={(event) => updateDraft("notes", event.target.value)}
              placeholder="Internal notes and the next useful action."
            />
          </section>

          <ChecklistEditor
            checklist={client.checklist}
            onAdd={(label) => addChecklistItem(client.id, label)}
            onRemove={(itemId) => removeChecklistItem(client.id, itemId)}
            onRename={(itemId, label) => updateChecklistItem(client.id, itemId, label)}
            onToggle={(itemId) => toggleChecklistItem(client.id, itemId)}
          />

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/82 p-5 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-normal text-guhr-text">
                  Follow-up generator
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-guhr-muted">
                  Uses OpenAI to analyze stage, notes, missing checklist items and next step.
                </p>
              </div>
              <Button
                variant="primary"
                className="h-11 rounded-2xl px-4 text-sm"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <Send className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Follow-Up"}
              </Button>
            </div>
            {generatedMessage && (
              <div className="mt-5 rounded-[1.5rem] border border-guhr-border bg-white p-4">
                <div className="flex items-center justify-between gap-3 border-b border-guhr-border pb-3">
                  <div className="flex flex-wrap items-center gap-2 text-guhr-muted">
                    <PencilLine className="h-4 w-4 text-guhr-gold" />
                    <span className="text-sm font-medium">Draft email</span>
                    <span className="rounded-full bg-guhr-gold-soft px-2.5 py-1 text-xs font-medium text-guhr-gold-dark">
                      AI-generated
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <div className="scrollbar-soft mt-4 max-h-80 overflow-auto text-sm leading-7 text-guhr-text">
                  <p>
                    <strong>Subject:</strong> {messageSubject}
                  </p>
                  <div className="mt-4 whitespace-pre-wrap">{messageBody}</div>
                </div>
              </div>
            )}
            {generationError && (
              <div className="mt-5 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {generationError}
              </div>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-guhr-gold" />
              <h3 className="font-semibold text-guhr-text">Activity timeline</h3>
            </div>
            <div className="scrollbar-soft mt-4 max-h-64 space-y-3 overflow-y-auto pr-2">
              {client.activity.map((activity) => (
                <div className="flex gap-3" key={activity.id}>
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-guhr-background text-guhr-gold">
                    {activity.type === "checklist" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 border-b border-guhr-border/65 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-guhr-text">{activity.title}</p>
                      <time className="text-xs text-guhr-muted">
                        {formatDateTime(activity.timestamp)}
                      </time>
                    </div>
                    {activity.detail && (
                      <p className="mt-1 text-sm leading-6 text-guhr-muted">{activity.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
