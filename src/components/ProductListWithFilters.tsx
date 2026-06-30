"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type Props = {
  products: Product[];
  categorySlug: string;
};

export default function ProductListWithFilters({ products, categorySlug }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc

  // Context-aware filter options based on category
  const filterOptions = useMemo(() => {
    switch (categorySlug) {
      case "vazrozhdenci":
        return [
          { value: "all", label: "Всички" },
          { value: "artists", label: "Художници" },
          { value: "revolutionaries", label: "Възрожденци" },
          { value: "tsars", label: "Царе" },
        ];
      case "print-on-demand":
        return [
          { value: "all", label: "Всички" },
          { value: "thrash", label: "Траш Метъл" },
          { value: "gothic", label: "Готик Метъл" },
          { value: "death", label: "Дед Метъл" },
          { value: "power", label: "Пауър Метъл" },
          { value: "custom", label: "Custom Дизайн" },
        ];
      case "broderii":
        return [
          { value: "all", label: "Всички" },
          { value: "tshirts", label: "Тениски" },
          { value: "sweatshirts", label: "Суитшърти" },
          { value: "caps", label: "Шапки" },
        ];
      case "3d-printeri":
        return [
          { value: "all", label: "Всички" },
          { value: "ready", label: "Готови Модели" },
          { value: "custom", label: "Custom Проект" },
        ];
      default:
        return [{ value: "all", label: "Всички" }];
    }
  }, [categorySlug]);

  // Determine if product matches selected sub-genre/sub-category filter
  const matchesSubFilter = (product: Product, filter: string) => {
    if (filter === "all") return true;

    if (categorySlug === "vazrozhdenci") {
      const slug = product.slug.toLowerCase();
      if (filter === "artists") return slug.includes("zograf") || slug.includes("maistora");
      if (filter === "revolutionaries") return slug.includes("levski") || slug.includes("botev") || slug.includes("vazov");
      if (filter === "tsars") return slug.includes("car");
    }

    if (categorySlug === "print-on-demand") {
      const slug = product.slug.toLowerCase();
      if (filter === "thrash") return slug.includes("thrash") || slug.includes("classic");
      if (filter === "gothic") return slug.includes("gothic") || slug.includes("doom");
      if (filter === "death") return slug.includes("death") || slug.includes("brutal");
      if (filter === "power") return slug.includes("power") || slug.includes("heavy");
      if (filter === "custom") return !!product.isCustomRequest;
    }

    if (categorySlug === "broderii") {
      const name = product.name.toLowerCase();
      if (filter === "tshirts") return name.includes("тениска");
      if (filter === "sweatshirts") return name.includes("суитшърт");
      if (filter === "caps") return name.includes("шапка");
    }

    if (categorySlug === "3d-printeri") {
      if (filter === "ready") return !product.isCustomRequest;
      if (filter === "custom") return !!product.isCustomRequest;
    }

    return true;
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // 2. Subgroup Category Filter
    result = result.filter((p) => matchesSubFilter(p, activeFilter));

    // 3. Price Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        // Keep custom requests (price 0) at the bottom or top? Let's sort them.
        if (a.isCustomRequest) return 1;
        if (b.isCustomRequest) return -1;
        return a.price - b.price;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        if (a.isCustomRequest) return 1;
        if (b.isCustomRequest) return -1;
        return b.price - a.price;
      });
    }

    return result;
  }, [products, searchQuery, activeFilter, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 rounded-sm border border-ink-line bg-ink-card p-5 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Търси модел..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-bone-dim/60" />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={16} className="text-ember" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input min-w-[200px] py-2.5"
          >
            <option value="default">Подразбиране</option>
            <option value="price-asc">Цена: Ниска към Висока</option>
            <option value="price-desc">Цена: Висока към Ниска</option>
          </select>
        </div>

      </div>

      {/* Filter Chips */}
      {filterOptions.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActiveFilter(opt.value)}
              className={`rounded-sm border px-4 py-2 font-head text-xs uppercase tracking-wider transition-all duration-200 ${
                activeFilter === opt.value
                  ? "border-ember bg-ember text-bone"
                  : "border-ink-line bg-ink-soft text-bone-dim hover:border-ember hover:text-ember"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-ink-line p-16 text-center">
          <SlidersHorizontal size={36} className="text-bone-dim/40 mb-3" />
          <h3 className="font-display text-xl text-bone">Няма намерени продукти</h3>
          <p className="mt-1 text-bone-dim max-w-md">
            Опитайте да изчистите търсенето или изберете друг филтър.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
              setSortBy("default");
            }}
            className="mt-4 font-head text-xs uppercase tracking-wider text-ember hover:text-spark"
          >
            Изчисти филтрите
          </button>
        </div>
      )}
    </div>
  );
}
