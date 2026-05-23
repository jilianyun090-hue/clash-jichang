const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

// Files that need description updates (truncated/template descriptions)
// We'll identify files with boilerplate text and fix them
const BOILERPLATE_PATTERNS = [
  /本指南专门为您量身定制了最新的评测数据/,
  /本指南为您量身定制了最新的评测数据/,
  /为您量身定制的2026最新评测与实战教程方案/,
  /本指南为您量身定制了/,
];

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory() && !f.startsWith('.')) {
      files = files.concat(walk(fp));
    } else if (f.endsWith('.md')) {
      files.push(fp);
    }
  });
  return files;
}

const files = walk(docsDir);

let fixed = 0;

files.forEach(filepath => {
  let content = fs.readFileSync(filepath, 'utf8');
  const name = filepath.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  const hasBoilerplate = BOILERPLATE_PATTERNS.some(p => p.test(content));
  
  if (hasBoilerplate) {
    console.log(`FOUND boilerplate in: ${name}`);
    // Extract current description to show what it is
    const descMatch = content.match(/^description:\s*"([\s\S]*?)"\s*\n/m);
    if (descMatch) {
      console.log(`  Current desc: "${descMatch[1].substring(0, 80)}..."`);
    }
  }
});

console.log('\nDone scanning.');
