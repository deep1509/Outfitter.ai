import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../apps/web/app/api/suggest/route.js';
import * as candidate from '../../packages/core/search/candidate-finder.js';
import * as prod from '../../packages/core/search/shopify-product-json.js';

beforeEach(() => {
  process.env.ALLOWED_SHOPS = 'shop.com';
});

describe('suggest endpoint', () => {
  it('returns suggestions with cart links', async () => {
    vi.spyOn(candidate, 'candidateFinder')
      .mockResolvedValueOnce([
        {
          store: 'shop.com',
          handle: 'red-shirt',
          title: 'Red Shirt',
          url: 'https://shop.com/products/red-shirt',
          image: '',
          price: 1000,
          currency: 'AUD',
        },
      ])
      .mockResolvedValueOnce([
        {
          store: 'shop.com',
          handle: 'cargo-pants',
          title: 'Cargo Pants',
          url: 'https://shop.com/products/cargo-pants',
          image: '',
          price: 2000,
          currency: 'AUD',
        },
      ]);

    vi.spyOn(prod, 'fetchShopifyProductJson').mockImplementation(async () => ({
      options: [{ name: 'Color' }, { name: 'Size' }],
      variants: [
        { id: 1, option1: 'Red', option2: 'M', available: true, price: 1000 },
      ],
    }));

    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'red shirt and cargo pants size M' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.suggestions[0].items.length).toBeGreaterThanOrEqual(2);
    expect(data.suggestions[0].cartLinks[0].url).toContain('/cart/');
  });
});
