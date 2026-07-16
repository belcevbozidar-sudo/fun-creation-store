import Link from "next/link";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { categories } from "@/lib/categories";

function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8h-2a2 2 0 0 0-2 2v3H9v3h3v6h3v-6h2.5l.5-3H15v-2.5a.5.5 0 0 1 .5-.5H16V8Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="spark-line" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/brand/logo-wordmark.png"
              alt="FUN CREATION"
              width={1532}
              height={578}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs text-sm text-bone-dim">
            Тениски, принт он демонд и 3D печат с дух на сцена и искри.
            Произведено в България, за тези, които не вървят по средата.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-head text-sm uppercase tracking-wider text-bone">
            Категории
          </h3>
          <ul className="space-y-2 text-sm text-bone-dim">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-ember">
                  {c.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-head text-sm uppercase tracking-wider text-bone">
            Поръчки по проект
          </h3>
          <ul className="space-y-2 text-sm text-bone-dim">
            <li>
              <Link href="/custom-order/print-on-demand" className="hover:text-ember">
                Custom Принт он Демонд
              </Link>
            </li>
            <li>
              <Link href="/custom-order/3d-printing" className="hover:text-ember">
                Custom 3D Печат
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ember">
                Контакти
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-head text-sm uppercase tracking-wider text-bone">
            Свържи се
          </h3>
          <ul className="space-y-2 text-sm text-bone-dim">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-ember" />
              <a href="tel:+359892342860" className="hover:text-ember">
                +359 89 2342860
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-ember" />
              <a href="mailto:hello@funcreation.bg" className="hover:text-ember">
                hello@funcreation.bg
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink-line text-bone-dim hover:border-ember hover:text-ember"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-line px-4 py-5 text-center text-xs text-bone-dim sm:px-6">
        © {new Date().getFullYear()} FUN CREATION. Всички права запазени.
      </div>
    </footer>
  );
}
