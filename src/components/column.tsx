import { useDroppable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import TaskCard from "@/components/task-card";
import type { Doc } from "../../convex/_generated/dataModel";

type ColumnProps = {
  title: string;
  status: string;
  tasks: Doc<"tasks">[];
};

function Column({ title, status, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const borderColor: Record<string, string> = {
    todo: "border-l-blue-500",
    "in-progress": "border-l-amber-500",
    done: "border-l-green-500",
  };

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-l-4 bg-muted/50 p-4 transition-colors ${borderColor[status]} ${isOver ? "bg-muted" : ""}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        <Badge variant="secondary">{tasks.length}</Badge>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No tasks
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
}

export default Column;
