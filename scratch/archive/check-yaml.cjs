/**
 * 快速检测所有 markdown 文件的 YAML frontmatter 是否合法
 */
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

files.forEach(filepath => {
  const content = fs.readFileSync(filepath, 'utf8');
  const name = filepath.replace('d:/桌面文件/clashjichang/docs/', '').replace(/\\/g, '/');
  
  // Check frontmatter exists
  if (!content.startsWith('---')) return;
  
  const fmEnd = content.indexOf('\n---', 3);
  if (fmEnd === -1) {
    console.log(`❌ NO FM END: ${name}`);
    errors++;
    return;
  }
  
  const fm = content.substring(0, fmEnd);
  const lines = fm.split('\n');
  
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    
    // Check for unquoted description with special chars
    if (line.match(/^description:\s+[^"'].+:/)) {
      console.log(`❌ UNQUOTED DESC WITH COLON [line ${lineNum}]: ${name}`);
      console.log(`   ${line.substring(0, 100)}`);
      errors++;
    }
    
    // Check for unclosed double-quoted string: starts with " but no closing "
    const dqMatch = line.match(/^(\w+):\s+"(.*)$/);
    if (dqMatch && !dqMatch[2].includes('"')) {
      // This line starts a quoted string but might not close it
      // Check if next line continues (continuation lines start with space/newline in YAML)
      const nextLine = lines[idx + 1] || '';
      if (!nextLine.startsWith(' ') && !nextLine.startsWith('\t') && nextLine.trim() !== '') {
        // Check if this line truly doesn't close
        const val = line.split(/:\s+"/)[1];
        if (val && !val.endsWith('"')) {
          console.log(`⚠️ POSSIBLE UNCLOSED QUOTE [line ${lineNum}]: ${name}`);
          console.log(`   ${line.substring(0, 100)}`);
        }
      }
    }
    
    // Check description with embedded double quotes
    if (line.startsWith('description:') && line.includes('"')) {
      const after = line.replace(/^description:\s*/, '');
      if (after.startsWith('"')) {
        // Count quotes - should be even number
        const quotes = (after.match(/"/g) || []).length;
        if (quotes % 2 !== 0) {
          console.log(`❌ ODD QUOTES IN DESC [line ${lineNum}]: ${name}`);
          console.log(`   ${line.substring(0, 120)}`);
          errors++;
        }
      }
    }
  });
  
  // Check for description that seems to span multiple lines (not in quotes)
  const descMatch = fm.match(/\ndescription:\s+([^"'\n][^\n]*)\n(\w)/);
  if (descMatch) {
    console.log(`⚠️ DESC MAY SPAN LINE: ${name}`);
    console.log(`   "${descMatch[1].substring(0, 60)}"`);
  }
});

if (errors === 0) console.log('✅ All frontmatter looks valid!');
else console.log(`\n❌ Found ${errors} potential issues`);
