import { candidateFinder } from '../core/search/candidate-finder.js';
import { fetchShopifyProductJson } from '../core/search/shopify-product-json.js';
import { parseProductFromHtml } from '../core/search/shopify-html-parser.js';
import { buildShopifyCartLink } from '../core/linker/shopify-cart-link.js';
import { simpleRanker } from '../core/ranking/simple-ranker.js';
import { normalizeColor, normalizeSize } from '../core/utils/normalize.js';
import { ProductSummary, Suggestion, VariantResolution } from '../types/index.js';
import { Intent } from './types.js';

function parseBudget(value?: string) {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  return { total: num * 100, currency: 'AUD' as const };
}

export function planFromPrompt(prompt: string): Intent {
  const sizeMatch = prompt.match(/size\s*(\w+)/i);
  const colorMatch = prompt.match(/(red|blue|green|black|white)/i);
  const budgetMatch = prompt.match(/\$(\d+)/);
  const items: Intent['items'] = [];
  if (/shirt/i.test(prompt)) {
    items.push({ category: 'shirt', color: colorMatch?.[1], size: sizeMatch?.[1] });
  }
  if (/pant/i.test(prompt)) {
    items.push({ category: 'pants', color: colorMatch?.[1], size: sizeMatch?.[1] });
  }
  return {
    items,
    budget: parseBudget(budgetMatch?.[1]),
    stores: process.env.ALLOWED_SHOPS?.split(',').map((s) => s.trim()) || [],
  };
}

export function resolveVariant(product: any, desired: Record<string, string>): VariantResolution {
  const optionNames: string[] = product.options?.map((o: any) => o.name || o) || [];
  const variants = product.variants || [];
  for (const variant of variants) {
    let match = true;
    const found: Record<string, string> = {};
    for (let i = 0; i < optionNames.length; i++) {
      const name = optionNames[i];
      const want = desired[name];
      const value = variant[`option${i + 1}`];
      if (want) {
        const normWant = normalizeColor(want);
        const normVal = normalizeColor(value);
        if (normWant !== normVal && normalizeSize(want) !== normalizeSize(value)) {
          match = false;
          break;
        }
        found[name] = value;
      }
    }
    if (match) {
      return { variantId: String(variant.id), inStock: Boolean(variant.available ?? true), optionsFound: found };
    }
  }
  return { variantId: null, inStock: false, optionsFound: {} };
}

export async function suggestOutfits(intent: Intent): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];
  const store = intent.stores[0];
  const items: ProductSummary[] = [];
  const lines: { variantId: string; quantity: number }[] = [];

  for (const reqItem of intent.items) {
    const candidates = await candidateFinder({ store, query: `${reqItem.color || ''} ${reqItem.category}` });
    const product = candidates[0];
    if (!product) continue;
    const prodJson = await fetchShopifyProductJson(store, product.handle).catch(() =>
      parseProductFromHtml(store, product.handle)
    );
    const resolved = resolveVariant(prodJson, { Color: reqItem.color || '', Size: reqItem.size || '' });
    if (resolved.variantId) {
      lines.push({ variantId: resolved.variantId, quantity: 1 });
    }
    items.push({ ...product, price: prodJson?.variants?.[0]?.price || 0, image: product.image });
  }

  if (items.length) {
    const cartLinks = lines.length ? [buildShopifyCartLink(store, lines)] : [];
    suggestions.push({ outfitId: '1', items, cartLinks });
  }

  return simpleRanker(suggestions, 4);
}
