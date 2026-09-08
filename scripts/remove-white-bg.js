import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeWhiteBackground() {
  const inputFile = path.join(__dirname, '../docs/.vuepress/public/globe-transparent.png');
  const outputFile = path.join(__dirname, '../docs/.vuepress/public/globe-no-bg.png');

  try {
    // 读取原始图片
    const image = sharp(inputFile);
    const metadata = await image.metadata();

    console.log('📊 原图信息:', {
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      hasAlpha: metadata.hasAlpha
    });

    // 处理图片：将白色背景变为透明
    await sharp(inputFile)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // 遍历每个像素，将接近白色的像素设为透明
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 如果RGB都接近白色(>240)，则设为完全透明
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // alpha设为0
          }
        }

        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        })
        .png()
        .toFile(outputFile);
      });

    console.log('✅ 成功生成透明背景图片:', outputFile);

    // 检查新文件大小
    const stats = fs.statSync(outputFile);
    console.log('📦 新文件大小:', Math.round(stats.size / 1024), 'KB');

  } catch (error) {
    console.error('❌ 处理图片失败:', error);
    process.exit(1);
  }
}

removeWhiteBackground();
