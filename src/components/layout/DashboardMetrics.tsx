import { AlertTriangle, CheckCircle2, FileText, Inbox } from "lucide-react";
import { useMemo } from "react";
import { useBoardStore } from "../../store/useBoardStore";
import { isCurrentMonth } from "../../utils/dates";
import { isFollowUpRecommended } from "../../utils/recommendations";
import { cn } from "../../lib/utils";

const metricShell =
  "relative p-5 transition hover:bg-guhr-background/45";

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
    <section className="grid overflow-hidden rounded-[1.75rem] bg-white/82 shadow-card backdrop-blur sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <article
            className={cn(
              metricShell,
              index % 2 === 1 &&
                "sm:before:absolute sm:before:bottom-6 sm:before:left-0 sm:before:top-6 sm:before:w-px sm:before:bg-guhr-border/75",
              index > 1 &&
                "max-sm:border-t max-sm:border-guhr-border/75 sm:border-t sm:border-guhr-border/75 xl:border-t-0",
              index > 0 &&
                "xl:before:absolute xl:before:bottom-6 xl:before:left-0 xl:before:top-6 xl:before:w-px xl:before:bg-guhr-border/75",
            )}
            key={metric.label}
          >
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
