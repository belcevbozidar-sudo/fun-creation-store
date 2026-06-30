import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all non-deleted custom orders
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("custom_orders")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();
  },
});

// Create a new custom order
export const create = mutation({
  args: {
    id: v.string(),
    type: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    description: v.string(),
    attachment: v.optional(v.string()),
    status: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("custom_orders", {
      ...args,
      deleted: false,
    });
  },
});

// Update custom order status
export const updateStatus = mutation({
  args: { id: v.id("custom_orders"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Soft delete custom order
export const softDelete = mutation({
  args: { id: v.id("custom_orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deleted: true });
  },
});
