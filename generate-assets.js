const sharp = require('sharp');
const fs = require('fs');

async function main() {
  await fs.promises.mkdir('assets', { recursive: true });

  // 1. icon.png (1024x1024) from favicon.svg
  await sharp('public/favicon.svg')
    .resize(1024, 1024)
    .png()
    .toFile('assets/icon.png');
  console.log('Generated assets/icon.png');

  // 2. splash.png (2732x2732 with #0f172a background and centered icon)
  const iconBuffer = await sharp('public/favicon.svg')
    .resize(600, 600)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 2732,
      height: 2732,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a
    }
  })
    .composite([{ input: iconBuffer, gravity: 'center' }])
    .png()
    .toFile('assets/splash.png');
  console.log('Generated assets/splash.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
