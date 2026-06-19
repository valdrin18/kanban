import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Fragment } from "react";
import { cn } from "../../lib/utils";
import { useBoardStore } from "../../store/useBoardStore";
import type { BoardColumn, ClientCard as ClientCardType } from "../../types";
import { ClientCard } from "../cards/ClientCard";
import { Button } from "../ui/Button";

interface KanbanColumnProps {
  column: BoardColumn;
  clients: ClientCardType[];
  placeholderIndex?: number | null;
}

export function KanbanColumn({ column, clients, placeholderIndex = null }: KanbanColumnProps) {
  const openAddClient = useBoardStore((state) => state.openAddClient);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const normalizedPlaceholderIndex =
    placeholderIndex === null ? null : Math.min(Math.max(placeholderIndex, 0), clients.length);
  const displayCount = clients.length + (normalizedPlaceholderIndex === null ? 0 : 1);

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-[245px] w-[318px] shrink-0 flex-col self-start rounded-[1.9rem] border border-guhr-border bg-white/58 p-3 shadow-sm backdrop-blur transition duration-200",
        isOver && "border-guhr-gold/60 bg-white/80 shadow-card",
      )}
    >
      <div className="px-1.5 pb-3 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold leading-5 tracking-normal text-guhr-text">
                {column.title}
              </h2>
            </div>
            <p className="mt-2 min-h-[2.6rem] text-xs leading-5 text-guhr-muted">
              {column.description}
            </p>
          </div>
          <span className="rounded-full bg-guhr-background px-2.5 py-1 text-xs font-semibold text-guhr-muted">
            {displayCount}
          </span>
        </div>
        <div className="mt-3 border-t border-dotted border-guhr-border" />
        <Button
          size="sm"
          variant="ghost"
          className="mt-3 w-full justify-center rounded-2xl border border-dashed border-guhr-border bg-white/45"
          onClick={() => openAddClient(column.id)}
        >
          <Plus className="h-4 w-4" />
          Add client
        </Button>
      </div>

      <SortableContext items={clients.map((client) => client.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 px-2 pb-2 pt-4">
          {clients.map((client, index) => (
            <Fragment key={client.id}>
              {normalizedPlaceholderIndex === index && <DropPlaceholder />}
              <ClientCard client={client} />
            </Fragment>
          ))}

          {normalizedPlaceholderIndex === clients.length && <DropPlaceholder />}

          {clients.length === 0 && normalizedPlaceholderIndex === null && (
            <div className="flex min-h-36 items-center justify-center rounded-[1.45rem] border border-dashed border-guhr-border bg-white/38 p-5 text-center text-sm leading-6 text-guhr-muted">
              Drop a client here or add a new onboarding card.
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

function DropPlaceholder() {
  return (
    <div className="min-h-[310px] rounded-[1.35rem] bg-white/70" />
  );
}
