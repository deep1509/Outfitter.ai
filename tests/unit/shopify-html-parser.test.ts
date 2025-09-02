import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseProductFromHtml } from '../../packages/core/search/shopify-html-parser.js';
import * as http from '../../packages/core/utils/http.js';

beforeEach(() => {
  process.env.ALLOWED_SHOPS = 'allowed.com';
});

describe('parseProductFromHtml', () => {
  it('parses embedded json', async () => {
    const html = '<html><script id="ProductJson" type="application/json">{"title":"Tee"}</script></html>';
    vi.spyOn(http, 'httpGet').mockResolvedValueOnce(html);
    const data = await parseProductFromHtml('allowed.com', 'tee');
    expect(data.title).toBe('Tee');
  });
});
