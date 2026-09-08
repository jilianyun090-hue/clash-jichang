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

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  console.log(`Image info: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Create RGBA buffer
  const rgba = Buffer.alloc(info.width * info.height * 4);

  // We want to detect background colors (cream/gray/checkerboard) and set alpha = 0.
  // Dark globe pixels:
  // Globe body is dark navy/slate blue (R ~ 30-70, G ~ 45-85, B ~ 60-110).
  // Orbits and lines are cyan/blue (R ~ 60-120, G ~ 120-180, B ~ 180-240).
  // Text labels (Beijing, London, Sydney, Singapore, New York) are white/light gray or blue.
  
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
    // If input image has checkerboard background or light background:
    // Light background has high brightness (r > 200 && g > 200 && b > 200) or similar.
    // Let's check gray checkerboard tiles: (light tile ~220, dark tile ~180-190 where r, g, b are almost equal).
    const isGrayOrWhite = Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && (r > 150 || (r > 140 && g > 140 && b > 140));
    
    // Note: The globe itself has dark blue/slate color where B > R or B > G or total brightness is lower.
    // Or blue lines where B > R + 30.
    const isGlobeComponent = (b > r + 10) || (r < 120 && g < 130 && b < 150) || (r > 200 && g > 200 && b > 200 && (Math.abs(r-g) > 20 || Math.abs(g-b) > 20));

    if (isGrayOrWhite && !isGlobeComponent) {
      rgba[dstOffset + 3] = 0; // Transparent
    } else {
      rgba[dstOffset + 3] = 255;
    }
  }

  await sharp(rgba, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Successfully written transparent PNG to:', outputPath);
}

processImage().catch(console.error);
