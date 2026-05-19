/**
 * Track recently viewed product slugs in localStorage.
 * Most recent first, max 12 items.
 */
const KEY = 'liora_recently_viewed';
const MAX = 12;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function pushRecentlyViewed(slug: string): void {
  if (!slug) return;
  try {
    const cur = getRecentlyViewed().filter(s => s !== slug);
    const next = [slug, ...cur].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {/* ignore */}
}

export function clearRecentlyViewed(): void {
  try { localStorage.removeItem(KEY); } catch {/* ignore */}
}
