import { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "vazrozhdenci",
    name: "Художници, Възрожденци и Български царе",
    shortName: "Художници, Възрожденци, Царе",
    tagline: "Историята носи се на гръб",
    description:
      "Лимитирана колекция тениски с Левски, Ботев, Вазов и още легенди на Възраждането — изрисувани в графичен, плакатен стил с характер на рок афиш. Памет, която не залязва.",
    image: "/images/brand/category-vazrozhdenci.png",
  },
  {
    slug: "print-on-demand",
    name: "Принт он Демонд",
    shortName: "Принт он Демонд",
    tagline: "Твоят дизайн. Нашият печат.",
    description:
      "Тениски на любими метъл групи с различни мостри, където можеш да избереш лого на любима група или да качиш свой собствен дизайн за печат.",
    image: "/images/brand/category-pod.png",
    customOrderHref: "/custom-order/print-on-demand",
    customOrderLabel: "Поръчай custom дизайн",
  },
  {
    slug: "broderii",
    name: "Бродерии",
    shortName: "Бродерии",
    tagline: "Стил, извезан с игла и конец",
    description:
      "Висококачествени бродерии върху тениски, суитшърти и шапки. Избери от нашите модели или ни изпрати твой собствен дизайн за бродерия.",
    image: "/images/brand/category-broderii.png",
    customOrderHref: "/custom-order/print-on-demand",
    customOrderLabel: "Поръчай custom бродерия",
  },
  {
    slug: "3d-printeri",
    name: "3D Принтери",
    shortName: "3D Печат",
    tagline: "Ако можеш да го нарисуваш, можем да го отпечатаме",
    description:
      "Декорация, аксесоари за сцена, резервни части, прототипи — 3D печатът няма граници. Разгледай готовите модели или ни пратѝ свой проект за индивидуален печат.",
    image: "/images/brand/category-3d.png",
    customOrderHref: "/custom-order/3d-printing",
    customOrderLabel: "Поръчай 3D печат по проект",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
