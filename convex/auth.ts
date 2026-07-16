import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Check if an IP is currently locked out
export const checkLockout = query({
  args: { ip: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("failed_logins")
      .withIndex("by_ip", (q) => q.eq("ip", args.ip))
      .first();

    if (!record) return { locked: false, attempts: 0 };

    const now = Date.now();
    if (record.lockoutUntil > now) {
      return {
        locked: true,
        attempts: record.attempts,
        lockoutUntil: record.lockoutUntil,
        remainingMs: record.lockoutUntil - now,
      };
    }

    // Lockout has expired, return active attempts as 0
    return { locked: false, attempts: 0 };
  },
});

// Record a failed login attempt
export const recordFailedAttempt = mutation({
  args: { ip: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("failed_logins")
      .withIndex("by_ip", (q) => q.eq("ip", args.ip))
      .first();

    const now = Date.now();
    if (!record) {
      await ctx.db.insert("failed_logins", {
        ip: args.ip,
        attempts: 1,
        lockoutUntil: 0,
      });
      return { attempts: 1, locked: false };
    }

    // Reset attempts count if the lockout has expired
    let currentAttempts = record.attempts;
    if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
      currentAttempts = 0;
    }

    const newAttempts = currentAttempts + 1;
    let lockoutUntil = 0;
    let locked = false;

    if (newAttempts >= 3) {
      // 1 hour lockout
      lockoutUntil = now + 60 * 60 * 1000;
      locked = true;
    }

    await ctx.db.patch(record._id, {
      attempts: newAttempts,
      lockoutUntil,
    });

    return { attempts: newAttempts, locked, lockoutUntil };
  },
});

// Reset failed attempts upon successful login
export const resetFailedAttempts = mutation({
  args: { ip: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("failed_logins")
      .withIndex("by_ip", (q) => q.eq("ip", args.ip))
      .first();

    if (record) {
      await ctx.db.patch(record._id, {
        attempts: 0,
        lockoutUntil: 0,
      });
    }
  },
});

// Create a secure session token
export const createSession = mutation({
  args: { token: v.string(), durationMs: v.number() },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + args.durationMs;
    await ctx.db.insert("sessions", {
      token: args.token,
      expiresAt,
    });
  },
});

// Verify if a session is valid
export const verifySession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) return false;

    const isValid = session.expiresAt > Date.now();
    return isValid;
  },
});

// Delete session (logout)
export const deleteSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }
  },
});
