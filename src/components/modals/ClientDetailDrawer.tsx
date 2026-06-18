import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  Phone,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getColumnTitle, getStatusMeta } from "../../data/board";
import { useBoardStore } from "../../store/useBoardStore";
import { formatDate, formatDateTime } from "../../utils/dates";
import { generateFollowUp } from "../../utils/followUp";
import { getRecommendedAction, isFollowUpRecommended } from "../../utils/recommendations";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function ClientDetailDrawer() {
  const selectedClientId = useBoardStore((state) => state.selectedClientId);
  const client = useBoardStore((state) =>
    state.clients.find((item) => item.id === state.selectedClientId),
  );
  const closeClient = useBoardStore((state) => state.closeClient);
  const toggleChecklistItem = useBoardStore((state) => state.toggleChecklistItem);
  const addGeneratedActivity = useBoardStore((state) => state.addGeneratedActivity);
  const [generatedMessage, setGeneratedMessage] = useState("");

  useEffect(() => {
    setGeneratedMessage("");
  }, [selectedClientId]);

  const checklistProgress = useMemo(() => {
    if (!client) return { completed: 0, total: 0, percent: 0 };
    const completed = client.checklist.filter((item) => item.completed).length;
    const total = client.checklist.length;
    return {
      completed,
      total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [client]);

  if (!client) return null;

  const status = getStatusMeta(client.status);
  const needsFollowUp = isFollowUpRecommended(client);

  function handleGenerate() {
    if (!client) return;
    setGeneratedMessage(generateFollowUp(client));
    addGeneratedActivity(client.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-guhr-text/18 backdrop-blur-sm">
      <button
        className="hidden flex-1 cursor-default lg:block"
        aria-label="Close client detail"
        onClick={closeClient}
      />
      <aside className="scrollbar-soft h-full w-full overflow-y-auto border-l border-guhr-border bg-guhr-background shadow-soft sm:max-w-[620px]">
        <div className="sticky top-0 z-10 border-b border-guhr-border bg-guhr-background/92 px-5 py-4 backdrop-blur-2xl sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge tone={status.tone}>{status.label}</Badge>
                <Badge tone={client.priority === "High" ? "orange" : client.priority === "Low" ? "gray" : "neutral"}>
                  {client.priority} priority
                </Badge>
                {needsFollowUp && <Badge tone="red">Follow-up recommended</Badge>}
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-guhr-text">
                {client.name}
              </h2>
              <p className="mt-1 text-sm text-guhr-muted">
                {getColumnTitle(client.currentStage)}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={closeClient} aria-label="Close drawer">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <section className="grid gap-3 sm:grid-cols-2">
            <InfoTile icon={Mail} label="Email" value={client.email} />
            <InfoTile icon={Phone} label="Phone" value={client.phone} />
            <InfoTile icon={Briefcase} label="Mandate" value={client.mandateTypes.join(" / ")} />
            <InfoTile icon={UserRound} label="Assigned" value={client.assignedTo} />
            <InfoTile icon={CalendarDays} label="Date added" value={formatDate(client.dateAdded)} />
            <InfoTile icon={FileText} label="Lead source" value={client.leadSource} />
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="rounded-2xl bg-guhr-goldSoft p-2.5 text-guhr-gold">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-guhr-text">Recommended next action</h3>
                <p className="mt-1 text-sm leading-6 text-guhr-muted">
                  {getRecommendedAction(client.currentStage)}
                </p>
                <div className="mt-3 rounded-[1.1rem] bg-guhr-background px-3 py-2 text-sm leading-6 text-guhr-text">
                  {client.nextStep}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <h3 className="font-semibold text-guhr-text">Notes / next steps</h3>
            <p className="mt-2 text-sm leading-6 text-guhr-muted">{client.notes}</p>
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-guhr-text">Tax onboarding checklist</h3>
                <p className="mt-1 text-sm text-guhr-muted">
                  {checklistProgress.completed} of {checklistProgress.total} completed
                </p>
              </div>
              <span className="rounded-full bg-guhr-background px-3 py-1 text-sm font-semibold text-guhr-muted">
                {checklistProgress.percent}%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-guhr-background">
              <div
                className="h-full rounded-full bg-guhr-gold transition-all"
                style={{ width: `${checklistProgress.percent}%` }}
              />
            </div>
            <div className="mt-4 space-y-2">
              {client.checklist.map((item) => (
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-guhr-border/70 bg-white/68 px-3 py-2.5 text-sm text-guhr-text transition hover:border-guhr-gold/40 hover:bg-white"
                  key={item.id}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(client.id, item.id)}
                    className="h-4 w-4 rounded border-guhr-border accent-guhr-gold"
                  />
                  <span className={item.completed ? "text-guhr-muted line-through" : ""}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-guhr-text">Follow-up generator</h3>
                <p className="mt-1 text-sm leading-6 text-guhr-muted">
                  Creates a deterministic draft based on stage, missing items and next step.
                </p>
              </div>
              <Button variant="primary" onClick={handleGenerate}>
                <Send className="h-4 w-4" />
                Generate Follow-Up
              </Button>
            </div>
            {generatedMessage && (
              <pre className="scrollbar-soft mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-[1.35rem] border border-guhr-border bg-guhr-background p-4 text-sm leading-6 text-guhr-text">
                {generatedMessage}
              </pre>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-guhr-border bg-white/78 p-4 shadow-sm">
            <h3 className="font-semibold text-guhr-text">Activity timeline</h3>
            <div className="mt-4 space-y-3">
              {client.activity.map((activity) => (
                <div className="flex gap-3" key={activity.id}>
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-guhr-background text-guhr-gold">
                    {activity.type === "checklist" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 border-b border-guhr-border/65 pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-guhr-text">{activity.title}</p>
                      <time className="text-xs text-guhr-muted">
                        {formatDateTime(activity.timestamp)}
                      </time>
                    </div>
                    {activity.detail && (
                      <p className="mt-1 text-sm leading-6 text-guhr-muted">{activity.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

interface InfoTileProps {
  icon: typeof Mail;
  label: string;
  value: string;
}

function InfoTile({ icon: Icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-[1.35rem] border border-guhr-border bg-white/78 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="rounded-2xl bg-guhr-background p-2 text-guhr-gold">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-normal text-guhr-muted">{label}</p>
          <p className="mt-1 break-words text-sm font-medium leading-5 text-guhr-text">{value}</p>
        </div>
      </div>
    </div>
  );
}
