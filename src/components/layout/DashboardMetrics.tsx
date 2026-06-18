import { AlertTriangle, CheckCircle2, FileText, Inbox } from "lucide-react";
import { useMemo } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import { isCurrentMonth } from "../../utils/dates";
import { isFollowUpRecommended } from "../../utils/recommendations";

const metricShell =
  "rounded-[1.75rem] border border-guhr-border bg-white/82 p-4 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft";

export function DashboardMetrics() {
  const clients = useBoardStore((state) => state.clients);

  const metrics = useMemo(
    () => [
      {
        label: "New inquiries",
        value: clients.filter((client) => client.currentStage === "new-inquiry").length,
        helper: "Open first contacts",
        icon: Inbox,
        tone: "text-guhr-gold bg-guhr-goldSoft",
      },
      {
        label: "Waiting for documents",
        value: clients.filter((client) => client.currentStage === "documents-requested").length,
        helper: "Vollmacht or master data missing",
        icon: FileText,
        tone: "text-guhr-orange bg-orange-50",
      },
      {
        label: "Overdue follow-ups",
        value: clients.filter(isFollowUpRecommended).length,
        helper: "Needs gentle reminder",
        icon: AlertTriangle,
        tone: "text-guhr-red bg-red-50",
      },
      {
        label: "Signed this month",
        value: clients.filter(
          (client) => client.currentStage === "signed-active" && isCurrentMonth(client.stageUpdatedAt),
        ).length,
        helper: "Activated mandates",
        icon: CheckCircle2,
        tone: "text-guhr-green bg-green-50",
      },
    ],
    [clients],
  );

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <article className={metricShell} key={metric.label}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-guhr-muted">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-normal text-guhr-text">
                  {metric.value}
                </p>
              </div>
              <span className={`rounded-2xl p-2.5 ${metric.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-sm text-guhr-muted">{metric.helper}</p>
          </article>
        );
      })}
    </section>
  );
}
