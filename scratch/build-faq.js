import fs from 'fs';
import path from 'path';

const contentPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\9eb95321-83d9-4b2b-863c-07b9efad9d18\\.system_generated\\steps\\149\\content.md';
const contentStr = fs.readFileSync(contentPath, 'utf8');
const lines = contentStr.split('\n');

const categorySlugs = {
    '基础概念': 'basics',
    '新手入门': 'getting-started',
    '订阅导入教程': 'import',
    '客户端选择': 'clients',
    '节点相关': 'nodes',
    '节点地区选择': 'regions',
    '故障排查': 'troubleshooting',
    '流量与套餐': 'traffic-plans',
    '选购与性价比': 'buying-value',
    '线路科普': 'lines',
    '流媒体与 AI 解锁': 'unlock',
    '优惠与试用': 'promos-trial',
    '防跑路与应急': 'run-away',
    '榜单与信息甄别': 'rankings-trust',
    '账号与设备': 'accounts-devices',
    '客户端支持一览': 'client-support',
    '概念辨析': 'concepts',
    '使用场景': 'scenarios',
    '测速方法论': 'speed-testing',
    '选购实操': 'shopping-practice'
};

const categoryTitleMap = {
    'IPLC、IEPL、中转、直连到底是什么。': '线路科普',
    'Netflix、ChatGPT 能不能用,原生 IP 是什么。': '流媒体与 AI 解锁',
    '排行榜、测评、社区推荐怎么看才不被带偏。': '榜单与信息甄别'
};

const categories = [];
let currentCategory = null;

// Step 1: Parse the TOC and question lists to get the categories and questions
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    const catMatch = line.match(/^\[([^\]\d]+)\s+(\d+)\]\(https:\/\/www\.jichangcha\.com\/faq\/#.*?\)$/);
    if (catMatch) {
        const title = catMatch[1].trim();
        const expectedCount = parseInt(catMatch[2], 10);
        
        let cat = categories.find(c => c.title === title);
        if (!cat) {
            cat = {
                title,
                slug: categorySlugs[title] || 'faq-section',
                expectedCount,
                questions: [],
                answers: [],
                description: ''
            };
            categories.push(cat);
        }
        currentCategory = cat;
        continue;
    }
    
    if (currentCategory && line.startsWith('-')) {
        const qMatch = line.match(/^-\s+\[(.*?)\]\(https:\/\/www\.jichangcha\.com\/faq\/#.*?\)$/);
        if (qMatch) {
            const questionText = qMatch[1].trim();
            if (!currentCategory.questions.includes(questionText)) {
                currentCategory.questions.push(questionText);
            }
        }
    }
}

// Step 2: Parse the answers sequentially from the first half of the file
currentCategory = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if it is a category header
    let matchedTitle = null;
    let isSpecial = false;
    
    if (line.startsWith('## ')) {
        matchedTitle = line.replace('## ', '').trim();
    } else if (categoryTitleMap[line]) {
        matchedTitle = categoryTitleMap[line];
        isSpecial = true;
    }
    
    if (matchedTitle) {
        if (matchedTitle === '问题解决了?去看看推荐榜单') {
            break;
        }
        currentCategory = categories.find(c => c.title === matchedTitle);
        if (currentCategory) {
            if (!isSpecial) {
                // Next line is description
                if (i + 1 < lines.length) {
                    currentCategory.description = lines[i + 1].trim();
                    i++; // skip description
                }
            } else {
                currentCategory.description = line; // Use the header text as description
            }
        }
    } else if (line && currentCategory) {
        if (line.startsWith('✅') || line.includes('内容随行业变化持续修订')) {
            continue;
        }
        currentCategory.answers.push(line);
    }
}

// Step 3: Brand replacement helper
function replaceBrands(text) {
    return text
        .replace(/唯兔云/g, '极连云')
        .replace(/一翻云/g, '边界云')
        .replace(/速界/g, '瞬云机场')
        .replace(/edgenova/g, 'Nice加速')
        .replace(/星岛梦/g, '瞬云机场')
        .replace(/二猫云/g, '极连云')
        .replace(/sogo云/g, '飞猫云')
        .replace(/全球云/g, 'Nice加速')
        .replace(/光速云/g, '光年梯');
}

// Step 4: Write the docs/faq/README.md file
let md = `---
title: 2026最新科学上网常见问题与翻墙梯子长尾问题一站式解答
description: 2026年最新科学上网与机场常见问题一站式解答问题库。涵盖机场与VPN区别、订阅链接导入教程、Clash/小火箭客户端选择、延迟与速度测试、晚高峰卡顿排查、流量与年付月付套餐选择、流媒体与AI工具解锁等169个高频长尾问题，助您无痛科学上网。
keywords: 机场常见问题, 机场FAQ, 科学上网常见问题, Clash导入失败, 小火箭订阅失效, 专线机场, 住宅IP, 原生IP解锁, 防跑路, 月付机场
tag:
  - 常见问题
  - 科学上网
  - 机场推荐
  - 客户端配置
  - 故障排查
category:
  - 常见问题
sidebar: false
---

# 科学上网与机场常见问题一站式解答 (169题问题库)

这里汇总了从「机场是什么」到「客户端配置」、「节点选择」、「故障排查」等 **169 个高频科学上网与翻墙机场常见问题**。按主题分组，持续补充更新，助您无痛解决科学上网过程中的所有疑难杂症。

## 💡 问题库快速索引

`;

categories.forEach(cat => {
    md += `- [${cat.title} (${cat.expectedCount}题)](#${cat.slug})\n`;
});

md += '\n---\n\n';

categories.forEach(cat => {
    md += `## ${cat.title} {#${cat.slug}}\n\n`;
    if (cat.description) {
        md += `> **栏目简介**：${replaceBrands(cat.description)}\n\n`;
    }
    
    cat.questions.forEach((q, idx) => {
        md += `- [${idx + 1}. ${q}](#q-${cat.slug}-${idx + 1})\n`;
    });
    
    md += '\n';
    
    cat.questions.forEach((q, idx) => {
        const answer = cat.answers[idx] || '暂无解答，持续更新中。';
        const qId = `q-${cat.slug}-${idx + 1}`;
        md += `<details id="${qId}">\n<summary><b>${idx + 1}. ${q}</b></summary>\n\n${replaceBrands(answer)}\n\n</details>\n\n`;
    });
    
    md += '---\n\n';
});

fs.mkdirSync('docs/faq', { recursive: true });
fs.writeFileSync('docs/faq/README.md', md, 'utf8');
console.log('Successfully wrote docs/faq/README.md!');
