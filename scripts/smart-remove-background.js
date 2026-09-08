import { Jimp } from 'jimp';

const inputPath = 'C:\\Users\\Administrator\\Downloads\\Gemini_Generated_Image_yfa7ykyfa7ykyfa7.jpg';
const outputPath = 'docs/.vuepress/public/network-globe-logo.png';

async function removeBackground() {
  const image = await Jimp.read(inputPath);
  const { width, height } = image.bitmap;

  // Sample corner pixels to determine background color
  const corners = [
    image.getPixelColor(0, 0),
    image.getPixelColor(width - 1, 0),
    image.getPixelColor(0, height - 1),
    image.getPixelColor(width - 1, height - 1)
  ];

  // Get average background color from corners
  let bgR = 0, bgG = 0, bgB = 0;
  corners.forEach(color => {
    // Extract RGBA from color integer manually
    const r = (color >> 24) & 0xff;
    const g = (color >> 16) & 0xff;
    const b = (color >> 8) & 0xff;
    bgR += r;
    bgG += g;
    bgB += b;
  });
  bgR /= 4; bgG /= 4; bgB /= 4;

  console.log(`Background color detected: RGB(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`);

  image.scan(0, 0, width, height, (x, y, idx) => {
    const data = image.bitmap.data;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Calculate color distance from background
    const distance = Math.sqrt(
      Math.pow(r - bgR, 2) +
      Math.pow(g - bgG, 2) +
      Math.pow(b - bgB, 2)
    );

    // If color is similar to background (distance < 40), make transparent
    if (distance < 40) {
      data[idx + 3] = 0;
    }
  });

  await image.write(outputPath);
  console.log('✓ Background removed using smart color detection');
}

removeBackground().catch(console.error);
