import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useQuery } from "convex/react";
import useUpdateTaskStatus from "@/hooks/use-update-task-status";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import Column from "@/components/column";
import TaskCard from "@/components/task-card";
import AddTaskDialog from "@/components/add-task-dialog";

type TaskStatus = "todo" | "in-progress" | "done";

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: "To Do", status: "todo" },
  { title: "In Progress", status: "in-progress" },
  { title: "Done", status: "done" },
];

type KanbanBoardProps = {
  projectId: Id<"projects">;
};

function KanbanBoard({ projectId }: KanbanBoardProps) {
  const tasks = useQuery(api.tasks.list);
  const updateStatus = useUpdateTaskStatus();
  const [activeTask, setActiveTask] = useState<Doc<"tasks"> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks?.find((t) => t._id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as Id<"tasks">;
    const newStatus = over.id as TaskStatus;
    const task = tasks?.find((t) => t._id === taskId);

    if (task && task.status !== newStatus) {
      updateStatus({ id: taskId, status: newStatus });
    }

    setActiveTask(null);
  }

  if (tasks === undefined) {
    return <p className="text-muted-foreground">Loading tasks...</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="mb-6 flex justify-end">
          <AddTaskDialog projectId={projectId} />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <Column
              key={column.status}
              title={column.title}
              status={column.status}
              tasks={tasks.filter((task) => task.status === column.status)}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;
