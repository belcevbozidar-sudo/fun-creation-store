import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a short-lived URL the server action can POST a file to
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Resolve a storage ID to its permanent public URL
export const getFileUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
