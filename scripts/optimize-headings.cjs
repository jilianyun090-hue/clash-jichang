const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs/airport';

const AIRPORTS = [
  { file: 'bianjiyun.md', name: '边界云' },
  { file: 'dageyun.md', name: '大哥云' },
  { file: 'duolaameng.md', name: '哆啦A梦' },
  { file: 'edge-x.md', name: 'Edge-X' },
  { file: 'feiniaojichang.md', name: '飞鸟机场' },
  { file: 'guangnianti.md', name: '光年梯' },
  { file: 'guangshuyun.md', name: '光速云' },
  { file: 'huanyuyun.md', name: '寰宇云' },
  { file: 'huayunjichang.md', name: '花云' },
  { file: 'jilianyun.md', name: '极连云' },
  { file: 'jisuyun.md', name: '极速云' },
  { file: 'keda.md', name: '可达加速器' },
  { file: 'lizione.md', name: 'LiZione' },
  { file: 'longmaoyun.md', name: '龙猫云' },
  { file: 'miaomiaoyun.md', name: '秒秒云' },
  { file: 'naiyun.md', name: '奈云' },
  { file: 'qingyunti.md', name: '青云梯' },
  { file: 'quanqiuyun.md', name: '全球云' },
  { file: 'shanhai.md', name: '山海机场' },
  { file: 'shanshuiyun.md', name: '山水云' },
  { file: 'shunyun.md', name: '瞬云机场' },
  { file: 'xingdaomeng.md', name: '星岛梦' },
  { file: 'xundavpn.md', name: '迅达VPN' },
  { file: 'yinyun.md', name: '隐云' },
];

let count = 0;

AIRPORTS.forEach(({ file, name }) => {
  const filepath = path.join(docsDir, file);
  if (!fs.existsSync(filepath)) return;

  let content = fs.readFileSync(filepath, 'utf8');

  // Replace Speed/Latency H2
  // Match any H2 starting with ## 📊 and containing 速度/实测
  content = content.replace(/^## 📊\s*.*?速度.*$/m, `## 📊 ${name}网速快吗？晚高峰带宽与延迟测速数据`);

  // Replace Price/Package H2
  // Match any H2 starting with ## 💰 and containing 套餐/价格/资费
  content = content.replace(/^## 💰\s*.*?套餐.*$/m, `## 💰 ${name}价格多少钱？最新套餐费用与资费一览`);

  // Replace Client/Config H2
  // Match any H2 starting with ## ⚙️ and containing 客户端/配置/订阅/教程
  content = content.replace(/^## ⚙️\s*.*?配置.*$/m, `## ⚙️ ${name}怎么使用？Clash与小火箭订阅导入教程`);
  content = content.replace(/^## ⚙️\s*.*?客户端.*$/m, `## ⚙️ ${name}怎么使用？Clash与小火箭订阅导入教程`);

  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Optimized headers for ${file}`);
  count++;
});

console.log(`Successfully optimized headings in ${count} files.`);
