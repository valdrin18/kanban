import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  Clock3,
  GripVertical,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { getStatusMeta } from "../../data/board";
import {
  t,
  translateKnownText,
  translateMandateType,
  translatePriority,
  translateRecommendedAction,
  translateStatusLabel,
} from "../../lib/i18n";
import { cn } from "../../lib/utils";
import { useBoardStore } from "../../store/useBoardStore";
import { useLanguageStore } from "../../store/useLanguageStore";
import type { ClientCard as ClientCardType } from "../../types";
import { daysSince, formatShortDate } from "../../utils/dates";
import { isFollowUpRecommended } from "../../utils/recommendations";
import { Badge } from "../ui/Badge";

interface ClientCardProps {
  client: ClientCardType;
}

export function ClientCard({ client }: ClientCardProps) {
  const language = useLanguageStore((state) => state.language);
  const openClient = useBoardStore((state) => state.openClient);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: client.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      className="mt-0.5 touch-none rounded-xl p-1.5 text-guhr-muted opacity-70 transition hover:bg-guhr-background hover:text-guhr-text group-hover:opacity-100"
      aria-label={`${t(language, "card.drag")} ${client.name}`}
      onClick={(event) => event.stopPropagation()}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );

  return (
    <ClientCardArticle
      client={client}
      dragHandle={dragHandle}
      isDragging={isDragging}
      onClick={() => openClient(client.id)}
      setNodeRef={setNodeRef}
      style={style}
    />
  );
}

interface ClientCardOverlayProps {
  client: ClientCardType;
}

export function ClientCardOverlay({ client }: ClientCardOverlayProps) {
  return (
    <ClientCardArticle
      client={client}
      dragHandle={
        <span className="mt-0.5 rounded-xl p-1.5 text-guhr-muted">
          <GripVertical className="h-4 w-4" />
        </span>
      }
      isOverlay
    />
  );
}

interface ClientCardArticleProps {
  client: ClientCardType;
  dragHandle: ReactNode;
  isDragging?: boolean;
  isOverlay?: boolean;
  onClick?: () => void;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: CSSProperties;
}

function ClientCardArticle({
  client,
  dragHandle,
  isDragging = false,
  isOverlay = false,
  onClick,
  setNodeRef,
  style,
}: ClientCardArticleProps) {
  const language = useLanguageStore((state) => state.language);
  const statusOptions = useBoardStore((state) => state.statusOptions);
  const status = translateStatusLabel(getStatusMeta(client.status, statusOptions), language);
  const daysInStage = daysSince(client.stageUpdatedAt);
  const needsFollowUp = isFollowUpRecommended(client);

  return (
    <article
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        "group rounded-[1.25rem] border border-guhr-border bg-white/92 p-3.5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-guhr-gold/35 hover:shadow-card sm:rounded-[1.35rem] sm:p-4",
        isDragging && "opacity-0",
        isOverlay && "w-[min(300px,calc(100vw-3rem))] rotate-[1deg] cursor-grabbing opacity-90 shadow-soft",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                status.tone === "green" && "bg-guhr-green",
                status.tone === "orange" && "bg-guhr-orange",
                status.tone === "red" && "bg-guhr-red",
                status.tone === "gray" && "bg-guhr-gray",
                status.tone === "gold" && "bg-guhr-gold",
                status.tone === "neutral" && "bg-guhr-muted",
              )}
            />
            <h3 className="truncate text-[15px] font-semibold tracking-normal text-guhr-text">
              {client.name}
            </h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge tone={status.tone}>{status.label}</Badge>
            <Badge tone={client.priority === "High" ? "orange" : client.priority === "Low" ? "gray" : "neutral"}>
              {translatePriority(client.priority, language)}
            </Badge>
          </div>
        </div>
        {dragHandle}
      </div>

      <div className="mt-3.5 space-y-2.5 text-sm text-guhr-muted sm:mt-4">
        <p className="flex min-w-0 items-center gap-2">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{client.email}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{client.phone}</span>
        </p>
        <p className="flex min-w-0 items-center gap-2">
          <Briefcase className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {client.mandateTypes.map((type) => translateMandateType(type, language)).join(" / ")}
          </span>
        </p>
        <div className="grid grid-cols-1 gap-2 pt-1 text-xs min-[380px]:grid-cols-2">
          <span className="flex min-w-0 items-center gap-1.5 rounded-2xl bg-guhr-background px-2.5 py-2">
            <UserRound className="h-3.5 w-3.5 shrink-0 text-guhr-gold" />
            <span className="truncate">{client.assignedTo}</span>
          </span>
          <span className="flex min-w-0 items-center gap-1.5 rounded-2xl bg-guhr-background px-2.5 py-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-guhr-gold" />
            <span className="truncate">{formatShortDate(client.dateAdded, language)}</span>
          </span>
        </div>
      </div>

      <div className="mt-3.5 rounded-[1.1rem] border border-guhr-border/75 bg-guhr-background/70 p-3 sm:mt-4">
        <p className="line-clamp-2 text-sm leading-5 text-guhr-text">
          {translateKnownText(client.nextStep, language)}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-guhr-muted">
          {translateRecommendedAction(client.currentStage, language)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-guhr-muted">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {daysInStage === 0
            ? t(language, "card.today")
            : language === "de"
              ? `${daysInStage} ${t(language, "card.daysInStage")}`
              : `${daysInStage}${t(language, "card.daysInStage")}`}
        </span>
        {needsFollowUp && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 font-medium text-guhr-red">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t(language, "card.followUp")}
          </span>
        )}
      </div>
    </article>
  );
}
