"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import AddToCartForm from "@/components/AddToCartForm";
import ProductGallery from "@/components/ProductGallery";
import { Product } from "@/lib/types";

const CUSTOM_HREF: Record<string, string> = {
  "print-on-demand": "/custom-order/print-on-demand",
  "3d-printeri": "/custom-order/3d-printing",
};

type Props = {
  product: Product;
};

export default function ProductDetail({ product }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.variants.map((v) => [v.label, v.options[0]]))
  );

  const overrideImage = useMemo(() => {
    for (const variant of product.variants) {
      const hit = variant.optionImages?.find(
        (oi) => oi.option === selected[variant.label]
      );
      if (hit) return hit.image;
    }
    return undefined;
  }, [product.variants, selected]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery
        gallery={product.gallery}
        name={product.name}
        badge={product.badge}
        overrideImage={overrideImage}
      />

      <div className="flex flex-col">
        <h1 className="font-display text-3xl text-bone sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-bone-dim sm:text-lg">{product.tagline}</p>

        <p className="mt-5 font-head text-3xl text-spark">
          {product.isCustomRequest ? "По оферта" : `${product.price.toFixed(2)} €`}
        </p>

        <p className="mt-5 leading-relaxed text-bone-dim">
          {product.description}
        </p>

        <ul className="mt-5 space-y-2">
          {product.details.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-bone-dim">
              <Check size={16} className="mt-0.5 shrink-0 text-ember" />
              {d}
            </li>
          ))}
        </ul>

        <div className="mt-7">
          {product.isCustomRequest ? (
            <Link
              href={CUSTOM_HREF[product.category] ?? "/contact"}
              className="inline-flex items-center gap-2 rounded-sm bg-ember px-6 py-3.5 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
            >
              Поискай оферта <ArrowRight size={16} />
            </Link>
          ) : (
            <AddToCartForm
              product={product}
              selected={selected}
              onSelectedChange={setSelected}
            />
          )}
        </div>
      </div>
    </div>
  );
}
