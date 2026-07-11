/**
 * Tách nền ảnh logo phía client — không cần server/API.
 *
 * Nguyên lý: flood-fill từ các pixel ở viền ảnh, so sánh màu "cục bộ" (theo
 * pixel kề đã được đánh dấu là nền) với sai số `tolerance`. Cách này đi theo
 * nền gradient mượt và dừng lại ở cạnh logo. Phù hợp với logo đặt trên nền
 * tương đối đồng nhất (trắng / hồng pastel…).
 *
 * Trả về PNG data URL (có kênh alpha trong suốt).
 */
export async function removeImageBackground(
  src: string,
  tolerance = 32,
): Promise<string> {
  const img = await loadImage(src);
  const { canvas, w, h } = drawToCanvas(img);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas không khả dụng');

  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data; // RGBA Uint8ClampedArray
  const n = w * h;
  const removed = new Uint8Array(n); // 1 = pixel đã bị xoá (trong suốt)

  // 1) Màu trung bình của viền (lấy mẫu 4 cạnh).
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  const sampleBorder = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    rSum += px[i]; gSum += px[i + 1]; bSum += px[i + 2]; count++;
  };
  for (let x = 0; x < w; x++) { sampleBorder(x, 0); sampleBorder(x, h - 1); }
  for (let y = 0; y < h; y++) { sampleBorder(0, y); sampleBorder(w - 1, y); }
  const avgR = rSum / count, avgG = gSum / count, avgB = bSum / count;

  const colorDist = (i: number, r: number, g: number, b: number) => {
    const dr = px[i] - r, dg = px[i + 1] - g, db = px[i + 2] - b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // 2) Hàng đợi flood-fill (dùng con trỏ đầu thay vì shift để nhanh).
  const queue = new Int32Array(n);
  let qHead = 0, qTail = 0;

  const enqueue = (idx: number) => {
    if (removed[idx]) return;
    removed[idx] = 1;
    queue[qTail++] = idx;
  };

  // Seed: các pixel viền có màu gần màu trung bình viền (tránh ăn vào logo chạm mép).
  const seedBorder = (x: number, y: number) => {
    const idx = y * w + x;
    if (removed[idx]) return;
    const i = idx * 4;
    if (colorDist(i, avgR, avgG, avgB) <= tolerance * 1.5) enqueue(idx);
  };
  for (let x = 0; x < w; x++) { seedBorder(x, 0); seedBorder(x, h - 1); }
  for (let y = 0; y < h; y++) { seedBorder(0, y); seedBorder(w - 1, y); }

  // 3) BFS theo sai số cục bộ (theo pixel kề đã là nền) — đi theo gradient.
  while (qHead < qTail) {
    const idx = queue[qHead++];
    const i = idx * 4;
    const r = px[i], g = px[i + 1], b = px[i + 2];
    const x = idx % w, y = (idx / w) | 0;

    const tryNeighbor = (nx: number, ny: number) => {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) return;
      const nIdx = ny * w + nx;
      if (removed[nIdx]) return;
      const ni = nIdx * 4;
      const dr = px[ni] - r, dg = px[ni + 1] - g, db = px[ni + 2] - b;
      if (Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance) enqueue(nIdx);
    };

    tryNeighbor(x - 1, y); tryNeighbor(x + 1, y);
    tryNeighbor(x, y - 1); tryNeighbor(x, y + 1);
  }

  // 4) Xoá hẳn các pixel nền (alpha = 0). Rìa ngoài cùng cũng xoá để bớt nhiễu màu viền.
  for (let idx = 0; idx < n; idx++) {
    if (removed[idx]) px[idx * 4 + 3] = 0;
  }

  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không tải được ảnh (có thể do chéo tên miền).'));
    img.src = src;
  });
}

function drawToCanvas(img: HTMLImageElement) {
  const MAX = 1000; // giới hạn kích thước để xử lý nhanh
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  const scale = Math.min(1, MAX / Math.max(w, h));
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, w, h };
}