/**
 * Convert a number to Vietnamese words (đọc số tiền bằng chữ).
 * Supports up to ~9999 tỷ. Returns lowercase string ending in "đồng".
 *
 * Examples:
 *   105        → "một trăm lẻ năm đồng"
 *   1_234_567  → "một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
 *   500_000    → "năm trăm nghìn đồng"
 */
const ONES = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const SCALES = ['', 'nghìn', 'triệu', 'tỷ'];

function readThreeDigits(n: number, leading: boolean): string {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  const parts: string[] = [];

  if (h > 0) {
    parts.push(`${ONES[h]} trăm`);
  } else if (!leading && (t > 0 || u > 0)) {
    parts.push('không trăm');
  }

  if (t > 1) {
    parts.push(`${ONES[t]} mươi`);
    if (u === 1) parts.push('mốt');
    else if (u === 5) parts.push('lăm');
    else if (u > 0) parts.push(ONES[u]);
  } else if (t === 1) {
    parts.push('mười');
    if (u === 5) parts.push('lăm');
    else if (u > 0) parts.push(ONES[u]);
  } else {
    // t === 0
    if (u > 0) {
      if (parts.length > 0) parts.push('lẻ');
      parts.push(ONES[u]);
    }
  }
  return parts.join(' ');
}

export function numberToVietnameseWords(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '';
  if (n === 0) return 'không đồng';

  // Split into groups of 3 digits from the right
  const groups: number[] = [];
  let temp = Math.floor(n);
  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const out: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0 && i > 0) continue;
    const leading = i === groups.length - 1;
    const words = readThreeDigits(g, leading);
    if (words) {
      out.push(words);
      if (i > 0 && SCALES[i]) out.push(SCALES[i]);
    }
  }
  return out.join(' ').replace(/\s+/g, ' ').trim() + ' đồng';
}

/** Capitalize first letter (for invoice display: "Năm trăm nghìn đồng"). */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
