import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <CheckCircle2 size={56} className="text-ember" />
      <h1 className="font-display text-3xl text-bone sm:text-4xl">
        Поръчката е приета!
      </h1>
      {id && (
        <p className="font-head text-sm uppercase tracking-wide text-bone-dim">
          Номер на поръчка: <span className="text-spark">#{id}</span>
        </p>
      )}
      <p className="max-w-md text-bone-dim">
        Ще се свържем с теб на посочения телефон или имейл в рамките на 24 часа,
        за да потвърдим детайлите и начина на плащане при доставка.
      </p>
      <Link
        href="/"
        className="mt-3 rounded-sm bg-ember px-6 py-3 font-head text-sm uppercase tracking-wider text-bone hover:bg-ember-dark"
      >
        Назад към магазина
      </Link>
    </div>
  );
}
