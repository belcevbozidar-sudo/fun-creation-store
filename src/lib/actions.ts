"use server";

import { promises as fs } from "fs";
import path from "path";
import { convexClient } from "./convex-client";
import { api } from "../../convex/_generated/api";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 15 * 1024 * 1024;

export type OrderItemInput = {
  slug: string;
  name: string;
  price: number;
  qty: number;
  variantLabel: string;
};

export type OrderInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItemInput[];
  total: number;
};

export async function submitOrder(input: OrderInput) {
  if (!input.name?.trim() || !input.phone?.trim() || input.items.length === 0) {
    return { ok: false as const, error: "Моля, попълни име, телефон и количка с продукти." };
  }

  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  
  try {
    await convexClient.mutation(api.orders.create, {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      notes: input.notes,
      items: input.items,
      total: input.total,
      status: "нова",
      createdAt: new Date().toISOString(),
    });
    return { ok: true as const, orderId: id };
  } catch (err: any) {
    console.error("Order submission error:", err);
    return { ok: false as const, error: "Грешка при изпращане на поръчката. Моля опитайте отново." };
  }
}

export async function submitCustomOrder(formData: FormData) {
  const type = formData.get("type")?.toString() ?? "print-on-demand";
  const name = formData.get("name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const file = formData.get("file");

  if (!name || !phone || !description) {
    return { ok: false as const, error: "Моля, попълни име, телефон и описание на поръчката." };
  }

  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  let attachment: string | null = null;

  try {
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return { ok: false as const, error: "Файлът е по-голям от 15MB. Пробвай по-малък файл." };
      }
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const ext = path.extname(file.name) || "";
      attachment = `${id}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(UPLOADS_DIR, attachment), buffer);
    }

    await convexClient.mutation(api.custom_orders.create, {
      id,
      type,
      name,
      phone,
      email,
      description,
      attachment: attachment ?? undefined,
      status: "нова",
      createdAt: new Date().toISOString(),
    });

    return { ok: true as const, requestId: id };
  } catch (err: any) {
    console.error("Custom order submission error:", err);
    return { ok: false as const, error: "Грешка при изпращане на заявката. Моля опитайте отново." };
  }
}

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export async function submitContactMessage(input: ContactInput) {
  if (!input.name?.trim() || !input.message?.trim()) {
    return { ok: false as const, error: "Моля, попълни име и съобщение." };
  }
  
  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  
  try {
    await convexClient.mutation(api.contact_messages.create, {
      id,
      name: input.name,
      email: input.email,
      message: input.message,
      createdAt: new Date().toISOString(),
    });
    return { ok: true as const, messageId: id };
  } catch (err: any) {
    console.error("Contact submission error:", err);
    return { ok: false as const, error: "Грешка при изпращане на съобщението." };
  }
}
