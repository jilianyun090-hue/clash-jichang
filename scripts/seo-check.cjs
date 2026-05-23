const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

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
const results = [];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const titleM = c.match(/^title:\s*"?(.+?)"?\s*$/m);
  const descM = c.match(/^description:\s*"?(.+?)"?\s*$/m);
  const titleLen = titleM ? titleM[1].trim().length : 0;
  const descLen = descM ? descM[1].trim().length : 0;
  const title = titleM ? titleM[1].trim() : '(no title)';
  const desc = descM ? descM[1].trim().substring(0, 60) : '(no desc)';
  
  let issues = [];
  if (titleLen === 0) issues.push('NO_TITLE');
  else if (titleLen < 20) issues.push(`TITLE_TOO_SHORT(${titleLen})`);
  if (descLen === 0) issues.push('NO_DESC');
  else if (descLen < 80) issues.push(`DESC_TOO_SHORT(${descLen})`);
  
  results.push({
    file: f.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/'),
    titleLen,
    descLen,
    title: title.substring(0, 50),
    issues
  });
});

// Sort by issues first
results.sort((a, b) => b.issues.length - a.issues.length);

console.log('=== SEO AUDIT RESULTS ===\n');
results.forEach(r => {
  if (r.issues.length > 0) {
    console.log(`FILE: ${r.file}`);
    console.log(`  Title(${r.titleLen}): ${r.title}`);
    console.log(`  Desc(${r.descLen}): ...`);
    console.log(`  ISSUES: ${r.issues.join(', ')}`);
    console.log('');
  }
});

console.log('\n=== SUMMARY ===');
console.log(`Total files: ${results.length}`);
console.log(`Files with issues: ${results.filter(r => r.issues.length > 0).length}`);
console.log(`No title: ${results.filter(r => r.issues.some(i => i === 'NO_TITLE')).length}`);
console.log(`Short title: ${results.filter(r => r.issues.some(i => i.includes('TITLE_TOO_SHORT'))).length}`);
console.log(`No desc: ${results.filter(r => r.issues.some(i => i === 'NO_DESC')).length}`);
console.log(`Short desc: ${results.filter(r => r.issues.some(i => i.includes('DESC_TOO_SHORT'))).length}`);
