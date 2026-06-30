import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all non-deleted categories
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();
  },
});

// Get a category by its slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const category = await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!category || category.deleted) return null;
    return category;
  },
});

// Create a new category
export const add = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    shortName: v.string(),
    tagline: v.string(),
    description: v.string(),
    image: v.string(),
    customOrderHref: v.optional(v.string()),
    customOrderLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      ...args,
      deleted: false,
    });
  },
});

// Update an existing category
export const update = mutation({
  args: {
    id: v.id("categories"),
    slug: v.string(),
    name: v.string(),
    shortName: v.string(),
    tagline: v.string(),
    description: v.string(),
    image: v.string(),
    customOrderHref: v.optional(v.string()),
    customOrderLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Soft delete a category
export const softDelete = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deleted: true });
  },
});
