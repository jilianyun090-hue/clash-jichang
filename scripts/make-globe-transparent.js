import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function makeTransparent() {
  const inputPath = join(__dirname, '../docs/.vuepress/public/globe.png');
  const outputPath = join(__dirname, '../docs/.vuepress/public/globe-transparent.png');

  try {
    await sharp(inputPath)
      .flatten({ background: { r: 247, g: 244, b: 239, alpha: 0 } }) // 使用奶油色背景但完全透明
      .toFile(outputPath);

    console.log('✅ 成功生成透明背景的 globe-transparent.png');
  } catch (error) {
    console.error('❌ 图片处理失败:', error.message);
    process.exit(1);
  }
}

makeTransparent();
