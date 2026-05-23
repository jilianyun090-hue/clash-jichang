const fs = require('fs');
const path = require('path');

const dir = 'd:/桌面文件/clashjichang/docs';

function walk(d) {
  let r = [];
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory() && !f.startsWith('.')) r = r.concat(walk(p));
    else if (f.endsWith('.md')) r.push(p);
  });
  return r;
}

const files = walk(dir);
const descMap = {};
const results = [];

files.forEach(f => {
  const raw = fs.readFileSync(f, 'utf8');
  const name = f.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  // Extract frontmatter
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let desc = '';
  let title = '';
  if (fmMatch) {
    const fm = fmMatch[1];
    // Multi-line YAML: description can span lines with continuation indent
    const descFull = raw.match(/^description:\s*"([\s\S]*?)"\s*\n(?:[a-z]|---)/m) ||
                     raw.match(/^description:\s*"([\s\S]*?)"\s*$/m) ||
                     raw.match(/^description:\s*([^\n"]+)/m);
    if (descFull) desc = descFull[1].trim().replace(/\s+/g, ' ');
    
    const titleFull = raw.match(/^title:\s*"(.+?)"\s*$/m) ||
                      raw.match(/^title:\s*(.+?)\s*$/m);
    if (titleFull) title = titleFull[1].trim();
  }
  
  // Count h1 tags (not inside frontmatter)
  const bodyStart = raw.indexOf('---', 3);
  const body = bodyStart > -1 ? raw.slice(bodyStart + 3) : raw;
  const h1s = (body.match(/^# .+/gm) || []).length;
  
  // Check title length
  const titleLen = title.length;
  const descLen = desc.length;
  
  const issues = [];
  if (!title) issues.push('NO_TITLE');
  else if (titleLen < 20) issues.push(`TITLE_SHORT(${titleLen}): "${title}"`);
  if (!desc) issues.push('NO_DESC');
  else if (descLen < 80) issues.push(`DESC_SHORT(${descLen})`);
  if (h1s === 0) issues.push('NO_H1');
  if (h1s > 1) issues.push(`MULTI_H1(${h1s})`);
  
  if (!descMap[desc]) descMap[desc] = [];
  descMap[desc].push(name);
  
  results.push({ name, title, titleLen, desc: desc.substring(0, 80), descLen, h1s, issues });
});

console.log('=== H1 ISSUES ===');
results.filter(r => r.issues.some(i => i.includes('H1'))).forEach(r => {
  console.log(`${r.issues.filter(i=>i.includes('H1')).join(', ')}: ${r.name}`);
  console.log(`  Title: ${r.title.substring(0,60)}`);
});

console.log('\n=== TITLE ISSUES ===');
results.filter(r => r.issues.some(i => i.includes('TITLE'))).forEach(r => {
  console.log(`${r.issues.filter(i=>i.includes('TITLE')).join(', ')}: ${r.name}`);
});

console.log('\n=== DESC ISSUES ===');
results.filter(r => r.issues.some(i => i.includes('DESC'))).forEach(r => {
  console.log(`${r.issues.filter(i=>i.includes('DESC')).join(', ')}: ${r.name}`);
  console.log(`  Desc: "${r.desc}"`);
});

console.log('\n=== DUPLICATE DESCRIPTIONS ===');
Object.entries(descMap).forEach(([desc, pages]) => {
  if (pages.length > 1 && desc.length > 20) {
    console.log(`DUPLICATE (${pages.length} pages): "${desc.substring(0, 80)}"`);
    pages.forEach(p => console.log(`  - ${p}`));
  }
});

console.log('\n=== SUMMARY ===');
console.log(`Total files: ${results.length}`);
console.log(`No H1: ${results.filter(r => r.h1s === 0).length}`);
console.log(`Multiple H1: ${results.filter(r => r.h1s > 1).length}`);
console.log(`No title: ${results.filter(r => !r.title).length}`);
console.log(`Short title (<20): ${results.filter(r => r.title && r.titleLen < 20).length}`);
console.log(`No desc: ${results.filter(r => !r.desc).length}`);
console.log(`Short desc (<80): ${results.filter(r => r.desc && r.descLen < 80).length}`);

// List all files with all issues summary
console.log('\n=== ALL FILES STATUS ===');
results.forEach(r => {
  if (r.issues.length > 0) {
    console.log(`[ISSUES] ${r.name}`);
    r.issues.forEach(i => console.log(`  - ${i}`));
  }
});
