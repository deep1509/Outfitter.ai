import { CartLink } from '../../types/index.js';

export function buildGenericDeeplink(url: string): CartLink {
  return { url, items: [] };
}
