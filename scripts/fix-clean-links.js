import fs from 'fs';
import path from 'path';

const distRoot = path.resolve('docs/.vuepress/dist');
let changedFiles = 0;
let changedLinks = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
      continue;
    }
    if (path.extname(name).toLowerCase() !== '.html') continue;

    const before = fs.readFileSync(filePath, 'utf8');
    // Rewrite only same-site/root-relative document URLs. Asset chunks such as
    // /assets/page.html-abc.js do not match because .html is not followed by a
    // URL delimiter.
    const after = before.replace(
      /(https:\/\/clash-jichang\.com)?((?:\/|\.\/|\.\.\/)[^\s"'<>`()\]]*?)\.html(?=[#?\s"'<>`()\]]|$)/gi,
      (_, domain = '', linkPath) => {
        changedLinks += 1;
        return `${domain}${linkPath}`;
      },
    );
    if (after !== before) {
      fs.writeFileSync(filePath, after);
      changedFiles += 1;
    }
  }
}

walk(distRoot);
console.log(`✅ fix-clean-links: normalized ${changedLinks} links in ${changedFiles} generated HTML files`);
