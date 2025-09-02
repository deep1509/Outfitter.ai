import { ensureAllowed } from '../utils/robots.js';
import { httpGet } from '../utils/http.js';
import * as cheerio from 'cheerio';

export async function parseProductFromHtml(store: string, handleOrUrl: string) {
  await ensureAllowed(store);
  const url = handleOrUrl.startsWith('http')
    ? handleOrUrl
    : `https://${store}/products/${handleOrUrl}`;
  const html = await httpGet(url, {
    'User-Agent': 'OutfitterBot/1.0 (+https://outfitter.ai)'
  });
  const $ = cheerio.load(html);
  let json: any = null;
  $('script[type="application/json"]').each((_, el) => {
    const id = $(el).attr('id') || '';
    if (/Product/i.test(id)) {
      try {
        json = JSON.parse($(el).text());
      } catch (err) {
        /* ignore */
      }
    }
  });
  if (!json) throw new Error('product json not found');
  return json;
}
