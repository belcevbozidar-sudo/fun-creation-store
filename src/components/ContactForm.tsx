"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContactMessage } from "@/lib/actions";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const result = await submitContactMessage(form);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-line bg-ink-card p-8 text-center">
        <CheckCircle2 size={40} className="text-ember" />
        <h3 className="font-display text-xl text-bone">Съобщението е изпратено!</h3>
        <p className="text-bone-dim">Ще ти отговорим възможно най-скоро.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="font-head text-sm uppercase tracking-wide text-ember hover:text-spark"
        >
          Изпрати ново съобщение
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Име *
        </span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Имейл
        </span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Съобщение *
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="input resize-none"
        />
      </label>
      {error && <p className="text-sm text-ember">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ember py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? "Изпращане..." : "Изпрати съобщение"}
      </button>
    </form>
  );
}
