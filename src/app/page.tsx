import Link from "next/link";
import Image from "next/image";
import { Flame, Hammer, Printer, ShieldCheck, Truck, Wrench } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/categories";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts(8);

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden sm:min-h-[92vh]">
        <Image
          src="/images/brand/hero.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/40" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
          <p className="font-head mb-3 text-xs uppercase tracking-[0.3em] text-spark animate-flicker sm:text-sm">
            Изковано в България
          </p>
          <h1 className="font-display text-5xl leading-[1.05] text-bone sm:text-6xl lg:text-7xl">
            История.
            <br />
            Дизайн.
            <br />
            <span className="text-ember">Печат.</span>
          </h1>
          <p className="mt-5 max-w-md text-base text-bone-dim sm:text-lg">
            Тениски с Възрожденци, царе и художници, принт он демонд по твоя
            идея и 3D печат без граници. Три свята, една сцена.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/category/vazrozhdenci"
              className="rounded-sm bg-ember px-6 py-3.5 text-center font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
            >
              Разгледай тениските
            </Link>
            <Link
              href="/category/3d-printeri"
              className="rounded-sm border border-bone/30 px-6 py-3.5 text-center font-head text-sm uppercase tracking-wider text-bone transition-colors hover:border-ember hover:text-ember"
            >
              Виж 3D печата
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-head text-xs uppercase tracking-[0.25em] text-ember">
              Три свята
            </span>
            <h2 className="font-display mt-2 text-3xl text-bone sm:text-4xl">
              Избери своята арена
            </h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-head text-xs uppercase tracking-[0.25em] text-ember">
              Топ продукти
            </span>
            <h2 className="font-display mt-2 text-3xl text-bone sm:text-4xl">
              Най-търсеното на сцената
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="border-y border-ink-line bg-ink-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {[
            { icon: Hammer, title: "Изковано в България", desc: "Локално производство и печат" },
            { icon: Truck, title: "Бърза доставка", desc: "До врата в цялата страна" },
            { icon: Wrench, title: "Custom поръчки", desc: "Твоят дизайн, нашето майсторство" },
            { icon: ShieldCheck, title: "Качество без компромис", desc: "Издръжливи материали и печат" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-2">
              <Icon className="text-ember" size={26} />
              <h3 className="font-head text-sm uppercase tracking-wide text-bone">
                {title}
              </h3>
              <p className="text-sm text-bone-dim">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOM ORDER CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="clip-jagged relative flex flex-col justify-between gap-4 overflow-hidden bg-ink-card p-7 sm:p-9">
            <Flame className="text-spark" size={32} />
            <div>
              <h3 className="font-display text-2xl text-bone sm:text-3xl">
                Имаш идея за принт?
              </h3>
              <p className="mt-2 text-bone-dim">
                Чаши, шапки, ключодържатели, тениски за клуб или банда — пращаш
                ни лого или скица, ние я отпечатваме.
              </p>
            </div>
            <Link
              href="/custom-order/print-on-demand"
              className="inline-flex w-fit rounded-sm bg-ember px-5 py-3 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
            >
              Поръчай Custom Принт
            </Link>
          </div>
          <div className="clip-jagged relative flex flex-col justify-between gap-4 overflow-hidden bg-ink-card p-7 sm:p-9">
            <Printer className="text-spark" size={32} />
            <div>
              <h3 className="font-display text-2xl text-bone sm:text-3xl">
                Имаш проект за 3D печат?
              </h3>
              <p className="mt-2 text-bone-dim">
                Резервна част, прототип, сценичен аксесоар или изцяло твоя
                идея — пращаш файл или описание, получаваш оферта.
              </p>
            </div>
            <Link
              href="/custom-order/3d-printing"
              className="inline-flex w-fit rounded-sm bg-ember px-5 py-3 font-head text-sm uppercase tracking-wider text-bone transition-colors hover:bg-ember-dark"
            >
              Поръчай 3D Печат
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
