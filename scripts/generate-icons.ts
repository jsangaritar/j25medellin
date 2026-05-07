import path from 'node:path';
import sharp from 'sharp';

const LOGO_PATH = path.resolve('public/j25-logo.svg');
const OUT_DIR = path.resolve('public/icons');
const BG_COLOR = { r: 10, g: 10, b: 10 };
const ACCENT = { r: 74, g: 222, b: 128 }; // #4ade80

// --- App icons ---

const appIcons = [
  { name: 'icon-192.png', size: 192, padding: 24 },
  { name: 'icon-512.png', size: 512, padding: 64 },
  { name: 'apple-touch-icon.png', size: 180, padding: 22 },
  // Maskable: 20% safe zone on each side = 40% total, so padding = size * 0.2
  { name: 'icon-512-maskable.png', size: 512, padding: 128 },
];

for (const { name, size, padding } of appIcons) {
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

// --- Shortcut icons (96x96 colored circles with letter) ---

const shortcuts = [
  { name: 'shortcut-eventos.png', letter: 'E' },
  { name: 'shortcut-discipulados.png', letter: 'D' },
  { name: 'shortcut-media.png', letter: 'M' },
];

for (const { name, letter } of shortcuts) {
  const size = 96;
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="20" fill="rgb(${ACCENT.r},${ACCENT.g},${ACCENT.b})"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
          font-family="sans-serif" font-weight="700" font-size="48" fill="rgb(${BG_COLOR.r},${BG_COLOR.g},${BG_COLOR.b})">${letter}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT_DIR, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

// --- iOS splash screens ---

const splashSizes = [
  { name: 'splash-1170x2532.png', w: 1170, h: 2532 }, // iPhone 14/13/12
  { name: 'splash-1284x2778.png', w: 1284, h: 2778 }, // iPhone 14 Plus/13 Pro Max
  { name: 'splash-750x1334.png', w: 750, h: 1334 }, // iPhone SE/8
  { name: 'splash-1125x2436.png', w: 1125, h: 2436 }, // iPhone X/XS/11 Pro
];

for (const { name, w, h } of splashSizes) {
  const logoWidth = Math.round(w * 0.4);
  const logoHeight = Math.round(logoWidth * (56 / 108));

  const logo = await sharp(LOGO_PATH)
    .resize(logoWidth, logoHeight, { fit: 'inside' })
    .png()
    .toBuffer();

  await sharp({
    create: { width: w, height: h, channels: 4, background: BG_COLOR },
  })
    .composite([
      {
        input: logo,
        top: Math.round((h - logoHeight) / 2),
        left: Math.round((w - logoWidth) / 2),
      },
    ])
    .png()
    .toFile(path.join(OUT_DIR, name));

  console.log(`Generated ${name} (${w}x${h})`);
}
