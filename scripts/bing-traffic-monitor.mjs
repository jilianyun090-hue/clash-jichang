#!/usr/bin/env node
/**
 * Bing Webmaster Tools 流量监控脚本
 *
 * 使用方法：
 * 1. 创建 .env 文件，添加：
 *    BING_API_KEY=你的API密钥
 *    BING_SITE_URL=https://clash-jichang.com
 *
 * 2. 运行脚本：
 *    node scripts/bing-traffic-monitor.mjs
 *
 * 3. 数据保存到：
 *    docs/.vuepress/data/bing-traffic.mjs
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __root = path.resolve(__dirname, '..');

// 从环境变量读取配置
const API_KEY = process.env.BING_API_KEY;
const SITE_URL = process.env.BING_SITE_URL || 'https://clash-jichang.com';

if (!API_KEY) {
  console.error('❌ 错误: 未找到 BING_API_KEY 环境变量');
  console.error('请创建 .env 文件并添加: BING_API_KEY=你的密钥');
  process.exit(1);
}

// Bing API 请求函数
function fetchBingTrafficData() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      siteUrl: SITE_URL,
    });

    const options = {
      hostname: 'ssl.bing.com',
      port: 443,
      path: '/webmaster/api/json/QueryTraffic',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-API-Key': API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// 处理和保存数据
async function saveTrafficData() {
  try {
    console.log('📊 正在从 Bing API 获取流量数据...');
    const data = await fetchBingTrafficData();

    if (data.d && data.d.length > 0) {
      // 计算统计数据
      const stats = {
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toLocaleString('zh-CN'),
        totalClicks: 0,
        totalImpressions: 0,
        averageCTR: 0,
        averagePosition: 0,
        recentDays: []
      };

      let ctrSum = 0;
      let positionSum = 0;

      data.d.forEach((day, index) => {
        stats.totalClicks += day.Clicks || 0;
        stats.totalImpressions += day.Impressions || 0;
        const ctr = day.Impressions > 0 ? (day.Clicks / day.Impressions * 100).toFixed(2) : 0;
        ctrSum += parseFloat(ctr);
        positionSum += day.Position || 0;

        // 保留最近7天的详细数据
        if (index < 7) {
          stats.recentDays.push({
            date: day.Date,
            clicks: day.Clicks || 0,
            impressions: day.Impressions || 0,
            ctr: ctr,
            position: parseFloat((day.Position || 0).toFixed(2))
          });
        }
      });

      stats.averageCTR = (ctrSum / data.d.length).toFixed(2);
      stats.averagePosition = (positionSum / data.d.length).toFixed(2);

      // 保存为 JavaScript 模块
      const outputPath = path.join(__root, 'docs/.vuepress/data/bing-traffic.mjs');

      // 确保目录存在
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const moduleContent = `// 自动生成的 Bing 流量数据 - ${new Date().toLocaleString('zh-CN')}
export const bingTrafficData = ${JSON.stringify(stats, null, 2)};
`;

      fs.writeFileSync(outputPath, moduleContent, 'utf-8');

      console.log('✅ 数据已保存到:', outputPath);
      console.log('\n📈 Bing 流量统计：');
      console.log(`   点击总数: ${stats.totalClicks}`);
      console.log(`   展示总数: ${stats.totalImpressions}`);
      console.log(`   平均 CTR: ${stats.averageCTR}%`);
      console.log(`   平均排名: ${stats.averagePosition}`);
    } else {
      console.warn('⚠️  未获取到流量数据，可能是：');
      console.warn('   1. API 密钥无效');
      console.warn('   2. 网站在 Bing 中数据较少');
      console.warn('   3. API 请求失败');
      console.log('\n完整响应:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ 获取 Bing 流量数据失败:', error.message);
    console.error('\n排查步骤：');
    console.error('1. 确认 .env 文件中 BING_API_KEY 正确');
    console.error('2. 在 https://www.bing.com/webmasters 检查 API 密钥是否有效');
    console.error('3. 确认网站已在 Bing Webmaster 中注册');
  }
}

// 主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔗 Bing 流量监控脚本');
  console.log(`   网站: ${SITE_URL}`);
  console.log(`   时间: ${new Date().toLocaleString('zh-CN')}\n`);

  saveTrafficData();
}
