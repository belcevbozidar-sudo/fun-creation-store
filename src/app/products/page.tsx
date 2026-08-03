import type { Metadata } from "next";
import ProductListWithFilters from "@/components/ProductListWithFilters";
import { getCategories } from "@/lib/categories";
import { convexClient } from "@/lib/convex-client";
import { api } from "../../../convex/_generated/api";

export const metadata: Metadata = {
  title: "Всички продукти - FUN CREATION",
  description:
    "Разгледай целия каталог на FUN CREATION - тениски, бродерии, принт он демонд и 3D печат. Филтрирай по категория и намери своя модел.",
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    convexClient.query(api.products.list),
  ]);

  return (
    <div>
      <section className="border-b border-ink-line bg-ink-soft">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
          <span className="font-head text-xs uppercase tracking-[0.25em] text-spark">
            Целият каталог
          </span>
          <h1 className="font-display mt-2 text-4xl text-bone sm:text-5xl">
            Всички продукти
          </h1>
          <p className="mt-4 max-w-2xl text-bone-dim sm:text-lg">
            Разгледай всичко на едно място и филтрирай по категория.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <ProductListWithFilters
          products={products}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </section>
    </div>
  );
}
