import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type Props = {
  products: Product[];
  categorySlug?: string;
  categories?: { slug: string; name: string }[];
};

export default function ProductListWithFilters({ products }: Props) {
  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-ink-line p-16 text-center">
          <h3 className="font-display text-xl text-bone">Няма намерени продукти</h3>
        </div>
      )}
    </div>
  );
}
