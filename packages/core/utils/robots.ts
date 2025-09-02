const allowed = process.env.ALLOWED_SHOPS?.split(',').map((s) => s.trim()) || [];

export function isShopAllowed(host: string): boolean {
  return allowed.includes(host);
}

export async function ensureAllowed(host: string) {
  if (!isShopAllowed(host)) {
    throw new Error(`store ${host} not allowed`);
  }
}
