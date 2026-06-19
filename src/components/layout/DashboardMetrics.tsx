import { AlertTriangle, CheckCircle2, FileText, Inbox } from "lucide-react";
import { useMemo } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import { isCurrentMonth } from "../../utils/dates";
import { isFollowUpRecommended } from "../../utils/recommendations";

const metricShell =
  "rounded-[1.75rem] border border-guhr-border bg-white/82 p-5 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft";

export function DashboardMetrics() {
  const clients = useBoardStore((state) => state.clients);

  const metrics = useMemo(
    () => [
      {
        label: "New inquiries",
        value: clients.filter((client) => client.currentStage === "new-inquiry").length,
        icon: Inbox,
        tone: "text-guhr-gold bg-guhr-goldSoft",
      },
      {
        label: "Waiting for documents",
        value: clients.filter((client) => client.currentStage === "documents-requested").length,
        icon: FileText,
        tone: "text-guhr-orange bg-orange-50",
      },
      {
        label: "Overdue follow-ups",
        value: clients.filter(isFollowUpRecommended).length,
        icon: AlertTriangle,
        tone: "text-guhr-red bg-red-50",
      },
      {
        label: "Signed this month",
        value: clients.filter(
          (client) => client.currentStage === "signed-active" && isCurrentMonth(client.stageUpdatedAt),
        ).length,
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
            <div className="flex items-center gap-5">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${metric.tone}`}>
                <Icon className="h-8 w-8" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-medium leading-6 text-guhr-muted">{metric.label}</p>
                <p className="mt-2 text-5xl font-semibold leading-none tracking-normal text-guhr-text">
                  {metric.value}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
