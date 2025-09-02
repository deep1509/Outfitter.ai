import { describe, it, expect } from 'vitest';
import { buildShopifyCartLink } from '../../packages/core/linker/shopify-cart-link.js';

describe('buildShopifyCartLink', () => {
  it('builds cart url from variants', () => {
    const cart = buildShopifyCartLink('store', [
      { variantId: '1', quantity: 1 },
      { variantId: '2', quantity: 1 },
    ]);
    expect(cart.url).toBe('https://store/cart/1:1,2:1');
  });
});
