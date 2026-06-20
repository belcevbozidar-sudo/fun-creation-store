import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/lib/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-sm border border-ink-line sm:aspect-[3/4]"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      <div className="relative z-10 flex flex-col gap-2 p-5 sm:p-6">
        <span className="font-head text-xs uppercase tracking-[0.2em] text-spark">
          {category.tagline}
        </span>
        <h3 className="font-display text-2xl text-bone leading-tight sm:text-3xl">
          {category.name}
        </h3>
        <span className="inline-flex items-center gap-1 font-head text-sm uppercase tracking-wide text-bone-dim transition-colors group-hover:text-ember">
          Разгледай <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
