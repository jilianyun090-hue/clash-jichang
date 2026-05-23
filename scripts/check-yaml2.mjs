import { load } from 'js-yaml';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const docsDir = 'd:/桌面文件/clashjichang/docs';

function walk(dir) {
  let files = [];
  readdirSync(dir).forEach(f => {
    const fp = join(dir, f);
    if (statSync(fp).isDirectory() && !f.startsWith('.')) files = files.concat(walk(fp));
    else if (f.endsWith('.md')) files.push(fp);
  });
  return files;
}

const files = walk(docsDir);
let errors = 0;

for (const filepath of files) {
  const content = readFileSync(filepath, 'utf8');
  const name = filepath.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  if (!content.startsWith('---')) continue;
  
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) continue;
  
  const fmContent = content.substring(4, fmEnd); // skip opening ---\n
  
  try {
    load(fmContent);
  } catch (e) {
    console.log(`❌ YAML ERROR in: ${name}`);
    console.log(`   ${e.message}`);
    // Show problematic lines
    const lines = fmContent.split('\n');
    if (e.mark) {
      const errLine = e.mark.line;
      for (let i = Math.max(0, errLine-2); i <= Math.min(lines.length-1, errLine+2); i++) {
        console.log(`   [${i+1}] ${lines[i]}`);
      }
    }
    console.log('');
    errors++;
  }
}

if (errors === 0) console.log('✅ All frontmatter YAML is valid!');
else console.log(`\nTotal errors: ${errors}`);
