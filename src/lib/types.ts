export type CategorySlug = "vazrozhdenci" | "print-on-demand" | "broderii" | "3d-printeri";

export type Variant = {
  label: string;
  options: string[];
};

export type Product = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  price: number;
  image: string;
  gallery: string[];
  variants: Variant[];
  badge?: string;
  isCustomRequest?: boolean;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  customOrderHref?: string;
  customOrderLabel?: string;
};
