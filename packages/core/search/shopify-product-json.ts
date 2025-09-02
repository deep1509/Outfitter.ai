import { ensureAllowed } from '../utils/robots.js';
import { httpGet } from '../utils/http.js';

const cache = new Map<string, any>();

export async function fetchShopifyProductJson(store: string, handle: string): Promise<any> {
  await ensureAllowed(store);
  const key = `${store}/${handle}`;
  if (cache.has(key)) return cache.get(key);
  const url = `https://${store}/products/${handle}.js`;
  const data = await httpGet(url, {
    'User-Agent': 'OutfitterBot/1.0 (+https://outfitter.ai)'
  });
  cache.set(key, data);
  return data;
}
