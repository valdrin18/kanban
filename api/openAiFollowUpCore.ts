interface FollowUpRequestPayload {
  clientName?: string;
  mandateTypes?: string[];
  assignedTo?: string;
  leadSource?: string;
  currentStage?: string;
  currentStageId?: string;
  priority?: string;
  status?: string;
  notes?: string;
  nextStep?: string;
  missingChecklistItems?: string[];
  completedChecklistItems?: string[];
}

interface OpenAiResponseContent {
  type?: string;
  text?: string;
}

interface OpenAiResponseItem {
  content?: OpenAiResponseContent[];
}

interface OpenAiResponseBody {
  output_text?: string;
  output?: OpenAiResponseItem[];
  error?: {
    message?: string;
  };
}

const systemInstructions = `
You draft polished German follow-up emails for Guhr Steuerberatungsgesellschaft mbH, a modern tax advisory firm in Berlin.

Expected output:
- Return only the email draft.
- Start with a single "Subject:" line.
- Write in clear, professional German.
- Keep it concise, warm, and business-focused.
- Use the current onboarding stage, mandate type, missing checklist items, notes, and next step.
- Do not invent documents, facts, deadlines, legal advice, or tax advice.
- If checklist items are missing, mention only the missing items provided.
- If no checklist items are missing, acknowledge that the key documents appear complete and focus on the next stage.
- End with "Mit freundlichen Grüßen" and "Ihr Guhr-Team".
`.trim();

function readEnv(env: Record<string, string | undefined>, key: string) {
  const value = env[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function extractOutputText(data: OpenAiResponseBody) {
  if (typeof data.output_text === "string" && data.output_text.trim().length > 0) {
    return data.output_text.trim();
  }

  const textChunks =
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => typeof text === "string" && text.trim().length > 0) ?? [];

  return textChunks.join("\n").trim();
}

function sanitizePayload(payload: FollowUpRequestPayload) {
  return {
    clientName: payload.clientName ?? "Mandant",
    mandateTypes: payload.mandateTypes ?? [],
    assignedTo: payload.assignedTo ?? "",
    leadSource: payload.leadSource ?? "",
    currentStage: payload.currentStage ?? "",
    currentStageId: payload.currentStageId ?? "",
    priority: payload.priority ?? "",
    status: payload.status ?? "",
    notes: payload.notes ?? "",
    nextStep: payload.nextStep ?? "",
    missingChecklistItems: payload.missingChecklistItems ?? [],
    completedChecklistItems: payload.completedChecklistItems ?? [],
  };
}

function shouldLogAiDebug(env: Record<string, string | undefined>) {
  if (env.AI_DEBUG_LOGS === "false") return false;
  return env.NODE_ENV !== "production" || env.AI_DEBUG_LOGS === "true";
}

function logAiDebug(
  env: Record<string, string | undefined>,
  label: string,
  details: unknown,
) {
  if (!shouldLogAiDebug(env)) return;

  console.log(`\n[AI follow-up] ${label}`);
  console.dir(details, { depth: null, colors: true });
}

export async function createAiFollowUp(
  payload: FollowUpRequestPayload,
  env: Record<string, string | undefined>,
) {
  const apiKey = readEnv(env, "OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = readEnv(env, "OPENAI_MODEL") ?? "gpt-5.5";
  const safePayload = sanitizePayload(payload);
  const requestBody = {
    model,
    instructions: systemInstructions,
    input: JSON.stringify(safePayload, null, 2),
    reasoning: {
      effort: "low",
    },
    text: {
      verbosity: "low",
    },
    store: false,
    max_output_tokens: 700,
  };

  logAiDebug(env, "Sending prompt to OpenAI", {
    model,
    instructions: systemInstructions,
    input: safePayload,
  });

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = (await response.json()) as OpenAiResponseBody;

  if (!response.ok) {
    logAiDebug(env, "OpenAI error response", {
      status: response.status,
      error: data.error?.message ?? "OpenAI request failed",
    });
    throw new Error(data.error?.message ?? "OpenAI request failed");
  }

  const message = extractOutputText(data);

  if (!message) {
    throw new Error("OpenAI returned an empty follow-up draft");
  }

  logAiDebug(env, "Received response from OpenAI", {
    status: response.status,
    message,
  });

  return { message };
}
