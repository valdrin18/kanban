import { getColumnTitle } from "../data/board";
import { outputLanguageName } from "../lib/i18n";
import type { Language } from "../store/useLanguageStore";
import type { ClientCard } from "../types";

export interface FollowUpRequestPayload {
  clientName: string;
  email: string;
  phone: string;
  mandateTypes: string[];
  assignedTo: string;
  leadSource: string;
  currentStage: string;
  currentStageId: string;
  priority: string;
  status: string;
  notes: string;
  nextStep: string;
  missingChecklistItems: string[];
  completedChecklistItems: string[];
  outputLanguage: string;
}

function buildFollowUpPayload(card: ClientCard, language: Language): FollowUpRequestPayload {
  return {
    clientName: card.name,
    email: card.email,
    phone: card.phone,
    mandateTypes: card.mandateTypes,
    assignedTo: card.assignedTo,
    leadSource: card.leadSource,
    currentStage: getColumnTitle(card.currentStage),
    currentStageId: card.currentStage,
    priority: card.priority,
    status: card.status,
    notes: card.notes,
    nextStep: card.nextStep,
    missingChecklistItems: card.checklist
      .filter((item) => !item.completed)
      .map((item) => item.label),
    completedChecklistItems: card.checklist
      .filter((item) => item.completed)
      .map((item) => item.label),
    outputLanguage: outputLanguageName(language),
  };
}

export async function generateAiFollowUp(card: ClientCard, language: Language) {
  const endpoint = import.meta.env.VITE_AI_FOLLOWUP_ENDPOINT ?? "/api/generate-follow-up";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildFollowUpPayload(card, language)),
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => null)) as { error?: unknown } | null;
    const errorMessage =
      typeof errorData?.error === "string" ? errorData.error : "AI follow-up endpoint unavailable";

    throw new Error(errorMessage);
  }

  const data = (await response.json()) as { message?: unknown };

  if (typeof data.message !== "string" || data.message.trim().length === 0) {
    throw new Error("AI follow-up response was empty");
  }

  return data.message.trim();
}
