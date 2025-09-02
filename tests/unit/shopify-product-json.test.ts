import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchShopifyProductJson } from '../../packages/core/search/shopify-product-json.js';
import * as http from '../../packages/core/utils/http.js';

beforeEach(() => {
  process.env.ALLOWED_SHOPS = 'allowed.com';
});

describe('fetchShopifyProductJson', () => {
  it('returns product json', async () => {
    vi.spyOn(http, 'httpGet').mockResolvedValueOnce({ title: 'Tee' });
    const data = await fetchShopifyProductJson('allowed.com', 'tee');
    expect(data.title).toBe('Tee');
  });
});
