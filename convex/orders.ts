import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all non-deleted orders
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();
  },
});

// Create a new checkout order
export const create = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    city: v.string(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        price: v.number(),
        qty: v.number(),
        variantLabel: v.string(),
      })
    ),
    total: v.number(),
    status: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      deleted: false,
    });
  },
});

// Update order status
export const updateStatus = mutation({
  args: { id: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Soft delete order
export const softDelete = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deleted: true });
  },
});
