const store = new Map<string, any>();

export function cacheGet<T>(key: string): T | undefined {
  return store.get(key);
}

export function cacheSet<T>(key: string, value: T) {
  store.set(key, value);
}
