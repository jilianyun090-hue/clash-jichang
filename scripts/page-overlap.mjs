/**
 * 计算两页之间重复段落比例（按非空行比较），用来判断哪些页面可以安全合并。
 * 用法: node scripts/page-overlap.mjs a.md b.md [c.md ...]   两两比较
 */
import fs from "fs";

const body = (f) => {
  const t = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
  const m = t.match(/^---\n[\s\S]*?\n---\n/);
  return (m ? t.slice(m[0].length) : t)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 12 && !/^[-|: ]+$/.test(l));
};

const files = process.argv.slice(2);
const sets = files.map((f) => new Set(body(f)));
for (let i = 0; i < files.length; i++) {
  for (let j = i + 1; j < files.length; j++) {
    const shared = [...sets[i]].filter((l) => sets[j].has(l)).length;
    const small = Math.min(sets[i].size, sets[j].size);
    console.log(`${(shared / small * 100).toFixed(0).padStart(3)}%  共 ${String(shared).padStart(3)} 行  ${files[i].split("/").pop()}  <->  ${files[j].split("/").pop()}`);
  }
}
