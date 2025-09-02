export type ProductSummary = {
  store: string;
  handle: string;
  title: string;
  url: string;
  image: string;
  price: number;
  currency: 'AUD' | 'USD';
};

export type VariantResolution = {
  variantId: string | null;
  inStock: boolean;
  optionsFound: Record<string, string>;
};

export type CartLink = {
  url: string;
  items: { variantId: string; quantity: number }[];
};

export type Suggestion = {
  outfitId: string;
  items: ProductSummary[];
  cartLinks: CartLink[];
  notes?: string;
};
