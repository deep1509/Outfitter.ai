import { describe, it, expect } from 'vitest';
import { resolveVariant } from '../../packages/agents/outfit-agent.js';

describe('resolveVariant', () => {
  it('selects matching variant', () => {
    const product = {
      options: [{ name: 'Color' }, { name: 'Size' }],
      variants: [
        { id: '1', option1: 'Red', option2: 'M', available: true },
        { id: '2', option1: 'Blue', option2: 'L', available: true },
      ],
    };
    const res = resolveVariant(product, { Color: 'Red', Size: 'M' });
    expect(res.variantId).toBe('1');
  });
});
