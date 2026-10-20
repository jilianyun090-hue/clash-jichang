const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory() && !f.startsWith('.')) files = files.concat(walk(fp));
    else if (f.endsWith('.md')) files.push(fp);
  });
  return files;
}

const files = walk(docsDir);
let errors = 0;

for (const filepath of files) {
  const content = fs.readFileSync(filepath, 'utf8');
  const name = filepath.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  if (!content.startsWith('---')) continue;
  
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) continue;
  
  const fmContent = content.substring(4, fmEnd);
  
  try {
    yaml.safeLoad(fmContent);
  } catch (e) {
    console.log(`❌ YAML ERROR: ${name}`);
    console.log(`   ${e.message.split('\n')[0]}`);
    const lines = fmContent.split('\n');
    if (e.mark) {
      const errLine = e.mark.line;
      for (let i = Math.max(0, errLine-2); i <= Math.min(lines.length-1, errLine+2); i++) {
        const marker = i === errLine ? '>>>' : '   ';
        console.log(`   ${marker} [L${i+2}] ${lines[i]}`);
      }
    }
    console.log('');
    errors++;
  }
}

if (errors === 0) console.log('✅ All YAML valid!');
else console.log(`\nTotal: ${errors} error(s)`);
