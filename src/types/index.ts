export type ColumnId =
  | "new-inquiry"
  | "consultation-scheduled"
  | "qualified-fit"
  | "documents-requested"
  | "documents-review"
  | "contract-sent"
  | "signed-active"
  | "paused";

export type MandateType =
  | "Einkommensteuer"
  | "GmbH"
  | "Freelancer"
  | "Steuerberaterwechsel"
  | "Finanzbuchhaltung"
  | "Lohnbuchhaltung"
  | "Jahresabschluss"
  | "Heilberufe"
  | "Rechtsanwälte"
  | "Architekten"
  | "IT-Beratung"
  | "Influencer / Creator"
  | "Praxisgründung";

export type TeamMember = "Karsten Guhr" | "Sophie Weber" | "Max Keller" | "Lisa Braun";

export type StatusTag =
  | "new-lead"
  | "consultation-booked"
  | "qualified"
  | "waiting-documents"
  | "missing-documents"
  | "internal-review"
  | "awaiting-signature"
  | "active"
  | "paused";

export type Priority = "Low" | "Normal" | "High";

export type ActivityType = "created" | "moved" | "checklist" | "generated";

export interface BoardColumn {
  id: ColumnId;
  title: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  detail?: string;
  type: ActivityType;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface ClientCard {
  id: string;
  name: string;
  email: string;
  phone: string;
  mandateTypes: MandateType[];
  assignedTo: TeamMember;
  leadSource: string;
  dateAdded: string;
  currentStage: ColumnId;
  stageUpdatedAt: string;
  status: StatusTag;
  priority: Priority;
  notes: string;
  nextStep: string;
  checklist: ChecklistItem[];
  activity: ActivityItem[];
}

export interface BoardFilters {
  search: string;
  mandateType: "all" | MandateType;
  teamMember: "all" | TeamMember;
  status: "all" | StatusTag;
}

export interface NewClientInput {
  name: string;
  email: string;
  phone: string;
  mandateType: MandateType;
  assignedTo: TeamMember;
  leadSource: string;
  priority: Priority;
  notes: string;
  checklist: ChecklistItem[];
}
