import { planFromPrompt, suggestOutfits } from '../../../../packages/agents/outfit-agent.js';
import { z } from 'zod';

const schema = z.object({ prompt: z.string(), postcode: z.string().optional() });

export async function POST(req: Request) {
  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
  }
  const intent = planFromPrompt(parse.data.prompt);
  if (parse.data.postcode) intent.postcode = parse.data.postcode;
  const suggestions = await suggestOutfits(intent);
  return new Response(JSON.stringify({ suggestions }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
