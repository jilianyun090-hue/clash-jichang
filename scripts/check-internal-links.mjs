/**
 * 检查 docs 下所有 md 的站内链接是否指向存在的页面或静态资源。
 * 用法: node scripts/check-internal-links.mjs
 * 有死链时退出码为 1，可接入 CI。
 */
import fs from "fs";
import path from "path";

const root = path.resolve("docs");
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === ".vuepress" || e.name === "node_modules" ? [] : walk(p);
    return e.name.endsWith(".md") ? [p] : [];
  });

const files = walk(root);
const pages = new Set();
for (const f of files) {
  let rel = path.relative(root, f).split(path.sep).join("/").replace(/\.md$/, "");
  if (rel.endsWith("README") || rel === "index") rel = rel.replace(/(README|index)$/, "");
  pages.add("/" + rel.replace(/\/$/, ""));
}
const publicDir = path.join(root, ".vuepress/public");
const ASSET = /\.(png|jpg|jpeg|svg|webp|txt|xml|ico|gif)$/i;
// 博客插件自动生成的聚合页
const generated = ["/tag", "/category", "/article", "/timeline", "/star", "/404"];

const bad = new Map();
const add = (link, src) => {
  if (!bad.has(link)) bad.set(link, []);
  bad.get(link).push(src);
};

for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  const src = "/" + path.relative(root, f).split(path.sep).join("/");
  const re = /\]\((\/[^)\s#?]*)|href="(\/[^"#?]*)/g;
  for (const m of text.matchAll(re)) {
    const raw = m[1] ?? m[2];
    const link = raw.replace(/\.html$/, "").replace(/\/$/, "");
    if (link === "" || link.startsWith("/go/")) continue;
    if (ASSET.test(raw)) {
      if (!fs.existsSync(path.join(publicDir, raw))) add(raw, src);
      continue;
    }
    if (pages.has(link)) continue;
    if (generated.some((g) => link === g || link.startsWith(g + "/"))) continue;
    add(link, src);
  }
}

for (const [link, srcs] of [...bad.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${link}  <-  ${srcs.length} 处 (${[...new Set(srcs)].slice(0, 4).join(", ")})`);
}
const total = [...bad.values()].reduce((a, b) => a + b.length, 0);
console.log(`\n死链目标 ${bad.size} 个，共 ${total} 处`);
process.exit(bad.size ? 1 : 0);
