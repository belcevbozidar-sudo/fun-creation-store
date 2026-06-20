import type { Metadata } from "next";
import Image from "next/image";
import CustomOrderForm from "@/components/CustomOrderForm";

export const metadata: Metadata = {
  title: "Custom Принт он Демонд — FUN CREATION",
  description: "Поръчай персонализиран печат на тениска, чаша, шапка или ключодържател.",
};

export default function PodCustomOrderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm border border-ink-line">
            <Image
              src="/images/products/pod-custom-request.png"
              alt="Custom принт он демонд"
              fill
              priority
              className="object-cover"
            />
          </div>
          <h1 className="font-display text-3xl text-bone sm:text-4xl">
            Custom Принт он Демонд
          </h1>
          <p className="mt-3 text-bone-dim">
            Имаш лого на бандата, идея за клубна тениска, чаша или цяла серия
            мърч? Разкажи ни накратко какво искаш — ние правим дигитален мокъп
            за одобрение, преди да тръгне печатът. Без минимално количество за
            повечето артикули.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-bone-dim">
            <li>• Тениски, чаши, шапки, бийни, ключодържатели и още</li>
            <li>• Срок за изпълнение: 5–10 работни дни</li>
            <li>• Плащане при доставка или по банка — без онлайн карта</li>
          </ul>
        </div>

        <div className="rounded-sm border border-ink-line bg-ink-card p-6 sm:p-8">
          <CustomOrderForm
            type="print-on-demand"
            productOptions={[
              "Тениска",
              "Чаша",
              "Шапка с козирка",
              "Бини шапка",
              "Ключодържател",
              "Клубна/бандова колекция",
              "Друго",
            ]}
            descriptionPlaceholder="Напр.: Искам 15 черни тениски с лого на бандата отпред и текст на гърба, размери предимно L и XL..."
          />
        </div>
      </div>
    </div>
  );
}
