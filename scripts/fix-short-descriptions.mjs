#!/usr/bin/env node
/**
 * 批量修复meta description太短的问题
 * Bing建议description长度为150-160字符
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '../docs');

// 扩展模板：根据页面类型生成合适长度的description
const descriptionTemplates = {
  airport: (name, existing) => {
    if (existing && existing.length >= 120) return existing;
    return `${name}测评：整理套餐价格、节点线路、流量倍率、设备限制和订阅配置信息。提供详细的线路类型说明、客户端配置教程、优惠码信息，帮助你判断是否适合你的科学上网需求。`;
  },
  guide: (title, existing) => {
    if (existing && existing.length >= 120) return existing;
    return `${title}完整指南：从入门到进阶的详细教程，涵盖配置步骤、常见问题排查、优化技巧和最佳实践。适合新手快速上手，也包含进阶用户需要的深度内容。`;
  },
  comparison: (title, existing) => {
    if (existing && existing.length >= 120) return existing;
    return `${title}对比分析：详细对比功能特性、价格套餐、线路质量、使用体验和适用场景。提供客观评测数据和实际使用建议，帮助你做出明智的选择。`;
  },
  default: (title, existing) => {
    if (existing && existing.length >= 120) return existing;
    return `${title}：提供详细的信息整理、使用指南和选购建议。涵盖核心功能介绍、配置方法、常见问题解答和实用技巧，帮助你全面了解并高效使用相关服务。`;
  }
};

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const lines = frontmatter.split('\n');
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    if (line.match(/^[a-z]+:/i)) {
      const [key, ...valueParts] = line.split(':');
      currentKey = key.trim();
      data[currentKey] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }

  return { data, fullMatch: match[0] };
}

function generateDescription(filePath, title, existingDesc) {
  const fileName = path.basename(filePath, '.md');

  // 机场评测页
  if (filePath.includes('/airport/') && !['README', 'compare', 'brands', 'best-value', 'best-airport-2026', 'cheap-airport'].includes(fileName)) {
    const airportName = title.split(/[测评|怎么样|推荐]/)[0].trim();
    return descriptionTemplates.airport(airportName, existingDesc);
  }

  // 对比类页面
  if (fileName.includes('compare') || fileName.includes('vs') || title.includes('对比')) {
    return descriptionTemplates.comparison(title, existingDesc);
  }

  // 指南类页面
  if (fileName.includes('guide') || title.includes('指南') || title.includes('教程')) {
    return descriptionTemplates.guide(title.replace(/指南|教程|完整/, ''), existingDesc);
  }

  return descriptionTemplates.default(title, existingDesc);
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fm = extractFrontmatter(content);

  if (!fm) return { skipped: true, reason: 'no frontmatter' };

  const { data, fullMatch } = fm;
  const title = data.title || path.basename(filePath, '.md');
  const existingDesc = data.description || '';

  // 跳过已有足够长度的description
  if (existingDesc.length >= 120) {
    return { skipped: true, reason: 'already long enough', length: existingDesc.length };
  }

  // 跳过自动生成的页面
  if (content.includes('本页由 scripts/generate-airport-pages.mjs 生成')) {
    return { skipped: true, reason: 'auto-generated' };
  }

  const newDesc = generateDescription(filePath, title, existingDesc);

  // 构建新的frontmatter
  const newFrontmatter = fullMatch.replace(
    /description:\s*["'].*["']/,
    `description: "${newDesc}"`
  );

  // 如果原来没有description,添加一个
  if (!data.description) {
    const titleLine = fullMatch.match(/title:.*\n/)[0];
    const insertPoint = fullMatch.indexOf(titleLine) + titleLine.length;
    const before = fullMatch.slice(0, insertPoint);
    const after = fullMatch.slice(insertPoint);
    const finalFrontmatter = before + `description: "${newDesc}"\n` + after;

    const newContent = content.replace(fullMatch, finalFrontmatter);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return { updated: true, oldLength: 0, newLength: newDesc.length };
  }

  const newContent = content.replace(fullMatch, newFrontmatter);
  fs.writeFileSync(filePath, newContent, 'utf8');

  return { updated: true, oldLength: existingDesc.length, newLength: newDesc.length };
}

function scanDirectory(dir) {
  const results = { updated: 0, skipped: 0, errors: 0, details: [] };

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        // 跳过特殊目录
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const result = processFile(fullPath);
          const relativePath = path.relative(docsDir, fullPath);

          if (result.updated) {
            results.updated++;
            results.details.push({
              file: relativePath,
              status: 'updated',
              oldLength: result.oldLength,
              newLength: result.newLength
            });
          } else if (result.skipped) {
            results.skipped++;
            if (result.reason !== 'already long enough' && result.reason !== 'auto-generated') {
              results.details.push({
                file: relativePath,
                status: 'skipped',
                reason: result.reason
              });
            }
          }
        } catch (err) {
          results.errors++;
          results.details.push({
            file: path.relative(docsDir, fullPath),
            status: 'error',
            error: err.message
          });
        }
      }
    }
  }

  walk(dir);
  return results;
}

// 执行扫描
console.log('🔍 扫描需要修复的页面...\n');
const results = scanDirectory(docsDir);

console.log('📊 处理结果:');
console.log(`   ✅ 已更新: ${results.updated} 个文件`);
console.log(`   ⏭️  已跳过: ${results.skipped} 个文件`);
console.log(`   ❌ 错误: ${results.errors} 个文件\n`);

if (results.details.filter(d => d.status === 'updated').length > 0) {
  console.log('📝 更新详情:');
  results.details
    .filter(d => d.status === 'updated')
    .forEach(d => {
      console.log(`   ${d.file}`);
      console.log(`      ${d.oldLength} → ${d.newLength} 字符`);
    });
}

if (results.details.filter(d => d.status === 'error').length > 0) {
  console.log('\n❌ 错误详情:');
  results.details
    .filter(d => d.status === 'error')
    .forEach(d => {
      console.log(`   ${d.file}: ${d.error}`);
    });
}

console.log(`\n✅ 完成! 共更新 ${results.updated} 个页面的meta description`);
