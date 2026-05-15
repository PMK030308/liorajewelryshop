/**
 * Generate public/api/products.json from src/data/products.ts.
 *
 * Run:  node scripts/gen-products-api.mjs
 *   or: npm run gen-api
 *
 * Demos the file at http://localhost:5173/api/products.json once `vite` is up.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { build } from 'esbuild';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const entry = join(projectRoot, 'src/data/products.ts');
const outDir = join(projectRoot, 'public/api');
const outFile = join(outDir, 'products.json');

// Bundle products.ts → CommonJS so we can dynamically import in Node.
const tmpOut = join(tmpdir(), `liora-products-${Date.now()}.mjs`);

await build({
  entryPoints: [entry],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: tmpOut,
  logLevel: 'silent',
});

const mod = await import(pathToFileURL(tmpOut).href);
const products = mod.PRODUCTS;

if (!Array.isArray(products)) {
  console.error('❌ Expected PRODUCTS to be an array');
  process.exit(1);
}

const payload = {
  meta: {
    total: products.length,
    generatedAt: new Date().toISOString(),
    currency: 'VND',
    note: 'Demo data — images from Unsplash CDN. Replace before production.',
  },
  data: products,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(payload, null, 2), 'utf8');

console.log(`✓ Wrote ${products.length} products → ${outFile}`);
