import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { boardColumns } from "../../data/board";
import { useFilteredClients } from "../../hooks/useFilteredClients";
import { useBoardStore } from "../../store/useBoardStore";
import type { ColumnId } from "../../types";
import { ClientCard } from "../cards/ClientCard";
import { KanbanColumn } from "./KanbanColumn";

export function KanbanBoard() {
  const clients = useFilteredClients();
  const moveClient = useBoardStore((state) => state.moveClient);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const clientsByColumn = useMemo(() => {
    return boardColumns.reduce(
      (accumulator, column) => {
        accumulator[column.id] = clients.filter((client) => client.currentStage === column.id);
        return accumulator;
      },
      {} as Record<ColumnId, typeof clients>,
    );
  }, [clients]);

  const activeClient = clients.find((client) => client.id === activeClientId);

  function handleDragStart(event: DragStartEvent) {
    setActiveClientId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveClientId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeCard = clients.find((client) => client.id === activeId);
    if (!activeCard) return;

    const overIsColumn = boardColumns.some((column) => column.id === overId);
    const overCard = clients.find((client) => client.id === overId);
    const targetStage = overIsColumn ? (overId as ColumnId) : overCard?.currentStage;

    if (!targetStage) return;

    const targetCards = clients.filter((client) => client.currentStage === targetStage);
    const overIndex = overIsColumn
      ? targetCards.length
      : Math.max(
          0,
          targetCards.findIndex((client) => client.id === overId),
        );

    moveClient(activeId, targetStage, overIndex);
  }

  return (
    <section className="min-h-[680px]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveClientId(null)}
      >
        <div className="scrollbar-soft flex gap-4 overflow-x-auto pb-4">
          {boardColumns.map((column) => (
            <KanbanColumn
              column={column}
              clients={clientsByColumn[column.id]}
              key={column.id}
            />
          ))}
        </div>
        <DragOverlay>
          {activeClient ? <ClientCard client={activeClient} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
