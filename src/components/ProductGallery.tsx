"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  gallery: string[];
  name: string;
  badge?: string;
};

export default function ProductGallery({ gallery, name, badge }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Safeguard if gallery is empty or undefined
  const images = gallery && gallery.length > 0 ? gallery : ["/images/products/placeholder.png"];
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-ink-line bg-ink-card">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-all duration-300"
        />
        {badge && (
          <span className="absolute left-4 top-4 rounded-sm bg-ember px-2.5 py-1 font-head text-xs uppercase tracking-wider text-bone">
            {badge}
          </span>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {images.map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 overflow-hidden rounded-sm border bg-ink-card transition-all ${
                activeIndex === idx
                  ? "border-ember ring-1 ring-ember"
                  : "border-ink-line hover:border-ember"
              }`}
            >
              <Image
                src={url}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
