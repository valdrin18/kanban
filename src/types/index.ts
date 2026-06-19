export type ColumnId = string;

export type MandateType = string;

export type TeamMember = string;

export type StatusTag = string;

export type Priority = "Low" | "Normal" | "High";

export type ActivityType = "created" | "moved" | "checklist";

export interface BoardColumn {
  id: ColumnId;
  title: string;
  description: string;
  defaultStatus: StatusTag;
  sortOrder: number;
}

export interface StatusOption {
  value: StatusTag;
  label: string;
  tone: "neutral" | "gold" | "green" | "orange" | "red" | "gray";
}

export interface LookupOption {
  id: string;
  name: string;
  sortOrder: number;
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
