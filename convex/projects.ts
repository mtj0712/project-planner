import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

const CASCADE_DELETE_BATCH_SIZE = 100;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const get = query({
  args: { 
    id: v.id("projects") 
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
    });
    return projectId;
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: { name?: string; description?: string } = {};

    if (args.name !== undefined) {
      patch.name = args.name;
    }

    if (args.description !== undefined) {
      patch.description = args.description;
    }

    if (Object.keys(patch).length === 0) {
      throw new Error("No fields provided to update");
    }

    await ctx.db.patch("projects", args.id, patch);
  },
});

export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) {
      return;
    }

    await ctx.scheduler.runAfter(0, internal.projects.deleteProjectCascade, {
      id: args.id,
    });
  },
});

export const deleteProjectCascade = internalMutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.id))
      .take(CASCADE_DELETE_BATCH_SIZE);

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    if (tasks.length === CASCADE_DELETE_BATCH_SIZE) {
      await ctx.scheduler.runAfter(0, internal.projects.deleteProjectCascade, {
        id: args.id,
      });
      return;
    }

    await ctx.db.delete(args.id);
  },
});
