"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product } from "@/lib/types";

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const variantKey = useMemo(
    () => product.variants.map((v) => selected[v.label]).join(" / "),
    [product.variants, selected]
  );
  const variantLabel = useMemo(
    () =>
      product.variants
        .map((v) => `${v.label}: ${selected[v.label]}`)
        .join(", "),
    [product.variants, selected]
  );

  function handleAdd() {
    addItem(
      {
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        variantKey: variantKey || "default",
        variantLabel,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="space-y-6">
      {product.variants.map((variant) => (
        <div key={variant.label}>
          <p className="mb-2 font-head text-xs uppercase tracking-wider text-bone-dim">
            {variant.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setSelected((prev) => ({ ...prev, [variant.label]: option }))
                }
                className={`rounded-sm border px-4 py-2 text-sm font-head uppercase tracking-wide transition-colors ${
                  selected[variant.label] === option
                    ? "border-ember bg-ember text-bone"
                    : "border-ink-line text-bone-dim hover:border-ember hover:text-ember"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit items-center gap-3 rounded-sm border border-ink-line px-2 py-1.5">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Намали количеството"
            className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-ember"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-6 text-center font-head text-bone">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Увеличи количеството"
            className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-ember"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-ember py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
        >
          <ShoppingCart size={18} />
          {justAdded ? "Добавено ✓" : "Добави в количката"}
        </button>
      </div>
    </div>
  );
}
