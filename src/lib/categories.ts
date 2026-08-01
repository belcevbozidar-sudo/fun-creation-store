import { Category } from "./types";
import { convexClient } from "./convex-client";
import { api } from "../../convex/_generated/api";

// Categories live in Convex and are managed from the admin panel.
export async function getCategories(): Promise<Category[]> {
  return await convexClient.query(api.categories.list);
}

export async function getCategory(slug: string): Promise<Category | null> {
  return await convexClient.query(api.categories.getBySlug, { slug });
}
