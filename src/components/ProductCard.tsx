import Link from "next/link";
import Image from "next/image";
import { Wrench } from "lucide-react";
import { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card-hover group flex flex-col overflow-hidden rounded-sm border border-ink-line bg-ink-card"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-sm bg-ember px-2 py-1 font-head text-[11px] uppercase tracking-wider text-bone">
            {product.badge}
          </span>
        )}
        {product.isCustomRequest && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-sm bg-spark px-2 py-1 font-head text-[11px] uppercase tracking-wider text-ink">
            <Wrench size={12} /> По поръчка
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-head text-base leading-snug text-bone group-hover:text-ember transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-bone-dim line-clamp-1">{product.tagline}</p>
        <div className="mt-auto pt-2">
          {product.isCustomRequest ? (
            <span className="font-head text-sm uppercase tracking-wide text-spark">
              Поискай оферта →
            </span>
          ) : (
            <span className="font-head text-lg text-spark">
              {product.price.toFixed(2)} лв
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
