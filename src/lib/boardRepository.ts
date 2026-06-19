import { defaultStatusForColumn, getColumnTitle, type ChecklistTemplates } from "../data/board";
import type {
  ActivityItem,
  BoardColumn,
  ChecklistItem,
  ClientCard,
  ColumnId,
  LookupOption,
  NewClientInput,
  StatusOption,
} from "../types";
import { requireSupabase } from "./supabase";

interface LookupRecords {
  mandateTypes: LookupOption[];
  teamMembers: LookupOption[];
  leadSources: LookupOption[];
}

interface LoadedBoardData extends LookupRecords {
  boardColumns: BoardColumn[];
  statusOptions: StatusOption[];
  checklistTemplates: ChecklistTemplates;
  clients: ClientCard[];
}

interface DbStatusTag {
  id: string;
  label: string;
  tone: StatusOption["tone"];
  sort_order: number;
}

interface DbBoardColumn {
  id: string;
  title: string;
  description: string;
  default_status: string;
  sort_order: number;
}

interface DbLookup {
  id: string;
  name?: string;
  label?: string;
  sort_order: number;
}

interface DbChecklistTemplate {
  label: string;
  sort_order: number;
  mandate_types: {
    name: string;
  } | null;
}

interface DbClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_added: string;
  current_stage: string;
  stage_updated_at: string;
  status: string;
  priority: ClientCard["priority"];
  notes: string;
  next_step: string;
  position: number;
  team_members: {
    name: string;
  } | null;
  lead_sources: {
    label: string;
  } | null;
  client_mandates: Array<{
    sort_order: number;
    mandate_types: {
      name: string;
    } | null;
  }>;
  client_checklist_items: Array<{
    id: string;
    label: string;
    completed: boolean;
    sort_order: number;
  }>;
  client_activity: Array<{
    id: string;
    title: string;
    detail: string | null;
    type: ActivityItem["type"];
    created_at: string;
  }>;
}

function throwOnError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function findLookupId(options: LookupOption[], name: string, label: string) {
  const match = options.find((option) => option.name === name);

  if (!match) {
    throw new Error(`${label} "${name}" was not found in Supabase lookup data.`);
  }

  return match.id;
}

function mapClient(row: DbClient): ClientCard {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    mandateTypes: [...row.client_mandates]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((mandate) => mandate.mandate_types?.name)
      .filter((name): name is string => Boolean(name)),
    assignedTo: row.team_members?.name ?? "Unassigned",
    leadSource: row.lead_sources?.label ?? "Manual entry",
    dateAdded: row.date_added,
    currentStage: row.current_stage,
    stageUpdatedAt: row.stage_updated_at,
    status: row.status,
    priority: row.priority,
    notes: row.notes,
    nextStep: row.next_step,
    checklist: [...row.client_checklist_items]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (item): ChecklistItem => ({
          id: item.id,
          label: item.label,
          completed: item.completed,
        }),
      ),
    activity: [...row.client_activity]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(
        (activity): ActivityItem => ({
          id: activity.id,
          title: activity.title,
          detail: activity.detail ?? undefined,
          timestamp: activity.created_at,
          type: activity.type,
        }),
      ),
  };
}

function lookupRecords(data: DbLookup[] | null, labelKey: "name" | "label") {
  return (data ?? []).map((item) => ({
    id: item.id,
    name: item[labelKey] ?? "",
    sortOrder: item.sort_order,
  }));
}

