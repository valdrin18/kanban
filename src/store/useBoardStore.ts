import { create } from "zustand";
import {
  addChecklistItemRecord,
  createClientRecord,
  loadBoardData,
  persistClientMove,
  removeChecklistItemRecord,
  toggleChecklistItemRecord,
  updateChecklistItemRecord,
  updateClientRecord,
} from "../lib/boardRepository";
import {
  defaultStatusForColumn,
  getColumnTitle,
  type ChecklistTemplates,
} from "../data/board";
import type {
  BoardColumn,
  BoardFilters,
  ChecklistItem,
  ClientCard,
  ColumnId,
  LookupOption,
  NewClientInput,
  StatusOption,
} from "../types";

interface BoardState {
  clients: ClientCard[];
  boardColumns: BoardColumn[];
  statusOptions: StatusOption[];
  mandateTypes: LookupOption[];
  teamMembers: LookupOption[];
  leadSources: LookupOption[];
  checklistTemplates: ChecklistTemplates;
  filters: BoardFilters;
  selectedClientId: string | null;
  addClientColumnId: ColumnId | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  loadBoard: () => Promise<void>;
  setFilters: (filters: Partial<BoardFilters>) => void;
  clearFilters: () => void;
  openClient: (clientId: string) => void;
  closeClient: () => void;
  openAddClient: (columnId: ColumnId) => void;
  closeAddClient: () => void;
  addClient: (columnId: ColumnId, input: NewClientInput) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<ClientCard>) => Promise<void>;
  moveClient: (clientId: string, targetStage: ColumnId, targetIndex: number) => void;
  toggleChecklistItem: (clientId: string, itemId: string) => void;
  updateChecklistItem: (clientId: string, itemId: string, label: string) => void;
  addChecklistItem: (clientId: string, label: string) => Promise<void>;
  removeChecklistItem: (clientId: string, itemId: string) => void;
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

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong while saving the board.";
}

function lookupsFromState(state: BoardState) {
  return {
    mandateTypes: state.mandateTypes,
    teamMembers: state.teamMembers,
    leadSources: state.leadSources,
  };
}

export const useBoardStore = create<BoardState>()((set, get) => ({
  clients: [],
  boardColumns: [],
  statusOptions: [],
  mandateTypes: [],
  teamMembers: [],
  leadSources: [],
  checklistTemplates: {},
  filters: emptyFilters,
  selectedClientId: null,
  addClientColumnId: null,
  isLoading: true,
  isSaving: false,
  error: null,
  loadBoard: async () => {
    const hasLoadedLookups = get().boardColumns.length > 0;
    set({ isLoading: !hasLoadedLookups, error: null });

    try {
      const data = await loadBoardData();
      set({
        clients: data.clients,
        boardColumns: data.boardColumns,
        statusOptions: data.statusOptions,
        mandateTypes: data.mandateTypes,
        teamMembers: data.teamMembers,
        leadSources: data.leadSources,
        checklistTemplates: data.checklistTemplates,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false, error: errorMessage(error) });
    }
  },
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
  addClient: async (columnId, input) => {
    set({ isSaving: true, error: null });

    try {
      const state = get();
      await createClientRecord(columnId, input, lookupsFromState(state), state.boardColumns);
      await get().loadBoard();
      set({ addClientColumnId: null, isSaving: false });
    } catch (error) {
      set({ isSaving: false, error: errorMessage(error) });
    }
  },
  updateClient: async (clientId, updates) => {
    const client = get().clients.find((item) => item.id === clientId);
    if (!client) return;

    set({ isSaving: true, error: null });

    try {
      const state = get();
      await updateClientRecord(client, updates, lookupsFromState(state), state.boardColumns);
      await get().loadBoard();
      set({ isSaving: false });
    } catch (error) {
      set({ isSaving: false, error: errorMessage(error) });
    }
  },
  moveClient: (clientId, targetStage, targetIndex) => {
    const state = get();
    const currentClient = state.clients.find((client) => client.id === clientId);
    if (!currentClient) return;

    const stageChanged = currentClient.currentStage !== targetStage;
    const now = new Date().toISOString();
    const sourceTitle = getColumnTitle(currentClient.currentStage, state.boardColumns);
    const targetTitle = getColumnTitle(targetStage, state.boardColumns);
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
      status: stageChanged
        ? defaultStatusForColumn(targetStage, state.boardColumns)
        : currentClient.status,
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

    set({ clients: nextClients, error: null });

    void persistClientMove(currentClient, nextClients, state.boardColumns).catch((error) => {
      set({ error: errorMessage(error) });
      void get().loadBoard();
    });
  },
  toggleChecklistItem: (clientId, itemId) => {
    const now = new Date().toISOString();
    const state = get();
    const client = state.clients.find((item) => item.id === clientId);
    const changedItem = client?.checklist.find((item) => item.id === itemId);
    if (!client || !changedItem) return;

    const nextCompleted = !changedItem.completed;

    set({
      clients: state.clients.map((item) =>
        item.id === clientId
          ? {
              ...item,
              checklist: item.checklist.map((checklistItem) =>
                checklistItem.id === itemId
                  ? { ...checklistItem, completed: !checklistItem.completed }
                  : checklistItem,
              ),
              activity: [
                {
                  id: makeId("activity"),
                  timestamp: now,
                  title: nextCompleted ? "Checklist item completed" : "Checklist item reopened",
                  detail: changedItem.label,
                  type: "checklist",
                },
                ...item.activity,
              ],
            }
          : item,
      ),
      error: null,
    });

    void toggleChecklistItemRecord(client, changedItem).catch((error) => {
      set({ error: errorMessage(error) });
      void get().loadBoard();
    });
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
      error: null,
    }));

    void updateChecklistItemRecord(itemId, trimmedLabel).catch((error) => {
      set({ error: errorMessage(error) });
      void get().loadBoard();
    });
  },
  addChecklistItem: async (clientId, label) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    const client = get().clients.find((item) => item.id === clientId);
    if (!client) return;

    set({ isSaving: true, error: null });

    try {
      await addChecklistItemRecord(client, trimmedLabel);
      await get().loadBoard();
      set({ isSaving: false });
    } catch (error) {
      set({ isSaving: false, error: errorMessage(error) });
    }
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
      error: null,
    }));

    void removeChecklistItemRecord(itemId).catch((error) => {
      set({ error: errorMessage(error) });
      void get().loadBoard();
    });
  },
}));
