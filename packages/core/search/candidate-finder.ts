import { ensureAllowed } from '../utils/robots.js';
import { httpGet } from '../utils/http.js';
import * as cheerio from 'cheerio';
import { ProductSummary } from '../../types/index.js';

export async function candidateFinder({
  store,
  query = '',
  limit = 5
}: {
  store: string;
  category?: string;
  query?: string;
  limit?: number;
}): Promise<ProductSummary[]> {
  await ensureAllowed(store);
  const url = `https://${store}/search?q=${encodeURIComponent(query)}`;
  const html = await httpGet(url, {
    'User-Agent': 'OutfitterBot/1.0 (+https://outfitter.ai)'
  });
  const $ = cheerio.load(html);
  const items: ProductSummary[] = [];
  $('a[href*="/products/"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const match = href.match(/\/products\/([^/?]+)/);
    if (!match) return;
    const handle = match[1];
    const title = $(el).text().trim() || $(el).attr('title') || handle;
    const image = $('img', el).attr('src') || '';
    items.push({
      store,
      handle,
      title,
      url: `https://${store}/products/${handle}`,
      image,
      price: 0,
      currency: 'AUD'
    });
    if (items.length >= limit) return false;
  });
  return items;
}
