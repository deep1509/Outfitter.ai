export function joinUrl(...parts: string[]): string {
  return parts
    .map((p) => p.replace(/(^\/|\/$)/g, ''))
    .filter(Boolean)
    .join('/');
}
