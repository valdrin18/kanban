import type { ClientCard, ColumnId } from "../types";
import { daysSince } from "./dates";

export const recommendedActions: Record<ColumnId, string> = {
  "new-inquiry": "Qualify inquiry and schedule consultation.",
  "consultation-scheduled": "Prepare consultation notes.",
  "qualified-fit": "Request master data and onboarding documents.",
  "documents-requested": "Check missing documents and send reminder.",
  "documents-review": "Review completeness and assign internal owner.",
  "contract-sent": "Follow up if not signed within 3 days.",
  "signed-active": "Hand over to responsible team.",
  paused: "Clarify blocker or archive if inactive.",
};

const followUpThresholds: Record<ColumnId, number> = {
  "new-inquiry": 2,
  "consultation-scheduled": 5,
  "qualified-fit": 3,
  "documents-requested": 4,
  "documents-review": 6,
  "contract-sent": 3,
  "signed-active": 999,
  paused: 10,
};

export function getRecommendedAction(stage: ColumnId) {
  return recommendedActions[stage];
}

export function isFollowUpRecommended(card: ClientCard) {
  return daysSince(card.stageUpdatedAt) >= followUpThresholds[card.currentStage];
}
