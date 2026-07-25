const fs = require('fs');
const matter = require('gray-matter');

let c = fs.readFileSync('docs/airport/miaomiaoyun.md', 'utf8');

// Find body content after the frontmatter
// The frontmatter ends at the second ---
const lines = c.split('\n');
let fmEnd = -1;
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim() === '---') {
    fmEnd = i;
    break;
  }
}

const body = lines.slice(fmEnd + 1).join('\n');

const newFM = `---
title: "秒秒云怎么样？2026秒秒云中转高速节点与设备无限制深度测评"
description: "如何选择高性价比的秒秒云机场？本篇2026测评从晚高峰测速、延迟丢包、流媒体解锁等维度进行实测。秒秒云配备了高速IEPL/IPLC专线，支持Clash、小火箭订阅配置，提供卓越的Netflix、YouTube、TikTok和ChatGPT解锁性能，是稳定高速的科学上网翻墙节点推荐。"
head:
  - - meta
    - name: keywords
      content: 秒秒云,秒秒云怎么样,秒秒云官网,秒秒云测速,BGP中转机场
tag:
  - 机场推荐
  - 秒秒云
  - BGP
  - 机场测评
  - 科学上网
category: 机场测评
date: 2026-05-25
---
`;

fs.writeFileSync('docs/airport/miaomiaoyun.md', newFM + body, 'utf8');

try {
  matter(fs.readFileSync('docs/airport/miaomiaoyun.md', 'utf8'));
  console.log('YAML OK');
} catch (e) {
  console.log('Error:', e.message);
}
