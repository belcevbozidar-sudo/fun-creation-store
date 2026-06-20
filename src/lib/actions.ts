"use server";

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 15 * 1024 * 1024;

async function appendJSON(file: string, entry: Record<string, unknown>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, file);
  let list: Record<string, unknown>[] = [];
  try {
    list = JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    list = [];
  }
  list.push(entry);
  await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
}

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
  await appendJSON("orders.json", {
    id,
    createdAt: new Date().toISOString(),
    status: "нова",
    ...input,
  });

  return { ok: true as const, orderId: id };
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

  await appendJSON("custom-orders.json", {
    id,
    createdAt: new Date().toISOString(),
    status: "нова",
    type,
    name,
    phone,
    email,
    description,
    attachment,
  });

  return { ok: true as const, requestId: id };
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
  await appendJSON("contact-messages.json", {
    id,
    createdAt: new Date().toISOString(),
    ...input,
  });
  return { ok: true as const, messageId: id };
}
