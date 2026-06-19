import { create } from "zustand";
import { persist } from "zustand/middleware";
import { boardColumns, createChecklist, getColumnTitle, seedClients } from "../data/board";
import type {
  BoardFilters,
  ClientCard,
  ChecklistItem,
  ColumnId,
  NewClientInput,
  StatusTag,
} from "../types";

interface BoardState {
  clients: ClientCard[];
  filters: BoardFilters;
  selectedClientId: string | null;
  addClientColumnId: ColumnId | null;
  setFilters: (filters: Partial<BoardFilters>) => void;
  clearFilters: () => void;
  openClient: (clientId: string) => void;
  closeClient: () => void;
  openAddClient: (columnId: ColumnId) => void;
  closeAddClient: () => void;
  addClient: (columnId: ColumnId, input: NewClientInput) => void;
  updateClient: (clientId: string, updates: Partial<ClientCard>) => void;
  moveClient: (clientId: string, targetStage: ColumnId, targetIndex: number) => void;
  toggleChecklistItem: (clientId: string, itemId: string) => void;
  updateChecklistItem: (clientId: string, itemId: string, label: string) => void;
  addChecklistItem: (clientId: string, label: string) => void;
  removeChecklistItem: (clientId: string, itemId: string) => void;
  addGeneratedActivity: (clientId: string) => void;
}

