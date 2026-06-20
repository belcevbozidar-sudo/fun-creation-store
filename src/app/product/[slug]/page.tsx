import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import AddToCartForm from "@/components/AddToCartForm";
import ProductCard from "@/components/ProductCard";
import { getCategory } from "@/lib/categories";
import { getProduct, getRelatedProducts, products } from "@/lib/products";

const CUSTOM_HREF: Record<string, string> = {
  "print-on-demand": "/custom-order/print-on-demand",
  "3d-printeri": "/custom-order/3d-printing",
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — FUN CREATION`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelatedProducts(slug, product.category, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-bone-dim">
        <Link href="/" className="hover:text-ember">
          Начало
        </Link>
        <ChevronRight size={14} />
        <Link href={`/category/${product.category}`} className="hover:text-ember">
          {category?.shortName}
        </Link>
        <ChevronRight size={14} />
        <span className="text-bone">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-ink-line bg-ink-card">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-sm bg-ember px-2.5 py-1 font-head text-xs uppercase tracking-wider text-bone">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-3xl text-bone sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-bone-dim sm:text-lg">{product.tagline}</p>

          <p className="mt-5 font-head text-3xl text-spark">
            {product.isCustomRequest ? "По оферта" : `${product.price.toFixed(2)} лв`}
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
              <AddToCartForm product={product} />
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl text-bone sm:text-3xl">
            Още от {category?.shortName}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
