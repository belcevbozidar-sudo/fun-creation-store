"use server";

import { cookies, headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

// Helper to check if user is authenticated
export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session_token")?.value;
  if (!token) return false;

  try {
    return await convexClient.query(api.auth.verifySession, { token });
  } catch (err) {
    console.error("Auth verification error:", err);
    return false;
  }
}

// Log in Admin
export async function adminLoginAction(prevState: any, formData: FormData) {
  const headList = await headers();
  // Get IP from header or fallback
  const clientIp = headList.get("x-forwarded-for")?.split(",")[0] || headList.get("x-real-ip") || "127.0.0.1";

  // Check rate limit lockout first
  const lockoutStatus = await convexClient.query(api.auth.checkLockout, { ip: clientIp });
  if (lockoutStatus.locked) {
    const minutesLeft = Math.ceil((lockoutStatus.remainingMs ?? 0) / (60 * 1000));
    return {
      success: false,
      error: `Твърде много неуспешни опити. Устройството е блокирано. Моля, изчакайте още ${minutesLeft} мин.`,
    };
  }

  const password = formData.get("password")?.toString();
  const rememberMe = formData.get("rememberMe") === "on";

  if (!password) {
    return { success: false, error: "Моля, въведете парола." };
  }

  const expectedPassword = process.env.ADMIN_PASSWORD || "KovachAdmin#2026$Secure!FunCreation";

  if (password === expectedPassword) {
    // Reset failed logins
    await convexClient.mutation(api.auth.resetFailedAttempts, { ip: clientIp });

    // Generate secure session token
    const token = crypto.randomUUID();
    
    // Remember me: 100 years. Otherwise: 2 hours.
    const durationMs = rememberMe 
      ? 100 * 365 * 24 * 60 * 60 * 1000 
      : 2 * 60 * 60 * 1000;

    await convexClient.mutation(api.auth.createSession, { token, durationMs });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 100 * 365 * 24 * 60 * 60 : undefined, // cookie expires at browser close if not rememberMe
    });

    return { success: true, error: null };
  } else {
    // Record failed attempt
    const failedStatus = await convexClient.mutation(api.auth.recordFailedAttempt, { ip: clientIp });
    const attemptsLeft = 3 - failedStatus.attempts;

    if (failedStatus.locked) {
      return {
        success: false,
        error: "Твърде много неуспешни опити. Устройството е блокирано за 1 час.",
      };
    }

    return {
      success: false,
      error: `Невалидна парола. Остават ви ${attemptsLeft} опита.`,
    };
  }
}

// Log out Admin
export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session_token")?.value;
  
  if (token) {
    try {
      await convexClient.mutation(api.auth.deleteSession, { token });
    } catch (e) {
      console.error(e);
    }
  }

  cookieStore.delete("admin_session_token");
  return { success: true };
}

// Transliterate Bulgarian Cyrillic to English Latin for slug generation
function slugify(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
    'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sht', 'ъ': 'a', 'ь': 'y', 'ю': 'yu', 'я': 'ya',
    'А': 'a', 'Б': 'b', 'В': 'v', 'Г': 'g', 'Д': 'd', 'Е': 'e', 'Ж': 'zh', 'З': 'z',
    'И': 'i', 'Й': 'y', 'К': 'k', 'Л': 'l', 'М': 'm', 'Н': 'n', 'О': 'o', 'П': 'p',
    'Р': 'r', 'С': 's', 'Т': 't', 'У': 'u', 'Ф': 'f', 'Х': 'h', 'Ц': 'ts', 'Ч': 'ch',
    'Ш': 'sh', 'Щ': 'sht', 'Ъ': 'a', 'Ь': 'y', 'Ю': 'yu', 'Я': 'ya'
  };
  
  const transliterated = text.split('').map(char => cyrillicToLatin[char] || char).join('');
  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/* =========================================================================
   PRODUCTS CRUD ACTIONS
   ========================================================================= */

export async function uploadFileAction(formData: FormData) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Няма прикачен файл." };
  }

  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Файлът е твърде голям (макс. 15MB)." };
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const id = crypto.randomUUID().slice(0, 8).toUpperCase();
    const ext = path.extname(file.name) || "";
    const filename = `${id}${ext}`;
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    
    return { success: true, url: `/uploads/${filename}` };
  } catch (err: any) {
    console.error("File upload error:", err);
    return { success: false, error: "Грешка при запис на файла." };
  }
}

export async function updateProductsOrderAction(orderedIds: string[]) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");

  try {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      await convexClient.mutation(api.products.updateOrder, {
        id: id as Id<"products">,
        orderIndex: i,
      });
    }
    return { success: true };
  } catch (err: any) {
    console.error("Error updating order:", err);
    return { success: false, error: "Грешка при преподреждане." };
  }
}

