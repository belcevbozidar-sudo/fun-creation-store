import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductDetail from "@/components/ProductDetail";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

export async function generateStaticParams() {
  const allProducts = await convexClient.query(api.products.list);
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await convexClient.query(api.products.getBySlug, { slug });
  if (!product) return {};
  return {
    title: `${product.name} - FUN CREATION`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await convexClient.query(api.products.getBySlug, { slug });
  if (!product) notFound();

  const category = await convexClient.query(api.categories.getBySlug, { slug: product.category });
  const related = await convexClient.query(api.products.getRelated, { slug, category: product.category, limit: 8 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-bone-dim">
        <Link href="/" className="hover:text-ember">
          Начало
        </Link>
        <ChevronRight size={14} />
        <Link href={`/category/${product.category}`} className="hover:text-ember">
          {category?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-bone">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-6 text-2xl text-bone sm:text-3xl">
            Още от {category?.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href={`/category/${product.category}`}
              className="inline-flex items-center gap-2 rounded-sm border border-ink-line px-6 py-3 font-head text-sm uppercase tracking-wider text-bone-dim transition-colors hover:border-ember hover:text-ember"
            >
              Виж всички <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
