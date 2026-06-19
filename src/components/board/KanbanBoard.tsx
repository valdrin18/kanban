import {
  type CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
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
import { ClientCard, ClientCardOverlay } from "../cards/ClientCard";
import { KanbanColumn } from "./KanbanColumn";

interface DragPreview {
  activeId: string;
  targetStage: ColumnId;
  targetIndex: number;
}

function getIntersectionArea(
  entry: { top: number; left: number; width: number; height: number },
  target: { top: number; left: number; width: number; height: number },
) {
  const top = Math.max(target.top, entry.top);
  const left = Math.max(target.left, entry.left);
  const right = Math.min(target.left + target.width, entry.left + entry.width);
  const bottom = Math.min(target.top + target.height, entry.top + entry.height);

  return Math.max(0, right - left) * Math.max(0, bottom - top);
}

export function KanbanBoard() {
  const clients = useFilteredClients();
  const moveClient = useBoardStore((state) => state.moveClient);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
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
        accumulator[column.id] = clients.filter(
          (client) => client.currentStage === column.id && client.id !== activeClientId,
        );
        return accumulator;
      },
      {} as Record<ColumnId, typeof clients>,
    );
  }, [activeClientId, clients]);

  const activeClient = clients.find((client) => client.id === activeClientId);

  const columnAwareCollisionDetection = useMemo<CollisionDetection>(
    () =>
      ({ active, collisionRect, droppableContainers, droppableRects }) => {
        const columnCollisions = boardColumns
          .map((column) => {
            const rect = droppableRects.get(column.id);
            if (!rect) return null;

            return {
              id: column.id,
              area: getIntersectionArea(rect, collisionRect),
              centerDistance: Math.abs(
                rect.left + rect.width / 2 - (collisionRect.left + collisionRect.width / 2),
              ),
            };
          })
          .filter((collision): collision is { id: ColumnId; area: number; centerDistance: number } =>
            Boolean(collision),
          )
          .sort((a, b) => {
            if (b.area !== a.area) return b.area - a.area;
            return a.centerDistance - b.centerDistance;
          });

        const targetColumn =
          columnCollisions.find((collision) => collision.area > 0) ?? columnCollisions[0];

        if (!targetColumn) return [];

        const activeId = String(active.id);
        const targetClients = clientsByColumn[targetColumn.id].filter(
          (client) => client.id !== activeId,
        );
        const collisionMiddleY = collisionRect.top + collisionRect.height / 2;
        const targetCard = targetClients.find((client) => {
          const rect = droppableRects.get(client.id);
          if (!rect) return false;
          return collisionMiddleY < rect.top + rect.height / 2;
        });
        const targetId = targetCard?.id ?? targetColumn.id;
        const targetContainer = droppableContainers.find((container) => container.id === targetId);
        const fallbackContainer = droppableContainers.find(
          (container) => container.id === targetColumn.id,
        );
        const droppableContainer = targetContainer ?? fallbackContainer;

        return droppableContainer
          ? [
              {
                id: targetId,
                data: {
                  droppableContainer,
                  value: targetColumn.area,
                },
              },
            ]
          : [];
      },
    [clientsByColumn],
  );

  function getDragTarget(activeId: string, overId: string) {
    const activeCard = clients.find((client) => client.id === activeId);
    if (!activeCard) return null;

    const overIsColumn = boardColumns.some((column) => column.id === overId);
    if (overIsColumn) {
      const targetStage = overId as ColumnId;
      return {
        targetStage,
        targetIndex: clients.filter(
          (client) => client.currentStage === targetStage && client.id !== activeId,
        ).length,
      };
    }

    const overCard = clients.find((client) => client.id === overId);
    if (!overCard) return null;

    const targetStage = overCard.id === activeId ? activeCard.currentStage : overCard.currentStage;
    const targetCards = clients.filter(
      (client) => client.currentStage === targetStage && client.id !== activeId,
    );
    const targetIndex = targetCards.findIndex((client) => client.id === overCard.id);

    return {
      targetStage,
      targetIndex: targetIndex >= 0 ? targetIndex : targetCards.length,
    };
  }

  function clearDragState() {
    setActiveClientId(null);
    setDragPreview(null);
  }

  function handleDragStart(event: DragStartEvent) {
    const activeId = String(event.active.id);
    const activeCard = clients.find((client) => client.id === activeId);
    if (!activeCard) return;

    const sourceCards = clients.filter((client) => client.currentStage === activeCard.currentStage);
    setActiveClientId(activeId);
    setDragPreview({
      activeId,
      targetStage: activeCard.currentStage,
      targetIndex: sourceCards.findIndex((client) => client.id === activeId),
    });
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const target = getDragTarget(activeId, String(over.id));
    if (!target) return;

    setDragPreview((current) => {
      if (
        current?.activeId === activeId &&
        current.targetStage === target.targetStage &&
        current.targetIndex === target.targetIndex
      ) {
        return current;
      }

      return {
        activeId,
        ...target,
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      clearDragState();
      return;
    }

    const activeId = String(active.id);
    const target = getDragTarget(activeId, String(over.id)) ?? dragPreview;

    if (target) {
      moveClient(activeId, target.targetStage, target.targetIndex);
    }

    clearDragState();
  }

  return (
    <section className="board-dots min-h-[680px] rounded-[2rem] border border-guhr-border/75 p-4 shadow-inner">
      <DndContext
        sensors={sensors}
        collisionDetection={columnAwareCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={clearDragState}
      >
        <div className="scrollbar-soft flex gap-4 overflow-x-auto pb-4">
          {boardColumns.map((column) => (
            <KanbanColumn
              column={column}
              clients={clientsByColumn[column.id]}
              placeholderIndex={
                dragPreview?.targetStage === column.id ? dragPreview.targetIndex : null
              }
              key={column.id}
            />
          ))}
        </div>
        <DragOverlay>
          {activeClient ? <ClientCardOverlay client={activeClient} /> : null}
        </DragOverlay>
      </DndContext>
    </section>
  );
}
