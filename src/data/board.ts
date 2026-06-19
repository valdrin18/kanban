import type {
  BoardColumn,
  ChecklistItem,
  ClientCard,
  MandateType,
  StatusTag,
  TeamMember,
} from "../types";
import { daysAgo } from "../utils/dates";

export const boardColumns: BoardColumn[] = [
  {
    id: "new-inquiry",
    title: "New Inquiry",
    description: "First contact received, not yet qualified.",
  },
  {
    id: "consultation-scheduled",
    title: "Initial Consultation Scheduled",
    description: "Meeting booked, awaiting first call.",
  },
  {
    id: "qualified-fit",
    title: "Qualified / Mandate Fit",
    description: "Mandate type confirmed and client appears to be a good fit.",
  },
  {
    id: "documents-requested",
    title: "Vollmacht & Documents Requested",
    description: "Power of attorney, master data, and tax documents requested.",
  },
  {
    id: "documents-review",
    title: "Documents Received / Review",
    description: "Documents are in and internal review is in progress.",
  },
  {
    id: "contract-sent",
    title: "Mandatsvertrag Sent",
    description: "Engagement letter or contract has been sent.",
  },
  {
    id: "signed-active",
    title: "Signed & Active",
    description: "Client fully onboarded and handed over to the team.",
  },
  {
    id: "paused",
    title: "On Hold / Paused",
    description: "Onboarding stalled, delayed, or paused.",
  },
];

export const mandateTypes: MandateType[] = [
  "Einkommensteuer",
  "GmbH",
  "Freelancer",
  "Steuerberaterwechsel",
  "Finanzbuchhaltung",
  "Lohnbuchhaltung",
  "Jahresabschluss",
  "Heilberufe",
  "Rechtsanwälte",
  "Architekten",
  "IT-Beratung",
  "Influencer / Creator",
  "Praxisgründung",
];

export const teamMembers: TeamMember[] = [
  "Karsten Guhr",
  "Sophie Weber",
  "Max Keller",
  "Lisa Braun",
];

export const leadSourceOptions = [
  "Website inquiry",
  "Google Search",
  "LinkedIn",
  "Referral from existing client",
  "Partner recommendation",
  "Instagram profile",
  "Local business network",
  "Tax newsletter",
  "Existing network",
  "Manual entry",
];

export const statusOptions: Array<{
  value: StatusTag;
  label: string;
  tone: "neutral" | "gold" | "green" | "orange" | "red" | "gray";
}> = [
  { value: "new-lead", label: "New lead", tone: "gold" },
  { value: "consultation-booked", label: "Consultation booked", tone: "neutral" },
  { value: "qualified", label: "Qualified", tone: "green" },
  { value: "waiting-documents", label: "Waiting documents", tone: "orange" },
  { value: "missing-documents", label: "Missing documents", tone: "red" },
  { value: "internal-review", label: "Internal review", tone: "neutral" },
  { value: "awaiting-signature", label: "Awaiting signature", tone: "orange" },
  { value: "active", label: "Active", tone: "green" },
  { value: "paused", label: "Paused", tone: "gray" },
];

