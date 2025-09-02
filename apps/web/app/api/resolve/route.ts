import { z } from 'zod';
import { fetchShopifyProductJson } from '../../../../packages/core/search/shopify-product-json.js';
import { parseProductFromHtml } from '../../../../packages/core/search/shopify-html-parser.js';
import { resolveVariant } from '../../../../packages/agents/outfit-agent.js';
import { buildShopifyCartLink } from '../../../../packages/core/linker/shopify-cart-link.js';

const schema = z.object({
  store: z.string(),
  handle: z.string(),
  options: z.record(z.string()),
  quantity: z.number().default(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }
  const { store, handle, options, quantity } = parse.data;
  try {
    const product = await fetchShopifyProductJson(store, handle).catch(() =>
      parseProductFromHtml(store, handle)
    );
    const res = resolveVariant(product, options);
    const cart = res.variantId
      ? buildShopifyCartLink(store, [{ variantId: res.variantId, quantity }])
      : null;
    return new Response(
      JSON.stringify({ variantId: res.variantId, cart }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
