import type { Metadata } from "next";
import Image from "next/image";
import CustomOrderForm from "@/components/CustomOrderForm";

export const metadata: Metadata = {
  title: "Custom 3D Печат — FUN CREATION",
  description: "Поръчай 3D печат по проект — резервна част, прототип или оригинална идея.",
};

export default function ThreeDCustomOrderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm border border-ink-line">
            <Image
              src="/images/products/3d-custom-request.png"
              alt="Custom 3D печат"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="font-display text-3xl text-bone sm:text-4xl">
            Custom 3D Печат по Проект
          </h1>
          <p className="mt-3 text-bone-dim">
            Ако можеш да го нарисуваш или опишеш, можем да го отпечатаме —
            резервна част, прототип, сценичен аксесоар, декорация или изцяло
            оригинална идея. Прикачи готов 3D файл (STL/OBJ) или просто опиши
            какво ти трябва — ние ще го моделираме.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-bone-dim">
            <li>• Материали: PLA, PETG, ABS, TPU и др.</li>
            <li>• Получаваш оферта с цена и срок преди печат</li>
            <li>• Срок за изпълнение: 3–7 работни дни</li>
          </ul>
        </div>

        <div className="rounded-sm border border-ink-line bg-ink-card p-6 sm:p-8">
          <CustomOrderForm
            type="3d-printing"
            productOptions={[
              "Резервна част",
              "Прототип",
              "Декоративна фигура",
              "Сценичен аксесоар",
              "Изцяло нов проект",
              "Друго",
            ]}
            descriptionPlaceholder="Напр.: Трябва ми резервна капачка за педал на барабани, диаметър около 4см, имам снимка на оригинала..."
          />
        </div>
      </div>
    </div>
  );
}
