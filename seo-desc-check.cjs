const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, 'docs');

function walkMd(dir) {
  const results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !f.startsWith('.')) {
      results.push(...walkMd(full));
    } else if (f.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const files = walkMd(docsDir);
const report = [];

for (const f of files) {
  const rel = path.relative(docsDir, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  
  // Extract frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  
  // Get description
  const descMatch = fm.match(/^description:\s*["']?(.*?)["']?\s*$/m);
  let desc = descMatch ? descMatch[1].trim() : '';
  if ((desc.startsWith('"') && desc.endsWith('"')) || (desc.startsWith("'") && desc.endsWith("'"))) {
    desc = desc.substring(1, desc.length - 1);
  }
  
  const chineseLength = (desc.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  report.push({
    file: rel,
    desc: desc,
    chineseLength: chineseLength
  });
}

fs.writeFileSync(path.join(__dirname, 'desc-check-results.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('Successfully wrote desc-check-results.json in UTF-8!');
