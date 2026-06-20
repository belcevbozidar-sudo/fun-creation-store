"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, totalPrice } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-black/70"
        onClick={closeCart}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink-line bg-ink-soft shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-line px-5 py-4">
          <h2 className="font-head text-lg uppercase tracking-wide text-bone">
            Количка
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Затвори количката"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-bone-dim hover:text-ember"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-bone-dim">
            <ShoppingBag size={42} className="text-ink-line" />
            <p>Количката е празна. Време е да я заредиш с метъл.</p>
            <Link
              href="/"
              onClick={closeCart}
              className="font-head text-sm uppercase tracking-wide text-ember hover:text-spark"
            >
              Разгледай продуктите
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.slug}-${item.variantKey}`}
                  className="flex gap-3 border-b border-ink-line pb-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-ink-line bg-ink">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-head text-sm leading-tight text-bone">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug, item.variantKey)}
                        aria-label="Премахни от количката"
                        className="shrink-0 text-bone-dim hover:text-ember"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {item.variantLabel && (
                      <p className="text-xs text-bone-dim">{item.variantLabel}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-sm border border-ink-line">
                        <button
                          type="button"
                          onClick={() =>
                            setQty(item.slug, item.variantKey, item.qty - 1)
                          }
                          aria-label="Намали количеството"
                          className="flex h-7 w-7 items-center justify-center text-bone-dim hover:text-ember"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-5 text-center text-sm text-bone">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQty(item.slug, item.variantKey, item.qty + 1)
                          }
                          aria-label="Увеличи количеството"
                          className="flex h-7 w-7 items-center justify-center text-bone-dim hover:text-ember"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-head text-sm text-spark">
                        {(item.price * item.qty).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-ink-line px-5 py-4 space-y-3">
              <div className="flex items-center justify-between font-head text-base uppercase tracking-wide text-bone">
                <span>Общо</span>
                <span className="text-spark">{totalPrice.toFixed(2)} €</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full rounded-sm bg-ember py-3 text-center font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
              >
                Завърши поръчката
              </Link>
              <p className="text-center text-xs text-bone-dim">
                Без онлайн плащане — потвърждаваме поръчката лично с теб.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
