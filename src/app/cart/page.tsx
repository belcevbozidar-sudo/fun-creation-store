"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, setQty, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <ShoppingBag size={48} className="text-ink-line" />
        <h1 className="font-display text-3xl text-bone">Количката е празна</h1>
        <p className="text-bone-dim">Зареди я с тениски, чаши или 3D печатни творения.</p>
        <Link
          href="/"
          className="mt-2 rounded-sm bg-ember px-6 py-3 font-head text-sm uppercase tracking-wider text-bone hover:bg-ember-dark"
        >
          Към магазина
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl text-bone sm:text-4xl">Количка</h1>

      <ul className="mt-8 divide-y divide-ink-line border-y border-ink-line">
        {items.map((item) => (
          <li
            key={`${item.slug}-${item.variantKey}`}
            className="flex gap-4 py-5"
          >
            <Link
              href={`/product/${item.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-ink-line bg-ink-card sm:h-28 sm:w-28"
            >
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-head text-base text-bone hover:text-ember sm:text-lg"
                  >
                    {item.name}
                  </Link>
                  {item.variantLabel && (
                    <p className="mt-0.5 text-sm text-bone-dim">{item.variantLabel}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.slug, item.variantKey)}
                  aria-label="Премахни от количката"
                  className="text-bone-dim hover:text-ember"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 rounded-sm border border-ink-line">
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.variantKey, item.qty - 1)}
                    aria-label="Намали количеството"
                    className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-ember"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-6 text-center text-sm text-bone">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.variantKey, item.qty + 1)}
                    aria-label="Увеличи количеството"
                    className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-ember"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="font-head text-lg text-spark">
                  {(item.price * item.qty).toFixed(2)} лв
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full items-center justify-between font-head text-xl uppercase tracking-wide text-bone sm:w-80">
          <span>Общо</span>
          <span className="text-spark">{totalPrice.toFixed(2)} лв</span>
        </div>
        <Link
          href="/checkout"
          className="w-full rounded-sm bg-ember py-3.5 text-center font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark sm:w-80"
        >
          Завърши поръчката
        </Link>
      </div>
    </div>
  );
}
