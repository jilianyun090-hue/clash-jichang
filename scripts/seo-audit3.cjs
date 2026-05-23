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

const noTitle = [];
const multiH1 = [];
const shortDesc = [];
const duplicateDescs = {};

files.forEach(f => {
  const raw = fs.readFileSync(f, 'utf8');
  const name = f.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  // Parse frontmatter block
  const fmEnd = raw.indexOf('\n---', 4);
  let hasFmTitle = false;
  let titleVal = '';
  if (fmEnd > -1) {
    const fm = raw.substring(0, fmEnd);
    const tMatch = fm.match(/^title:\s*"(.+?)"\s*$/m) || fm.match(/^title:\s*(.+?)\s*$/m);
    if (tMatch) { hasFmTitle = true; titleVal = tMatch[1].trim(); }
  }
  
  // Body after frontmatter
  const body = fmEnd > -1 ? raw.substring(fmEnd + 4) : raw;
  const h1Lines = (body.match(/^# .+/gm) || []);
  const h1Count = h1Lines.length;
  
  // VuePress renders title: as H1 automatically
  // So: if has title: AND has # in body => multiple H1
  // if no title: AND no # in body => no H1
  
  if (hasFmTitle && h1Count > 0) {
    multiH1.push({ name, title: titleVal.substring(0, 60), h1Lines });
  }
  if (!hasFmTitle && h1Count === 0) {
    noTitle.push({ name });
  }
  
  // Check description length
  const fmBlock = fmEnd > -1 ? raw.substring(0, fmEnd) : '';
  const descMatch = fmBlock.match(/^description:\s*"([\s\S]*?)"\s*$/m);
  const descVal = descMatch ? descMatch[1].trim().replace(/\s+/g, ' ') : '';
  
  if (descVal.length > 0 && descVal.length < 80) {
    shortDesc.push({ name, len: descVal.length, desc: descVal });
  }
  if (!descVal) {
    shortDesc.push({ name, len: 0, desc: '(MISSING)' });
  }
  
  // Track for duplicates
  if (descVal.length > 20) {
    if (!duplicateDescs[descVal]) duplicateDescs[descVal] = [];
    duplicateDescs[descVal].push(name);
  }
});

console.log('=== PAGES WITH MULTIPLE H1 (title: frontmatter + # in body) ===');
multiH1.forEach(({ name, title, h1Lines }) => {
  console.log(`FILE: ${name}`);
  console.log(`  FM title: "${title}"`);
  h1Lines.forEach(h => console.log(`  Body H1: "${h}"`));
});

console.log('\n=== PAGES WITH NO H1 (no title: AND no # in body) ===');
noTitle.forEach(({ name }) => console.log(`  ${name}`));

console.log('\n=== SHORT DESCRIPTIONS (< 80 chars) ===');
shortDesc.forEach(({ name, len, desc }) => console.log(`  [${len}] ${name}: ${desc.substring(0, 60)}`));

console.log('\n=== DUPLICATE DESCRIPTIONS ===');
let dupCount = 0;
Object.entries(duplicateDescs).forEach(([desc, pages]) => {
  if (pages.length > 1) {
    dupCount++;
    console.log(`GROUP (${pages.length} pages): "${desc.substring(0, 80)}..."`);
    pages.forEach(p => console.log(`  - ${p}`));
  }
});
if (dupCount === 0) console.log('  None found');

console.log('\n=== SUMMARY ===');
console.log(`Multi-H1 pages: ${multiH1.length}`);
console.log(`No-H1 pages: ${noTitle.length}`);
console.log(`Short/missing desc: ${shortDesc.length}`);
console.log(`Dup desc groups: ${Object.values(duplicateDescs).filter(p => p.length > 1).length}`);
