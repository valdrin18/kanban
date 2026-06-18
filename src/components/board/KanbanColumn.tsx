import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { boardColumns } from "../../data/board";
import { cn } from "../../lib/utils";
import { useBoardStore } from "../../store/useBoardStore";
import type { BoardColumn, ClientCard as ClientCardType } from "../../types";
import { ClientCard } from "../cards/ClientCard";
import { Button } from "../ui/Button";

interface KanbanColumnProps {
  column: BoardColumn;
  clients: ClientCardType[];
}

export function KanbanColumn({ column, clients }: KanbanColumnProps) {
  const openAddClient = useBoardStore((state) => state.openAddClient);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const columnIndex = boardColumns.findIndex((item) => item.id === column.id) + 1;

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex h-full min-h-[620px] w-[318px] shrink-0 flex-col rounded-[1.9rem] border border-guhr-border bg-white/52 p-3 shadow-sm backdrop-blur transition duration-200",
        isOver && "border-guhr-gold/60 bg-white/80 shadow-card",
      )}
    >
      <div className="px-1.5 pb-3 pt-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-guhr-border bg-white text-xs font-semibold text-guhr-muted">
                {columnIndex}
              </span>
              <h2 className="text-sm font-semibold leading-5 tracking-normal text-guhr-text">
                {column.title}
              </h2>
            </div>
            <p className="mt-2 min-h-[2.6rem] text-xs leading-5 text-guhr-muted">
              {column.description}
            </p>
          </div>
          <span className="rounded-full bg-guhr-background px-2.5 py-1 text-xs font-semibold text-guhr-muted">
            {clients.length}
          </span>
        </div>
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
        <div className="scrollbar-soft flex flex-1 flex-col gap-3 overflow-y-auto px-1 pb-1">
          {clients.map((client) => (
            <ClientCard client={client} key={client.id} />
          ))}

          {clients.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-[1.45rem] border border-dashed border-guhr-border bg-white/38 p-5 text-center text-sm leading-6 text-guhr-muted">
              Drop a client here or add a new onboarding card.
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
