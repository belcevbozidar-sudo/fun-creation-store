"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { submitOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl text-bone">Количката е празна</h1>
        <p className="text-bone-dim">Добави продукти, преди да продължиш към поръчка.</p>
        <Link
          href="/"
          className="mt-2 rounded-sm bg-ember px-6 py-3 font-head text-sm uppercase tracking-wider text-bone hover:bg-ember-dark"
        >
          Към магазина
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const result = await submitOrder({
      ...form,
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        qty: i.qty,
        variantLabel: i.variantLabel,
      })),
      total: totalPrice,
    });

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    clear();
    router.push(`/order-success?id=${result.orderId}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl text-bone sm:text-4xl">Завършване на поръчка</h1>
      <p className="mt-2 text-bone-dim">
        Без онлайн плащане — въвеждаш данни, ние се свързваме с теб за потвърждение
        и начин на плащане (в брой при доставка / по банка).
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Име и фамилия *">
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Телефон *">
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input"
              />
            </Field>
          </div>

          <Field label="Имейл">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Адрес за доставка">
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Град">
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="input"
              />
            </Field>
          </div>

          <Field label="Бележка към поръчката">
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="input resize-none"
            />
          </Field>

          {error && <p className="text-sm text-ember">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-sm bg-ember py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark disabled:opacity-60"
          >
            {pending ? "Изпращане..." : "Изпрати поръчката"}
          </button>
        </form>

        <div className="space-y-4 rounded-sm border border-ink-line bg-ink-card p-5">
          <h2 className="font-head text-sm uppercase tracking-wide text-bone-dim">
            Резюме на поръчката
          </h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={`${item.slug}-${item.variantKey}`}
                className="flex items-center gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-ink-line bg-ink">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-bone">{item.name}</p>
                  <p className="text-xs text-bone-dim">
                    {item.variantLabel && `${item.variantLabel} · `}x{item.qty}
                  </p>
                </div>
                <span className="font-head text-sm text-spark">
                  {(item.price * item.qty).toFixed(2)} лв
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink-line pt-3 font-head text-lg uppercase tracking-wide text-bone">
            <span>Общо</span>
            <span className="text-spark">{totalPrice.toFixed(2)} лв</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-head text-xs uppercase tracking-wider text-bone-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
