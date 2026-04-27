import sharp from 'sharp';
import path from 'node:path';

const LOGO_PATH = path.resolve('public/j25-logo.svg');
const OUT_DIR = path.resolve('public/icons');
const BG_COLOR = { r: 10, g: 10, b: 10 };

const sizes = [
  { name: 'icon-192.png', size: 192, padding: 24 },
  { name: 'icon-512.png', size: 512, padding: 64 },
  { name: 'apple-touch-icon.png', size: 180, padding: 22 },
];

for (const { name, size, padding } of sizes) {
  const logoWidth = size - padding * 2;
  const logoHeight = Math.round(logoWidth * (56 / 108));

  const logo = await sharp(LOGO_PATH)
    .resize(logoWidth, logoHeight, { fit: 'inside' })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BG_COLOR },
  })
    .composite([
      {
        input: logo,
        top: Math.round((size - logoHeight) / 2),
        left: padding,
      },
    ])
    .png()
    .toFile(path.join(OUT_DIR, name));

  console.log(`Generated ${name} (${size}x${size})`);
}
