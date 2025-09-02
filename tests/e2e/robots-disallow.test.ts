import { describe, it, expect, beforeEach } from 'vitest';
import { POST as resolvePOST } from '../../apps/web/app/api/resolve/route.js';

beforeEach(() => {
  process.env.ALLOWED_SHOPS = 'allowed.com';
});

describe('robots disallow', () => {
  it('returns 400 when store not allowed', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store: 'bad.com',
        handle: 'x',
        options: {},
        quantity: 1,
      }),
    });
    const res = await resolvePOST(req);
    expect(res.status).toBe(400);
  });
});
