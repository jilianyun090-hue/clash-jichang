const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:\\Users\\Administrator\\Downloads\\Gemini_Generated_Image_yfa7ykyfa7ykyfa7.jpg';
const outputPath = path.join(__dirname, '../docs/.vuepress/public/network-globe-logo.png');

async function processImage() {
  if (!fs.existsSync(inputPath)) {
    console.error('File not found:', inputPath);
    return;
  }

  const image = sharp(inputPath);
  const metadata = await image.metadata();
  console.log(`Image info: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);

  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Create RGBA buffer
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let i = 0; i < info.width * info.height; i++) {
    const srcOffset = i * info.channels;
    const r = data[srcOffset];
    const g = data[srcOffset + 1];
    const b = data[srcOffset + 2];

    const dstOffset = i * 4;
    rgba[dstOffset] = r;
    rgba[dstOffset + 1] = g;
    rgba[dstOffset + 2] = b;

    // Check background:
    // Image 2 from user is a globe surrounded by checkerboard pattern (light gray ~204, dark gray ~153)
    // or white/cream background.
    // The globe is dark slate blue: r around 30-70, g around 45-85, b around 60-110
    // Orbit lines are cyan/blue: r around 60-100, g around 130-180, b around 190-240
    // White text labels (London, Beijing, Sydney, etc.): r > 200, g > 200, b > 200
    
    // Is pixel background checkerboard or cream?
    // Checkerboard gray pixels have r == g == b (very small delta between r,g,b).
    const colorDelta = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    
    // If r, g, b are almost identical (gray tile in checkerboard or pure white) AND brightness is high (> 120):
    // Exception: White text on the globe! White text is located near/inside the globe or blue lines.
    const isGrayOrWhiteBg = (colorDelta < 18) && (r > 130);

    if (isGrayOrWhiteBg) {
      rgba[dstOffset + 3] = 0; // Transparent
    } else {
      rgba[dstOffset + 3] = 255;
    }
  }

  // Also crop tightly to the globe content bounding box
  await sharp(rgba, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .trim({ threshold: 10 }) // trim empty transparent borders
  .png()
  .toFile(outputPath);

  console.log('Successfully written transparent trimmed PNG to:', outputPath);
}

processImage().catch(console.error);