const emptyFilters: BoardFilters = {
  search: "",
  mandateType: "all",
  teamMember: "all",
  status: "all",
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultStatusForColumn(columnId: ColumnId): StatusTag {
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

  return statusByColumn[columnId];
}

function checklistItemId(label: string) {
  const normalized = label.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return `${normalized || "checklist-item"}-${Date.now().toString(36)}`;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      clients: seedClients,
      filters: emptyFilters,
      selectedClientId: null,
      addClientColumnId: null,
      setFilters: (filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...filters,
          },
        })),
      clearFilters: () => set({ filters: emptyFilters }),
      openClient: (clientId) => set({ selectedClientId: clientId }),
      closeClient: () => set({ selectedClientId: null }),
      openAddClient: (columnId) => set({ addClientColumnId: columnId }),
      closeAddClient: () => set({ addClientColumnId: null }),
      addClient: (columnId, input) => {
        const now = new Date().toISOString();
        const newClient: ClientCard = {
          id: makeId("client"),
          name: input.name,
          email: input.email,
          phone: input.phone,
          mandateTypes: [input.mandateType],
          assignedTo: input.assignedTo,
          leadSource: input.leadSource,
          dateAdded: now,
          currentStage: columnId,
          stageUpdatedAt: now,
          status: defaultStatusForColumn(columnId),
          priority: input.priority,
          notes: input.notes,
          nextStep: input.notes || "Review onboarding context and prepare next step.",
          checklist: input.checklist.length > 0 ? input.checklist : createChecklist([input.mandateType]),
          activity: [
            {
              id: makeId("activity"),
              timestamp: now,
              title: "Client card created",
              detail: `Added directly to ${getColumnTitle(columnId)}.`,
              type: "created",
            },
          ],
        };

        set((state) => ({
          clients: [...state.clients, newClient],
          addClientColumnId: null,
        }));
      },
      updateClient: (clientId, updates) => {
        const now = new Date().toISOString();
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id !== clientId) return client;

            const stageChanged =
              updates.currentStage !== undefined && updates.currentStage !== client.currentStage;
            const nextStage = updates.currentStage ?? client.currentStage;
            const nextUpdates: Partial<ClientCard> = {
              ...updates,
              stageUpdatedAt: stageChanged ? now : (updates.stageUpdatedAt ?? client.stageUpdatedAt),
            };
            if (stageChanged && updates.status === undefined) {
              nextUpdates.status = defaultStatusForColumn(nextStage);
            }

            return {
              ...client,
              ...nextUpdates,
              activity: stageChanged
                ? [
                    {
                      id: makeId("activity"),
                      timestamp: now,
                      title: "Client details updated",
                      detail: `Stage changed to ${getColumnTitle(nextStage)}.`,
                      type: "moved",
                    },
                    ...client.activity,
                  ]
                : client.activity,
            };
          }),
        }));
      },
      moveClient: (clientId, targetStage, targetIndex) => {
        const state = get();
        const currentClient = state.clients.find((client) => client.id === clientId);
        if (!currentClient) return;

        const stageChanged = currentClient.currentStage !== targetStage;
        const now = new Date().toISOString();
        const sourceTitle = getColumnTitle(currentClient.currentStage);
        const targetTitle = getColumnTitle(targetStage);
        const withoutClient = state.clients.filter((client) => client.id !== clientId);
        const targetColumnClients = withoutClient.filter(
          (client) => client.currentStage === targetStage,
        );
        const beforeClient = targetColumnClients[Math.max(0, targetIndex)];
        const insertionIndex = beforeClient
          ? withoutClient.findIndex((client) => client.id === beforeClient.id)
          : targetColumnClients.length > 0
            ? withoutClient.findIndex(
                (client) => client.id === targetColumnClients[targetColumnClients.length - 1].id,
              ) + 1
            : withoutClient.length;

        const updatedClient: ClientCard = {
          ...currentClient,
          currentStage: targetStage,
          stageUpdatedAt: stageChanged ? now : currentClient.stageUpdatedAt,
          status: stageChanged ? defaultStatusForColumn(targetStage) : currentClient.status,
          activity: stageChanged
            ? [
                {
                  id: makeId("activity"),
                  timestamp: now,
                  title: "Stage updated",
                  detail: `Moved from ${sourceTitle} to ${targetTitle}.`,
                  type: "moved",
                },
                ...currentClient.activity,
              ]
            : currentClient.activity,
        };

        const nextClients = [...withoutClient];
        nextClients.splice(Math.max(0, insertionIndex), 0, updatedClient);

        set({ clients: nextClients });
      },
      toggleChecklistItem: (clientId, itemId) => {
        const now = new Date().toISOString();
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id !== clientId) return client;

            const changedItem = client.checklist.find((item) => item.id === itemId);
            const nextCompleted = !changedItem?.completed;

            return {
              ...client,
              checklist: client.checklist.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item,
              ),
              activity: changedItem
                ? [
                    {
                      id: makeId("activity"),
                      timestamp: now,
                      title: nextCompleted ? "Checklist item completed" : "Checklist item reopened",
                      detail: changedItem.label,
                      type: "checklist",
                    },
                    ...client.activity,
                  ]
                : client.activity,
            };
          }),
        }));
      },
      updateChecklistItem: (clientId, itemId, label) => {
        const trimmedLabel = label.trim();
        if (!trimmedLabel) return;

        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  checklist: client.checklist.map((item) =>
                    item.id === itemId ? { ...item, label: trimmedLabel } : item,
                  ),
                }
              : client,
          ),
        }));
      },
      addChecklistItem: (clientId, label) => {
        const trimmedLabel = label.trim();
        if (!trimmedLabel) return;

        const newItem: ChecklistItem = {
          id: checklistItemId(trimmedLabel),
          label: trimmedLabel,
          completed: false,
        };

        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  checklist: [...client.checklist, newItem],
                }
              : client,
          ),
        }));
      },
      removeChecklistItem: (clientId, itemId) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  checklist: client.checklist.filter((item) => item.id !== itemId),
                }
              : client,
          ),
        }));
      },
      addGeneratedActivity: (clientId) => {
        const now = new Date().toISOString();
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  activity: [
                    {
                      id: makeId("activity"),
                      timestamp: now,
                      title: "Follow-up generated",
                      detail: "Template message prepared for human review.",
                      type: "generated",
                    },
                    ...client.activity,
                  ],
                }
              : client,
          ),
        }));
      },
    }),
    {
      name: "guhr-onboarding-crm",
      partialize: (state) => ({
        clients: state.clients,
        filters: state.filters,
      }),
      version: 1,
    },
  ),
);

export const columnIds = boardColumns.map((column) => column.id);
