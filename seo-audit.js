const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, 'docs');

function walkMd(dir) {
  const results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory() && !f.startsWith('.')) results.push(...walkMd(full));
    else if (f.endsWith('.md')) results.push(full);
  }
  return results;
}

const files = walkMd(docsDir);
const issues = { multiH1: [], missingH1: [], shortTitle: [], shortDesc: [], missingAlt: [] };

for (const f of files) {
  const rel = path.relative(docsDir, f).replace(/\\/g, '/');
  const content = fs.readFileSync(f, 'utf8');
  
  // Extract frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = fmMatch ? fmMatch[1] : '';
  
  // Get title - handle quoted and unquoted
  const titleMatch = fm.match(/^title:\s*["']?(.*?)["']?\s*$/m);
  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  
  // Get description  
  const descMatch = fm.match(/^description:\s*["']?(.*?)["']?\s*$/m);
  const desc = descMatch ? descMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  
  // Count h1 in body (after frontmatter)
  const bodyStart = fmMatch ? fmMatch[0].length : 0;
  const body = content.slice(bodyStart);
  const h1Lines = (body.match(/^# .+/mg) || []);
  const h1InBody = h1Lines.length;
  
  // Total h1: title acts as h1 if present, plus any in body
  const h1Total = h1InBody + (title ? 1 : 0);
  
  // Check images missing alt
  const imgMatches = body.match(/!\[(.*?)\]\([^)]+\)/g) || [];
  const missingAltImgs = imgMatches.filter(m => /^!\[\s*\]/.test(m));
  
  if (h1Total > 1) issues.multiH1.push({ file: rel, count: h1Total, h1InBody, h1Lines: h1Lines.slice(0,3) });
  if (!title && h1InBody === 0) issues.missingH1.push(rel);
  if (title && title.length < 50) issues.shortTitle.push({ file: rel, title, len: title.length });
  if (!desc || desc.length < 150) issues.shortDesc.push({ file: rel, len: desc.length, missing: !desc });
  if (missingAltImgs.length > 0) issues.missingAlt.push({ file: rel, count: missingAltImgs.length, examples: missingAltImgs.slice(0,2) });
}

console.log('=== MULTI H1 (' + issues.multiH1.length + ') ===');
issues.multiH1.forEach(x => console.log(JSON.stringify(x)));
console.log('\n=== MISSING H1 (' + issues.missingH1.length + ') ===');
issues.missingH1.forEach(x => console.log(x));
console.log('\n=== SHORT TITLE <50 chars (' + issues.shortTitle.length + ') ===');
issues.shortTitle.forEach(x => console.log(JSON.stringify(x)));
console.log('\n=== SHORT/MISSING DESC (' + issues.shortDesc.length + ') ===');
issues.shortDesc.forEach(x => console.log(JSON.stringify(x)));
console.log('\n=== MISSING ALT (' + issues.missingAlt.length + ') ===');
issues.missingAlt.forEach(x => console.log(JSON.stringify(x)));