export const checklistTemplates: Partial<Record<MandateType, string[]>> = {
  GmbH: [
    "Handelsregisterauszug received",
    "Gesellschaftsvertrag received",
    "Previous Jahresabschluss received",
    "Bank statements received",
    "DATEV export requested",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Freelancer: [
    "Steuer-ID received",
    "Basic income overview received",
    "Invoices / receipts received",
    "Previous tax assessment received",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Steuerberaterwechsel: [
    "Vollmacht signed",
    "Stammdaten received",
    "Previous advisor contacted",
    "DATEV export requested",
    "Open deadlines reviewed",
    "Mandatsvertrag signed",
  ],
  Finanzbuchhaltung: [
    "Accounting scope confirmed",
    "Bank access clarified",
    "Document upload process explained",
    "DATEV Unternehmen online invited",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Lohnbuchhaltung: [
    "Employee count received",
    "Payroll start date confirmed",
    "ELStAM access clarified",
    "Social security registrations reviewed",
    "Payroll history received",
    "Mandatsvertrag signed",
  ],
  Jahresabschluss: [
    "Trial balance received",
    "Previous Jahresabschluss received",
    "Open items list received",
    "Bank statements received",
    "Fixed asset schedule received",
    "Mandatsvertrag signed",
  ],
  Heilberufe: [
    "Practice registration details received",
    "Revenue split clarified",
    "Insurance documents received",
    "Bank statements received",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Rechtsanwälte: [
    "Professional registration confirmed",
    "Trust account handling clarified",
    "Revenue model reviewed",
    "Previous tax assessment received",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Architekten: [
    "Project revenue overview received",
    "Open project list received",
    "Previous Jahresabschluss received",
    "Bank statements received",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  "IT-Beratung": [
    "Service scope confirmed",
    "Revenue structure reviewed",
    "Invoices / receipts received",
    "VAT setup clarified",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  "Influencer / Creator": [
    "Platform revenue overview received",
    "Sponsorship contracts requested",
    "Expense categories reviewed",
    "VAT treatment clarified",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
  Praxisgründung: [
    "Founding timeline confirmed",
    "Registration documents received",
    "Bank account setup clarified",
    "Investment plan received",
    "Vollmacht signed",
    "Mandatsvertrag signed",
  ],
};

const fallbackChecklist = [
  "Stammdaten received",
  "Steuer-ID / tax number received",
  "Relevant tax documents received",
  "Vollmacht signed",
  "Mandatsvertrag signed",
];

export function createChecklist(
  mandateTypesForClient: MandateType[],
  completedLabels: string[] = [],
): ChecklistItem[] {
  const items = mandateTypesForClient.flatMap(
    (type) => checklistTemplates[type] ?? fallbackChecklist,
  );
  const uniqueItems = Array.from(new Set(items));

  return uniqueItems.map((label) => ({
    id: label.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
    label,
    completed: completedLabels.includes(label),
  }));
}

function activity(id: string, title: string, detail: string, days: number) {
  return {
    id,
    title,
    detail,
    timestamp: daysAgo(days),
    type: "created" as const,
  };
}

export const seedClients: ClientCard[] = [
  {
    id: "client-mueller-media",
    name: "Müller Media GmbH",
    email: "finance@mueller-media.de",
    phone: "+49 30 4881 2030",
    mandateTypes: ["GmbH", "Finanzbuchhaltung"],
    assignedTo: "Sophie Weber",
    leadSource: "Referral from existing client",
    dateAdded: daysAgo(11),
    currentStage: "documents-requested",
    stageUpdatedAt: daysAgo(6),
    status: "waiting-documents",
    priority: "High",
    notes: "Client wants monthly bookkeeping to start before the next VAT pre-registration.",
    nextStep: "Send reminder for missing Vollmacht and DATEV export.",
    checklist: createChecklist(["GmbH", "Finanzbuchhaltung"], [
      "Handelsregisterauszug received",
      "Gesellschaftsvertrag received",
      "Accounting scope confirmed",
      "Document upload process explained",
    ]),
    activity: [
      activity(
        "act-mueller-documents",
        "Documents requested",
        "Vollmacht, DATEV export and bank statements requested.",
        6,
      ),
      activity(
        "act-mueller-created",
        "Inquiry qualified",
        "Mandate fit confirmed after founder call.",
        11,
      ),
    ],
  },
  {
    id: "client-anna-schneider",
    name: "Anna Schneider",
    email: "anna.schneider@example.de",
    phone: "+49 176 4400 1182",
    mandateTypes: ["Freelancer", "IT-Beratung"],
    assignedTo: "Max Keller",
    leadSource: "Website inquiry",
    dateAdded: daysAgo(3),
    currentStage: "consultation-scheduled",
    stageUpdatedAt: daysAgo(1),
    status: "consultation-booked",
    priority: "Normal",
    notes: "Freelance software consultant with mixed German and EU clients.",
    nextStep: "Prepare questions about income structure and current tax setup.",
    checklist: createChecklist(["Freelancer", "IT-Beratung"]),
    activity: [
      activity(
        "act-schneider-call",
        "Consultation scheduled",
        "Introductory call booked for this week.",
        1,
      ),
      activity(
        "act-schneider-created",
        "New inquiry received",
        "Lead came in through the website contact form.",
        3,
      ),
    ],
  },
  {
    id: "client-kaya-studio",
    name: "Kaya Studio",
    email: "hello@kayastudio.de",
    phone: "+49 30 9001 7700",
    mandateTypes: ["Influencer / Creator"],
    assignedTo: "Lisa Braun",
    leadSource: "Instagram profile",
    dateAdded: daysAgo(2),
    currentStage: "new-inquiry",
    stageUpdatedAt: daysAgo(2),
    status: "new-lead",
    priority: "Normal",
    notes: "Creator collective with sponsorship and platform revenue.",
    nextStep: "Qualify mandate type and revenue situation.",
    checklist: createChecklist(["Influencer / Creator"]),
    activity: [
      activity(
        "act-kaya-created",
        "New inquiry received",
        "Team requested support for creator revenue and VAT topics.",
        2,
      ),
    ],
  },
  {
    id: "client-weber-partner",
    name: "Weber & Partner",
    email: "kanzlei@weberpartner.de",
    phone: "+49 30 2332 6611",
    mandateTypes: ["Rechtsanwälte"],
    assignedTo: "Karsten Guhr",
    leadSource: "Partner recommendation",
    dateAdded: daysAgo(17),
    currentStage: "contract-sent",
    stageUpdatedAt: daysAgo(5),
    status: "awaiting-signature",
    priority: "High",
    notes: "Legal partnership needs clarity around trust account handling and monthly reporting.",
    nextStep: "Follow up on engagement letter.",
    checklist: createChecklist(["Rechtsanwälte"], [
      "Professional registration confirmed",
      "Trust account handling clarified",
      "Revenue model reviewed",
      "Previous tax assessment received",
      "Vollmacht signed",
    ]),
    activity: [
      activity(
        "act-weber-contract",
        "Mandatsvertrag sent",
        "Engagement letter sent to managing partner for signature.",
        5,
      ),
      activity(
        "act-weber-review",
        "Internal review completed",
        "Open questions around trust accounts clarified.",
        8,
      ),
    ],
  },
  {
    id: "client-lena-hoffmann",
    name: "Dr. Lena Hoffmann",
    email: "praxis@dr-hoffmann.de",
    phone: "+49 30 7110 4920",
    mandateTypes: ["Heilberufe", "Praxisgründung"],
    assignedTo: "Sophie Weber",
    leadSource: "Google Search",
    dateAdded: daysAgo(9),
    currentStage: "documents-review",
    stageUpdatedAt: daysAgo(2),
    status: "internal-review",
    priority: "Normal",
    notes: "Practice opening planned for next quarter; investment plan and registration documents arrived.",
    nextStep: "Review documents and identify open items.",
    checklist: createChecklist(["Heilberufe", "Praxisgründung"], [
      "Practice registration details received",
      "Revenue split clarified",
      "Registration documents received",
      "Investment plan received",
      "Vollmacht signed",
    ]),
    activity: [
      activity(
        "act-hoffmann-review",
        "Documents moved to review",
        "Initial package received through secure upload.",
        2,
      ),
      activity(
        "act-hoffmann-requested",
        "Onboarding documents requested",
        "Requested founding timeline and practice documents.",
        7,
      ),
    ],
  },
  {
    id: "client-novak-it",
    name: "Novak IT Consulting",
    email: "office@novak-it.de",
    phone: "+49 157 7300 8801",
    mandateTypes: ["Steuerberaterwechsel", "IT-Beratung"],
    assignedTo: "Max Keller",
    leadSource: "LinkedIn",
    dateAdded: daysAgo(12),
    currentStage: "documents-requested",
    stageUpdatedAt: daysAgo(8),
    status: "missing-documents",
    priority: "High",
    notes: "Client is switching advisors and has open VAT deadlines.",
    nextStep: "Request Stammdaten and previous advisor details.",
    checklist: createChecklist(["Steuerberaterwechsel", "IT-Beratung"], [
      "Vollmacht signed",
      "Service scope confirmed",
      "Revenue structure reviewed",
    ]),
    activity: [
      activity(
        "act-novak-documents",
        "Documents requested",
        "Missing Stammdaten and previous advisor contact details.",
        8,
      ),
      activity(
        "act-novak-created",
        "Mandate fit confirmed",
        "Advisor switch accepted after deadline check.",
        12,
      ),
    ],
  },
  {
    id: "client-kreativbau",
    name: "Kreativbau Architekten",
    email: "office@kreativbau.de",
    phone: "+49 30 6702 5590",
    mandateTypes: ["Architekten", "Jahresabschluss"],
    assignedTo: "Lisa Braun",
    leadSource: "Local business network",
    dateAdded: daysAgo(25),
    currentStage: "paused",
    stageUpdatedAt: daysAgo(13),
    status: "paused",
    priority: "Low",
    notes: "Client paused onboarding during internal partner decision.",
    nextStep: "Clarify whether client wants to continue onboarding.",
    checklist: createChecklist(["Architekten", "Jahresabschluss"], [
      "Project revenue overview received",
      "Open project list received",
    ]),
    activity: [
      activity(
        "act-kreativbau-paused",
        "Onboarding paused",
        "Client asked to pause until partners approve the advisory budget.",
        13,
      ),
      activity(
        "act-kreativbau-created",
        "Initial consultation completed",
        "Potential Jahresabschluss mandate discussed.",
        25,
      ),
    ],
  },
  {
    id: "client-berger-payroll",
    name: "Berger Payroll Services",
    email: "people@berger-services.de",
    phone: "+49 30 1299 4412",
    mandateTypes: ["Lohnbuchhaltung"],
    assignedTo: "Sophie Weber",
    leadSource: "Tax newsletter",
    dateAdded: daysAgo(5),
    currentStage: "qualified-fit",
    stageUpdatedAt: daysAgo(2),
    status: "qualified",
    priority: "Normal",
    notes: "Growing team with 18 employees and two Werkstudenten.",
    nextStep: "Request employee count and payroll history.",
    checklist: createChecklist(["Lohnbuchhaltung"], ["Employee count received"]),
    activity: [
      activity(
        "act-berger-qualified",
        "Mandate fit confirmed",
        "Payroll scope appears suitable for Guhr onboarding.",
        2,
      ),
      activity(
        "act-berger-created",
        "Inquiry received",
        "Newsletter reply asking about payroll support.",
        5,
      ),
    ],
  },
  {
    id: "client-schmidt-ecommerce",
    name: "Schmidt E-Commerce GmbH",
    email: "accounting@schmidt-commerce.de",
    phone: "+49 30 8188 4620",
    mandateTypes: ["GmbH", "Finanzbuchhaltung", "Jahresabschluss"],
    assignedTo: "Karsten Guhr",
    leadSource: "Existing network",
    dateAdded: daysAgo(18),
    currentStage: "signed-active",
    stageUpdatedAt: daysAgo(4),
    status: "active",
    priority: "Normal",
    notes: "Onboarding completed. Team handover completed with bookkeeping owner.",
    nextStep: "Hand over to responsible team.",
    checklist: createChecklist(["GmbH", "Finanzbuchhaltung", "Jahresabschluss"], [
      "Handelsregisterauszug received",
      "Gesellschaftsvertrag received",
      "Previous Jahresabschluss received",
      "Bank statements received",
      "DATEV export requested",
      "Vollmacht signed",
      "Mandatsvertrag signed",
      "Accounting scope confirmed",
      "Bank access clarified",
      "Document upload process explained",
      "DATEV Unternehmen online invited",
      "Trial balance received",
      "Open items list received",
      "Fixed asset schedule received",
    ]),
    activity: [
      activity(
        "act-schmidt-active",
        "Signed & active",
        "Mandatsvertrag signed and handover completed.",
        4,
      ),
      activity(
        "act-schmidt-review",
        "Document review completed",
        "Initial bookkeeping package approved.",
        7,
      ),
    ],
  },
];

export function getStatusMeta(status: StatusTag) {
  return statusOptions.find((item) => item.value === status) ?? statusOptions[0];
}

export function getColumnTitle(columnId: string) {
  return boardColumns.find((column) => column.id === columnId)?.title ?? columnId;
}
