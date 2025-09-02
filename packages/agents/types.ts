export type IntentItem = {
  category: 'shirt' | 'pants';
  color?: string;
  size?: string;
};

export type Intent = {
  items: IntentItem[];
  budget?: { total: number; currency: 'AUD' | 'USD' };
  postcode?: string;
  stores: string[];
};
