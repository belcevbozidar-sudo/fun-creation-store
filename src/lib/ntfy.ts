import { Buffer } from "buffer";

// Helper to base64 encode headers containing non-ASCII (e.g. Bulgarian Cyrillic) characters
function encodeHeaderValue(value: string): string {
  if (/^[\x00-\x7F]*$/.test(value)) {
    return value;
  }
  const base64 = Buffer.from(value, "utf-8").toString("base64");
  return `=?utf-8?B?${base64}?=`;
}

export async function sendNtfyNotification(
  title: string,
  message: string,
  options?: { tags?: string; priority?: string; click?: string }
) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("Ntfy topic is not defined in environment variables. Skipping notification.");
    return;
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
    };

    if (title) {
      headers["Title"] = encodeHeaderValue(title);
    }
    if (options?.tags) {
      headers["Tags"] = options.tags;
    }
    if (options?.priority) {
      headers["Priority"] = options.priority;
    }
    if (options?.click) {
      headers["Click"] = options.click;
    }

    const res = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      body: message,
      headers,
    });

    if (!res.ok) {
      console.error(`Failed to send ntfy notification. Status: ${res.status}`);
    }
  } catch (err) {
    console.error("Error sending ntfy notification:", err);
  }
}