export async function addProductAction(formData: FormData) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");

  const category = formData.get("category")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const tagline = formData.get("tagline")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const badge = formData.get("badge")?.toString() || undefined;
  const isCustomRequest = formData.get("isCustomRequest") === "on";

  // Auto-generate slug from name
  const slug = slugify(name);

  // New products default to negative timestamp to show at the top by default (newest first)
  const orderIndex = -Date.now();

  const detailsRaw = formData.get("details")?.toString() || "";
  const details = detailsRaw.split("\n").map(d => d.trim()).filter(Boolean);

  const galleryRaw = formData.get("gallery")?.toString() || "[]";
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(galleryRaw);
  } catch {
    gallery = [];
  }
  
  const image = gallery[0] || "/images/products/placeholder.png";
  if (gallery.length === 0) gallery.push(image);

  // Parse variants (JSON representation from client)
  const variantsRaw = formData.get("variants")?.toString() || "[]";
  let variants = [];
  try {
    variants = JSON.parse(variantsRaw);
  } catch {
    variants = [];
  }

  await convexClient.mutation(api.products.add, {
    slug,
    category,
    name,
    tagline,
    description,
    details,
    price,
    image,
    gallery,
    variants,
    badge: badge || undefined,
    isCustomRequest,
    orderIndex,
  });

  return { success: true };
}

export async function updateProductAction(id: string, formData: FormData) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");

  const category = formData.get("category")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const tagline = formData.get("tagline")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = parseFloat(formData.get("price")?.toString() || "0");
  const badge = formData.get("badge")?.toString() || undefined;
  const isCustomRequest = formData.get("isCustomRequest") === "on";
  
  // Preserved orderIndex
  const orderIndex = parseInt(formData.get("orderIndex")?.toString() || "0") || -Date.now();

  // Auto-generate slug from name on edits to keep it in sync with potential name changes
  const slug = slugify(name);

  const detailsRaw = formData.get("details")?.toString() || "";
  const details = detailsRaw.split("\n").map(d => d.trim()).filter(Boolean);

  const galleryRaw = formData.get("gallery")?.toString() || "[]";
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(galleryRaw);
  } catch {
    gallery = [];
  }
  
  const image = gallery[0] || "/images/products/placeholder.png";
  if (gallery.length === 0) gallery.push(image);

  const variantsRaw = formData.get("variants")?.toString() || "[]";
  let variants = [];
  try {
    variants = JSON.parse(variantsRaw);
  } catch {
    variants = [];
  }

  await convexClient.mutation(api.products.update, {
    id: id as Id<"products">,
    slug,
    category,
    name,
    tagline,
    description,
    details,
    price,
    image,
    gallery,
    variants,
    badge: badge || undefined,
    isCustomRequest,
    orderIndex,
  });

  return { success: true };
}

export async function deleteProductAction(id: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.products.softDelete, { id: id as Id<"products"> });
  return { success: true };
}

/* =========================================================================
   CATEGORIES CRUD ACTIONS
   ========================================================================= */

export async function addCategoryAction(formData: FormData) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");

  const slug = formData.get("slug")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const shortName = formData.get("shortName")?.toString() || "";
  const tagline = formData.get("tagline")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const image = formData.get("image")?.toString() || "";
  const customOrderHref = formData.get("customOrderHref")?.toString() || undefined;
  const customOrderLabel = formData.get("customOrderLabel")?.toString() || undefined;

  await convexClient.mutation(api.categories.add, {
    slug,
    name,
    shortName,
    tagline,
    description,
    image,
    customOrderHref: customOrderHref || undefined,
    customOrderLabel: customOrderLabel || undefined,
  });

  return { success: true };
}

export async function updateCategoryAction(id: string, formData: FormData) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");

  const slug = formData.get("slug")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const shortName = formData.get("shortName")?.toString() || "";
  const tagline = formData.get("tagline")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const image = formData.get("image")?.toString() || "";
  const customOrderHref = formData.get("customOrderHref")?.toString() || undefined;
  const customOrderLabel = formData.get("customOrderLabel")?.toString() || undefined;

  await convexClient.mutation(api.categories.update, {
    id: id as Id<"categories">,
    slug,
    name,
    shortName,
    tagline,
    description,
    image,
    customOrderHref: customOrderHref || undefined,
    customOrderLabel: customOrderLabel || undefined,
  });

  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.categories.softDelete, { id: id as Id<"categories"> });
  return { success: true };
}

/* =========================================================================
   ORDER AND MESSAGE ACTIONS
   ========================================================================= */

export async function updateOrderStatusAction(id: string, status: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.orders.updateStatus, { id: id as Id<"orders">, status });
  return { success: true };
}

export async function deleteOrderAction(id: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.orders.softDelete, { id: id as Id<"orders"> });
  return { success: true };
}

export async function updateCustomOrderStatusAction(id: string, status: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.custom_orders.updateStatus, { id: id as Id<"custom_orders">, status });
  return { success: true };
}

export async function deleteCustomOrderAction(id: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.custom_orders.softDelete, { id: id as Id<"custom_orders"> });
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  if (!(await checkAdminAuth())) throw new Error("Unauthorized");
  await convexClient.mutation(api.contact_messages.softDelete, { id: id as Id<"contact_messages"> });
  return { success: true };
}
