import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all non-deleted messages
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contact_messages")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();
  },
});

// Create a contact message
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contact_messages", {
      ...args,
      deleted: false,
    });
  },
});

// Soft delete message
export const softDelete = mutation({
  args: { id: v.id("contact_messages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deleted: true });
  },
});
