"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Paperclip } from "lucide-react";
import { submitCustomOrder } from "@/lib/actions";

type Props = {
  type: "print-on-demand" | "3d-printing";
  productOptions: string[];
  descriptionPlaceholder: string;
};

export default function CustomOrderForm({
  type,
  productOptions,
  descriptionPlaceholder,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setPending(true);
    setError(null);

    const formData = new FormData(formRef.current);
    formData.set("type", type);
    const result = await submitCustomOrder(formData);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setRequestId(result.requestId);
    formRef.current.reset();
    setFileName(null);
  }

  if (requestId) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-line bg-ink-card p-8 text-center">
        <CheckCircle2 size={44} className="text-ember" />
        <h3 className="font-display text-2xl text-bone">Заявката е изпратена!</h3>
        <p className="font-head text-sm uppercase tracking-wide text-bone-dim">
          Номер: <span className="text-spark">#{requestId}</span>
        </p>
        <p className="max-w-md text-bone-dim">
          Ще се свържем с теб до 1-2 работни дни с оферта и мокъп за одобрение.
        </p>
        <button
          type="button"
          onClick={() => setRequestId(null)}
          className="mt-2 font-head text-sm uppercase tracking-wide text-ember hover:text-spark"
        >
          Изпрати нова заявка
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
            Име и фамилия *
          </span>
          <input name="name" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
            Телефон *
          </span>
          <input name="phone" type="tel" required className="input" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Имейл
        </span>
        <input name="email" type="email" className="input" />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Какво искаш да поръчаш?
        </span>
        <select name="productType" className="input" defaultValue={productOptions[0]}>
          {productOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Описание на поръчката *
        </span>
        <textarea
          name="description"
          required
          rows={5}
          placeholder={descriptionPlaceholder}
          className="input resize-none"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
          Файл — лого, скица, снимка или 3D модел (опционално)
        </span>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-ink-line px-4 py-3 text-sm text-bone-dim hover:border-ember hover:text-ember">
            <Paperclip size={16} />
            {fileName ?? "Избери файл"}
            <input
              type="file"
              name="file"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
      </label>

      {error && <p className="text-sm text-ember">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ember py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {pending ? "Изпращане..." : "Изпрати заявка"}
      </button>
    </form>
  );
}
