/**
 * Script to generate OG image PNG from SVG
 * Run with: node scripts/generate-og-image.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

async function generateOGImage() {
  try {
    const svgPath = join(rootDir, 'public', 'og-image.svg');
    const pngPath = join(rootDir, 'public', 'og-image.png');

    console.log('Reading SVG from:', svgPath);
    const svgBuffer = readFileSync(svgPath);

    console.log('Converting SVG to PNG...');
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png({
        quality: 100,
        compressionLevel: 9,
      })
      .toFile(pngPath);

    console.log('✅ OG image generated successfully at:', pngPath);
    console.log('📊 Dimensions: 1200x630px');
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