export async function loadBoardData(): Promise<LoadedBoardData> {
  const supabase = requireSupabase();
  const [
    statusResult,
    columnResult,
    teamResult,
    mandateResult,
    leadSourceResult,
    templateResult,
    clientResult,
  ] = await Promise.all([
    supabase.from("status_tags").select("id,label,tone,sort_order").order("sort_order"),
    supabase
      .from("board_columns")
      .select("id,title,description,default_status,sort_order")
      .order("sort_order"),
    supabase.from("team_members").select("id,name,sort_order").eq("active", true).order("sort_order"),
    supabase
      .from("mandate_types")
      .select("id,name,sort_order")
      .eq("active", true)
      .order("sort_order"),
    supabase.from("lead_sources").select("id,label,sort_order").eq("active", true).order("sort_order"),
    supabase
      .from("checklist_templates")
      .select("label,sort_order,mandate_types(name)")
      .order("sort_order"),
    supabase
      .from("clients")
      .select(
        `
          id,
          name,
          email,
          phone,
          date_added,
          current_stage,
          stage_updated_at,
          status,
          priority,
          notes,
          next_step,
          position,
          team_members(name),
          lead_sources(label),
          client_mandates(sort_order, mandate_types(name)),
          client_checklist_items(id, label, completed, sort_order),
          client_activity(id, title, detail, type, created_at)
        `,
      )
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  throwOnError(statusResult.error);
  throwOnError(columnResult.error);
  throwOnError(teamResult.error);
  throwOnError(mandateResult.error);
  throwOnError(leadSourceResult.error);
  throwOnError(templateResult.error);
  throwOnError(clientResult.error);

  const checklistTemplates: ChecklistTemplates = {};
  ((templateResult.data ?? []) as unknown as DbChecklistTemplate[]).forEach((template) => {
    const mandateName = template.mandate_types?.name;
    if (!mandateName) return;

    checklistTemplates[mandateName] = [
      ...(checklistTemplates[mandateName] ?? []),
      template.label,
    ];
  });

  return {
    boardColumns: ((columnResult.data ?? []) as DbBoardColumn[]).map((column) => ({
      id: column.id,
      title: column.title,
      description: column.description,
      defaultStatus: column.default_status,
      sortOrder: column.sort_order,
    })),
    statusOptions: ((statusResult.data ?? []) as DbStatusTag[]).map((status) => ({
      value: status.id,
      label: status.label,
      tone: status.tone,
    })),
    teamMembers: lookupRecords(teamResult.data as DbLookup[] | null, "name"),
    mandateTypes: lookupRecords(mandateResult.data as DbLookup[] | null, "name"),
    leadSources: lookupRecords(leadSourceResult.data as DbLookup[] | null, "label"),
    checklistTemplates,
    clients: ((clientResult.data ?? []) as unknown as DbClient[]).map(mapClient),
  };
}

export async function createClientRecord(
  columnId: ColumnId,
  input: NewClientInput,
  lookups: LookupRecords,
  columns: BoardColumn[],
) {
  const supabase = requireSupabase();
  const teamMemberId = findLookupId(lookups.teamMembers, input.assignedTo, "Team member");
  const leadSourceId = findLookupId(lookups.leadSources, input.leadSource, "Lead source");
  const mandateTypeId = findLookupId(lookups.mandateTypes, input.mandateType, "Mandate type");
  const status = defaultStatusForColumn(columnId, columns);

  const { data: lastClient, error: positionError } = await supabase
    .from("clients")
    .select("position")
    .eq("current_stage", columnId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  throwOnError(positionError);

  const position = typeof lastClient?.position === "number" ? lastClient.position + 1 : 0;
  const nextStep = input.notes || "Review onboarding context and prepare next step.";

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      assigned_team_member_id: teamMemberId,
      lead_source_id: leadSourceId,
      current_stage: columnId,
      status,
      priority: input.priority,
      notes: input.notes,
      next_step: nextStep,
      position,
    })
    .select("id")
    .single();
  throwOnError(clientError);

  const clientId = client!.id as string;

  const checklistRows = input.checklist.map((item, index) => ({
    client_id: clientId,
    label: item.label,
    completed: item.completed,
    sort_order: index,
  }));

  const { error: mandateError } = await supabase.from("client_mandates").insert({
    client_id: clientId,
    mandate_type_id: mandateTypeId,
    sort_order: 0,
  });
  throwOnError(mandateError);

  if (checklistRows.length > 0) {
    const { error: checklistError } = await supabase
      .from("client_checklist_items")
      .insert(checklistRows);
    throwOnError(checklistError);
  }

  const { error: activityError } = await supabase.from("client_activity").insert({
    client_id: clientId,
    title: "Client card created",
    detail: `Added directly to ${getColumnTitle(columnId, columns)}.`,
    type: "created",
  });
  throwOnError(activityError);
}

export async function updateClientRecord(
  client: ClientCard,
  updates: Partial<ClientCard>,
  lookups: LookupRecords,
  columns: BoardColumn[],
) {
  const supabase = requireSupabase();
  const nextStage = updates.currentStage ?? client.currentStage;
  const stageChanged = nextStage !== client.currentStage;
  const patch: Record<string, unknown> = {};

  if (updates.name !== undefined) patch.name = updates.name;
  if (updates.email !== undefined) patch.email = updates.email;
  if (updates.phone !== undefined) patch.phone = updates.phone;
  if (updates.dateAdded !== undefined) patch.date_added = updates.dateAdded;
  if (updates.priority !== undefined) patch.priority = updates.priority;
  if (updates.notes !== undefined) patch.notes = updates.notes;
  if (updates.nextStep !== undefined) patch.next_step = updates.nextStep;
  if (updates.currentStage !== undefined) patch.current_stage = updates.currentStage;
  if (updates.status !== undefined) patch.status = updates.status;

  if (updates.assignedTo !== undefined) {
    patch.assigned_team_member_id = findLookupId(
      lookups.teamMembers,
      updates.assignedTo,
      "Team member",
    );
  }

  if (updates.leadSource !== undefined) {
    patch.lead_source_id = findLookupId(lookups.leadSources, updates.leadSource, "Lead source");
  }

  if (stageChanged) {
    patch.stage_updated_at = new Date().toISOString();
    if (updates.status === undefined) {
      patch.status = defaultStatusForColumn(nextStage, columns);
    }
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from("clients").update(patch).eq("id", client.id);
    throwOnError(error);
  }

  if (updates.mandateTypes !== undefined) {
    const mandateRows = updates.mandateTypes.map((type, index) => ({
      client_id: client.id,
      mandate_type_id: findLookupId(lookups.mandateTypes, type, "Mandate type"),
      sort_order: index,
    }));

    const { error: deleteError } = await supabase
      .from("client_mandates")
      .delete()
      .eq("client_id", client.id);
    throwOnError(deleteError);

    if (mandateRows.length > 0) {
      const { error: insertError } = await supabase.from("client_mandates").insert(mandateRows);
      throwOnError(insertError);
    }
  }

  if (stageChanged) {
    const { error } = await supabase.from("client_activity").insert({
      client_id: client.id,
      title: "Client details updated",
      detail: `Stage changed to ${getColumnTitle(nextStage, columns)}.`,
      type: "moved",
    });
    throwOnError(error);
  }
}

export async function persistClientMove(
  movedClient: ClientCard,
  nextClients: ClientCard[],
  columns: BoardColumn[],
) {
  const supabase = requireSupabase();
  const stageChanged = movedClient.currentStage !== nextClients.find((item) => item.id === movedClient.id)?.currentStage;
  const movedAfter = nextClients.find((item) => item.id === movedClient.id);
  if (!movedAfter) return;

  const updates = nextClients.map((client, index) => {
    const isMovedClient = client.id === movedClient.id;
    const patch: Record<string, unknown> = {
      position: index,
    };

    if (isMovedClient) {
      patch.current_stage = movedAfter.currentStage;
      patch.status = movedAfter.status;
      patch.stage_updated_at = movedAfter.stageUpdatedAt;
    }

    return supabase.from("clients").update(patch).eq("id", client.id);
  });

  const results = await Promise.all(updates);
  results.forEach((result) => throwOnError(result.error));

  if (stageChanged) {
    const { error } = await supabase.from("client_activity").insert({
      client_id: movedClient.id,
      title: "Stage updated",
      detail: `Moved from ${getColumnTitle(movedClient.currentStage, columns)} to ${getColumnTitle(
        movedAfter.currentStage,
        columns,
      )}.`,
      type: "moved",
    });
    throwOnError(error);
  }
}

export async function toggleChecklistItemRecord(client: ClientCard, item: ChecklistItem) {
  const supabase = requireSupabase();
  const nextCompleted = !item.completed;

  const { error: updateError } = await supabase
    .from("client_checklist_items")
    .update({ completed: nextCompleted })
    .eq("id", item.id);
  throwOnError(updateError);

  const { error: activityError } = await supabase.from("client_activity").insert({
    client_id: client.id,
    title: nextCompleted ? "Checklist item completed" : "Checklist item reopened",
    detail: item.label,
    type: "checklist",
  });
  throwOnError(activityError);
}

export async function updateChecklistItemRecord(itemId: string, label: string) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("client_checklist_items")
    .update({ label })
    .eq("id", itemId);
  throwOnError(error);
}

export async function addChecklistItemRecord(client: ClientCard, label: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("client_checklist_items").insert({
    client_id: client.id,
    label,
    completed: false,
    sort_order: client.checklist.length,
  });
  throwOnError(error);
}

export async function removeChecklistItemRecord(itemId: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("client_checklist_items").delete().eq("id", itemId);
  throwOnError(error);
}
