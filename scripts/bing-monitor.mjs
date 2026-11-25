#!/usr/bin/env node
/**
 * 简化版 Bing 流量监控脚本（无需第三方依赖）
 *
 * 使用方法：
 * 1. 在项目根目录创建 .env 文件，复制 .env.example 的内容
 * 2. 填入你的 BING_API_KEY 和 SITE_URL
 * 3. 运行：npm run bing:monitor
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __root = path.resolve(__dirname, '..');

// 读取 .env 文件
function loadEnv() {
  const envPath = path.join(__root, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ 未找到 .env 文件');
    console.error('请创建 .env 文件，参考 .env.example');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  });

  return env;
}

const env = loadEnv();
const API_KEY = env.BING_API_KEY;
const SITE_URL = env.BING_SITE_URL || 'https://clash-jichang.com';

if (!API_KEY) {
  console.error('❌ 错误: 未找到 BING_API_KEY');
  console.error('请在 .env 文件中添加: BING_API_KEY=你的密钥');
  process.exit(1);
}

console.log('🔗 Bing 流量监控');
console.log(`   网站: ${SITE_URL}`);
console.log(`   时间: ${new Date().toLocaleString('zh-CN')}\n`);

// 调用 Bing API
function fetchBingTraffic() {
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
        'Content-Type': 'application/json; charset=utf-8',
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
          reject(new Error(`解析响应失败: ${e.message}`));
        }
      });
    });

    req.on('error', reject);

    req.write(postData);
    req.end();
  });
}

// 保存数据
function saveData(data) {
  if (!data.d || data.d.length === 0) {
    console.warn('⚠️  未获取到数据');
    return;
  }

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

    if (index < 7) {
      stats.recentDays.push({
        date: day.Date,
        clicks: day.Clicks || 0,
        impressions: day.Impressions || 0,
        ctr: parseFloat(ctr),
        position: parseFloat((day.Position || 0).toFixed(2))
      });
    }
  });

  stats.averageCTR = (ctrSum / data.d.length).toFixed(2);
  stats.averagePosition = (positionSum / data.d.length).toFixed(2);

  // 保存文件
  const outputPath = path.join(__root, 'docs/.vuepress/data/bing-traffic.mjs');
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `// Bing 流量数据 - 自动生成于 ${stats.lastUpdated}
export const bingTrafficData = ${JSON.stringify(stats, null, 2)};

export const bingTrafficChartData = {
  labels: ${JSON.stringify(stats.recentDays.map(d => d.date))},
  clicks: ${JSON.stringify(stats.recentDays.map(d => d.clicks))},
  impressions: ${JSON.stringify(stats.recentDays.map(d => d.impressions))},
  ctr: ${JSON.stringify(stats.recentDays.map(d => d.ctr))},
};
`;

  fs.writeFileSync(outputPath, content, 'utf-8');

  console.log('✅ 数据已保存');
  console.log('\n📈 Bing 流量数据：');
  console.log(`   点击总数: ${stats.totalClicks}`);
  console.log(`   展示总数: ${stats.totalImpressions}`);
  console.log(`   平均CTR: ${stats.averageCTR}%`);
  console.log(`   平均排名: ${stats.averagePosition}`);
  console.log(`   最近7天数据已保存\n`);
}

// 主函数
(async () => {
  try {
    console.log('📡 正在请求 Bing API...');
    const data = await fetchBingTraffic();
    saveData(data);
  } catch (error) {
    console.error('❌ 获取数据失败:', error.message);
    console.error('\n排查步骤：');
    console.error('1. 检查 .env 文件中的 BING_API_KEY 是否正确');
    console.error('2. 访问 https://www.bing.com/webmasters 确认网站注册');
    console.error('3. 检查 API 密钥是否有效');
  }
})();
