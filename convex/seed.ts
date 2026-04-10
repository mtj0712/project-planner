import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const insertSeedData = internalMutation({
  args: {
    projects: v.array(
      v.object({
        name: v.string(),
        description: v.optional(v.string()),
        tasks: v.array(
          v.object({
            title: v.string(),
            description: v.string(),
            status: v.union(
              v.literal("todo"),
              v.literal("in-progress"),
              v.literal("done"),
            ),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const project of args.projects) {
      const projectId = await ctx.db.insert("projects", {
        name: project.name,
        description: project.description,
      });

      for (const task of project.tasks) {
        await ctx.db.insert("tasks", {
          projectId,
          title: task.title,
          description: task.description,
          status: task.status,
        });
      }
    }
  },
});
