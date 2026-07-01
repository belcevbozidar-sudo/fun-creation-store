import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all non-deleted products
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();
  },
});

// Get a single product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product || product.deleted) return null;
    return product;
  },
});

// Get products by category, sorted by orderIndex
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    // Filter out deleted products, then sort by orderIndex ascending
    return products
      .filter((p) => !p.deleted)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  },
});

// Get featured products (those with a badge and not custom request)
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const products = await ctx.db
      .query("products")
      .filter((q) => q.or(q.eq(q.field("deleted"), false), q.eq(q.field("deleted"), undefined)))
      .collect();

    return products
      .filter((p) => !p.isCustomRequest && p.badge && !p.deleted)
      .slice(0, limit);
  },
});

// Get related products in the same category (excluding the current one)
export const getRelated = query({
  args: { slug: v.string(), category: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 4;
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return products
      .filter((p) => p.slug !== args.slug && !p.deleted)
      .slice(0, limit);
  },
});

// Create a product
export const add = mutation({
  args: {
    slug: v.string(),
    category: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    details: v.array(v.string()),
    price: v.number(),
    image: v.string(),
    gallery: v.array(v.string()),
    variants: v.array(
      v.object({
        label: v.string(),
        options: v.array(v.string()),
      })
    ),
    badge: v.optional(v.string()),
    isCustomRequest: v.optional(v.boolean()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      deleted: false,
    });
  },
});

// Update a product
export const update = mutation({
  args: {
    id: v.id("products"),
    slug: v.string(),
    category: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    details: v.array(v.string()),
    price: v.number(),
    image: v.string(),
    gallery: v.array(v.string()),
    variants: v.array(
      v.object({
        label: v.string(),
        options: v.array(v.string()),
      })
    ),
    badge: v.optional(v.string()),
    isCustomRequest: v.optional(v.boolean()),
    orderIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Soft delete a product
export const softDelete = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deleted: true });
  },
});

// Update only the orderIndex of a product
export const updateOrder = mutation({
  args: {
    id: v.id("products"),
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { orderIndex: args.orderIndex });
  },
});
