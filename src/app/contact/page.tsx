import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Контакти — FUN CREATION",
  description: "Свържи се с FUN CREATION за поръчки, въпроси и custom проекти.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl text-bone sm:text-4xl">Контакти</h1>
      <p className="mt-2 max-w-xl text-bone-dim">
        Въпроси за поръчка, custom проект или просто искаш да поговорим за
        рокендрол и 3D печат — пиши ни.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <Phone size={20} className="mt-0.5 text-ember" />
            <div>
              <p className="font-head text-sm uppercase tracking-wide text-bone">Телефон</p>
              <a href="tel:+359892342860" className="text-bone-dim hover:text-ember">
                +359 89 2342860
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={20} className="mt-0.5 text-ember" />
            <div>
              <p className="font-head text-sm uppercase tracking-wide text-bone">Имейл</p>
              <a href="mailto:hello@funcreation.bg" className="text-bone-dim hover:text-ember">
                hello@funcreation.bg
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={20} className="mt-0.5 text-ember" />
            <div>
              <p className="font-head text-sm uppercase tracking-wide text-bone">Работилница</p>
              <p className="text-bone-dim">София, България</p>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-ink-line bg-ink-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
