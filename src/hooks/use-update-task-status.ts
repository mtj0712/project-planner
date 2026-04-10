import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel"; // 👀

function useUpdateTaskStatus(projectId: Id<"projects">) {
  return useMutation(api.tasks.updateStatus).withOptimisticUpdate(
    (localStore, args) => {
      const tasks = localStore.getQuery(api.tasks.list, {
        projectId, // 👀
      });

      if (!tasks) {
        return;
      }

      localStore.setQuery(
        api.tasks.list,
        { projectId }, // 👀
        tasks.map((task) =>
          task._id === args.id ? { ...task, status: args.status } : task,
        ),
      );
    },
  );
}

export default useUpdateTaskStatus;
