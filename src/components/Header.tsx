"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import CartDrawer from "@/components/CartDrawer";
import { categories } from "@/lib/categories";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink-line bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
        <div className="spark-line" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/images/brand/logo-wordmark.png"
              alt="FUN CREATION"
              width={1532}
              height={578}
              className="h-9 w-auto sm:h-11 object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 font-head text-sm uppercase tracking-wider text-bone-dim">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="transition-colors hover:text-ember"
              >
                {c.shortName}
              </Link>
            ))}
            <Link href="/contact" className="transition-colors hover:text-ember">
              Контакти
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openCart}
              aria-label="Отвори количката"
              className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-ink-line text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[11px] font-bold text-bone">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-ink-line text-bone transition-colors hover:border-ember hover:text-ember lg:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-ink-line bg-ink-soft px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1 font-head text-base uppercase tracking-wide">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-sm px-2 py-3 text-bone transition-colors hover:bg-ink-card hover:text-ember"
                  >
                    {c.shortName}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-sm px-2 py-3 text-bone transition-colors hover:bg-ink-card hover:text-ember"
                >
                  Контакти
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
