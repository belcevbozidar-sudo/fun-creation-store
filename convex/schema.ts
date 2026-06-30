import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    slug: v.string(),
    name: v.string(),
    shortName: v.string(),
    tagline: v.string(),
    description: v.string(),
    image: v.string(),
    customOrderHref: v.optional(v.string()),
    customOrderLabel: v.optional(v.string()),
    deleted: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  products: defineTable({
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
    deleted: v.optional(v.boolean()),
    orderIndex: v.optional(v.number()), // For custom sorting (Artists -> Revolutionaries -> Tsars)
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  orders: defineTable({
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
    deleted: v.optional(v.boolean()),
  }).index("by_order_id", ["id"]),

  custom_orders: defineTable({
    id: v.string(),
    type: v.string(), // "print-on-demand" | "3d-printing"
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    description: v.string(),
    attachment: v.optional(v.string()),
    status: v.string(),
    createdAt: v.string(),
    deleted: v.optional(v.boolean()),
  }).index("by_custom_order_id", ["id"]),

  contact_messages: defineTable({
    id: v.string(),
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.string(),
    deleted: v.optional(v.boolean()),
  }).index("by_message_id", ["id"]),

  failed_logins: defineTable({
    ip: v.string(),
    attempts: v.number(),
    lockoutUntil: v.number(), // timestamp
  }).index("by_ip", ["ip"]),

  sessions: defineTable({
    token: v.string(),
    expiresAt: v.number(), // timestamp
  }).index("by_token", ["token"]),
});
