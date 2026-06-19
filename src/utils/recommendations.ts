import type { ClientCard, ColumnId } from "../types";
import { daysSince } from "./dates";

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

export function isFollowUpRecommended(card: ClientCard) {
  return daysSince(card.stageUpdatedAt) >= followUpThresholds[card.currentStage];
}
