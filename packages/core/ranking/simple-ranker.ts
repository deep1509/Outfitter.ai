import { Suggestion } from '../../types/index.js';

export function simpleRanker(
  suggestions: Suggestion[],
  limit = 4
): Suggestion[] {
  return suggestions.slice(0, limit);
}
