import { z } from 'zod';

const schema = z.object({ carrier: z.string(), trackingId: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }
  return new Response(
    JSON.stringify({ status: 'mocked', events: [] }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
