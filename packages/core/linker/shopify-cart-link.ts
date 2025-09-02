import { CartLink } from '../../types/index.js';

export function buildShopifyCartLink(
  store: string,
  lines: { variantId: string; quantity: number }[]
): CartLink {
  if (lines.length === 0) {
    throw new Error('no lines');
  }
  const itemsStr = lines
    .map((l) => `${l.variantId}:${l.quantity}`)
    .join(',');
  return {
    url: `https://${store}/cart/${itemsStr}`,
    items: lines,
  };
}
