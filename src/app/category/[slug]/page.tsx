import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ProductListWithFilters from "@/components/ProductListWithFilters";
import { categories } from "@/lib/categories";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../../convex/_generated/api";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await convexClient.query(api.categories.getBySlug, { slug });
  if (!category) return {};
  return {
    title: `${category.name} — FUN CREATION`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await convexClient.query(api.categories.getBySlug, { slug });
  if (!category) notFound();

  const products = await convexClient.query(api.products.getByCategory, { category: slug });

  return (
    <div>
      <section className="relative flex min-h-[42vh] items-center overflow-hidden sm:min-h-[48vh]">
        <Image
          src={category.image}
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <span className="font-head text-xs uppercase tracking-[0.25em] text-spark">
            {category.tagline}
          </span>
          <h1 className="font-display mt-2 text-4xl text-bone sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-bone-dim sm:text-lg">
            {category.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <ProductListWithFilters products={products} categorySlug={slug} />

        {category.customOrderHref && (
          <div className="clip-jagged mt-12 flex flex-col items-start gap-4 bg-ink-card p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <h3 className="font-display text-2xl text-bone sm:text-3xl">
                Не намери точно това, което търсиш?
              </h3>
              <p className="mt-2 max-w-xl text-bone-dim">
                {category.slug === "3d-printeri"
                  ? "Пращаш ни своя 3D модел или описание, ние оценяваме и печатаме по твоите изисквания."
                  : "Пращаш ни лого, идея или скица — ние я превръщаме в готов продукт."}
              </p>
            </div>
            <Link
              href={category.customOrderHref}
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-ember px-5 py-3 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
            >
              {category.customOrderLabel} <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
