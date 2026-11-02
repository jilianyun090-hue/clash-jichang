/**
 * 从 docs/faq/README.md 的 <details> 问答块抽取前 N 条，写入 docs/.vuepress/data/faq.json，
 * 供 theme.mjs 在构建期输出 FAQPage JSON-LD（SchemaOrg.vue 的 v-html 方式在 SSR 下不会进静态 HTML）。
 */
import fs from "fs";
const src = fs.readFileSync("docs/faq/README.md", "utf8");
const re = /<details[^>]*>\s*<summary><b>(.*?)<\/b><\/summary>([\s\S]*?)<\/details>/g;
const out = [];
let m;
while ((m = re.exec(src)) && out.length < 12) {
  const q = m[1].replace(/^\d+\.\s*/, "").trim();
  const a = m[2].replace(/\[[^\]]*\]\([^)]*\)/g, (s) => s.replace(/\]\([^)]*\)/, "").replace("[", ""))
    .replace(/[*`>#]/g, "").replace(/\s+/g, " ").trim();
  if (q && a.length > 20) out.push({ q, a: a.slice(0, 320) });
}
fs.mkdirSync("docs/.vuepress/data", { recursive: true });
fs.writeFileSync("docs/.vuepress/data/faq.json", JSON.stringify(out, null, 2) + "\n");
console.log(`faq.json: ${out.length} Q&A`);
