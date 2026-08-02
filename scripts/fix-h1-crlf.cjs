const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== '.vuepress' && file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk(docsDir);
let fixedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('---')) return;
  
  const fmEnd = content.indexOf('---', 3);
  if (fmEnd === -1) return;
  
  const bodyStartIndex = fmEnd + 3;
  const header = content.substring(0, bodyStartIndex);
  const body = content.substring(bodyStartIndex);
  
  // Check if header contains title
  if (!header.match(/^title:/m)) return;
  
  // Find first H1 in the body
  const h1Match = body.match(/^(\s*)#\s+(.+?)\r?\n/m);
  if (h1Match) {
    const matchIndex = body.indexOf(h1Match[0]);
    const textBeforeH1 = body.substring(0, matchIndex).trim();
    if (textBeforeH1 === '') {
      // It's the title at the top of the body
      const originalH1 = h1Match[0];
      const newBody = body.replace(originalH1, '');
      const newContent = header + newBody;
      
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`[FIXED] Removed H1 from: ${path.relative(docsDir, file)}`);
      console.log(`  Removed: "${originalH1.trim()}"`);
      fixedCount++;
    }
  }
});

console.log(`\nDone! Fixed ${fixedCount} files.`);
