/**
 * 1. 评测页标题统一为：{名称}机场怎么样？2026{名称}机场测评：价格、速度、线路与优缺点
 * 2. docs/airport 下缺少 date 的页面，用该文件首次提交日期补上
 * 可重复运行。
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const dir = path.resolve("docs/airport");
let titleChanged = 0;
let dateAdded = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const full = path.join(dir, file);
  let text = fs.readFileSync(full, "utf8");
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) continue;
  let fm = m[1];

  const t = fm.match(/^title:\s*"?(.*?)"?\s*$/m);
  if (t && /^.{1,12}?(机场)?怎么样/.test(t[1])) {
    const name = (t[1].match(/^(.+?)(?:机场)?怎么样/) || [])[1];
    const next = `${name}机场怎么样？2026${name}机场测评：价格、速度、线路与优缺点`;
    if (t[1] !== next) {
      fm = fm.replace(/^title:.*$/m, `title: "${next}"`);
      titleChanged++;
    }
  }

  if (!/^date:/m.test(fm) && !["README.md"].includes(file)) {
    let d = "";
    try {
      d = execSync(`git log --diff-filter=A --format=%as -1 -- "docs/airport/${file}"`, { encoding: "utf8" }).trim();
    } catch {}
    if (d) {
      fm += `${eol}date: ${d}`;
      dateAdded++;
    }
  }

  const out = text.replace(m[1], fm);
  if (out !== text) fs.writeFileSync(full, out);
}
console.log(`titles changed: ${titleChanged}, dates added: ${dateAdded}`);
