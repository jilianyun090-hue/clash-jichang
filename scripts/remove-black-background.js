import sharp from 'sharp';

const inputPath = 'C:\\Users\\Administrator\\Downloads\\Gemini_Generated_Image_yfa7ykyfa7ykyfa7.jpg';
const outputPath = 'docs/.vuepress/public/network-globe-logo.png';

sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;

    // Process pixels to make black/dark pixels transparent
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // If pixel is very dark (close to black), make it transparent
      // Increased threshold from 30 to 50 to catch more dark pixels
      if (r < 50 && g < 50 && b < 50) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }

    return sharp(data, {
      raw: {
        width,
        height,
        channels
      }
    })
    .png()
    .toFile(outputPath);
  })
  .then(() => {
    console.log('✓ Black background removed, transparent PNG created');
  })
  .catch(err => {
    console.error('Error:', err);
  });
