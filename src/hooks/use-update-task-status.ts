import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function useUpdateTaskStatus() {
  return useMutation(api.tasks.updateStatus).withOptimisticUpdate(
    (localStore, args) => {
      const tasks = localStore.getQuery(api.tasks.list, {});

      if (!tasks) {
        return;
      }

      localStore.setQuery(
        api.tasks.list,
        {},
        tasks.map((task) =>
          task._id === args.id ? { ...task, status: args.status } : task,
        ),
      );
    },
  );
}

export default useUpdateTaskStatus;
