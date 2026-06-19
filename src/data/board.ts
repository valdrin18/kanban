import type {
  BoardColumn,
  ChecklistItem,
  MandateType,
  StatusOption,
  StatusTag,
} from "../types";

export type ChecklistTemplates = Record<string, string[]>;

const defaultStatusLabels: Record<string, string> = {
  "new-lead": "New lead",
  "consultation-booked": "Consultation booked",
  qualified: "Qualified",
  "waiting-documents": "Waiting documents",
  "missing-documents": "Missing documents",
  "internal-review": "Internal review",
  "awaiting-signature": "Awaiting signature",
  active: "Active",
  paused: "Paused",
};

const fallbackChecklist = [
  "Stammdaten received",
  "Steuer-ID / tax number received",
  "Relevant tax documents received",
  "Vollmacht signed",
  "Mandatsvertrag signed",
];

function slugForChecklistItem(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
}

function humanize(value: string) {
  return (
    defaultStatusLabels[value] ??
    value
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function createChecklist(
  mandateTypesForClient: MandateType[],
  templates: ChecklistTemplates,
  completedLabels: string[] = [],
): ChecklistItem[] {
  const items = mandateTypesForClient.flatMap((type) => templates[type] ?? fallbackChecklist);
  const uniqueItems = Array.from(new Set(items));

  return uniqueItems.map((label) => ({
    id: slugForChecklistItem(label),
    label,
    completed: completedLabels.includes(label),
  }));
}

export function getStatusMeta(status: StatusTag, statusOptions: StatusOption[] = []) {
  return (
    statusOptions.find((item) => item.value === status) ?? {
      value: status,
      label: humanize(status),
      tone: "neutral" as const,
    }
  );
}

export function getColumnTitle(columnId: string, columns: BoardColumn[] = []) {
  return columns.find((column) => column.id === columnId)?.title ?? columnId;
}

export function defaultStatusForColumn(columnId: string, columns: BoardColumn[] = []) {
  return columns.find((column) => column.id === columnId)?.defaultStatus ?? "new-lead";
}
