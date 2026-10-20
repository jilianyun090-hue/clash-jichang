/**
 * 构建前校验：docs 下所有 md 的 frontmatter 必须是合法 YAML，并包含 title。
 * 有错误时退出码为 1，阻止构建，避免再次出现“双引号导致 YAML 解析失败 → 部署失败”。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === ".vuepress" || e.name === "node_modules" ? [] : walk(p);
    return e.name.endsWith(".md") ? [p] : [];
  });

let errors = 0;
for (const f of walk("docs")) {
  try {
    const { data } = matter(fs.readFileSync(f, "utf8"));
    const isHome = data.home === true;
    const hasTitle = isHome || typeof data.title === "string" || /^# /m.test(fs.readFileSync(f, "utf8"));
    if (!hasTitle) {
      console.error(`缺少 title: ${f}`);
      errors++;
    }
    if (typeof data.description === "string" && data.description.length > 0 && data.description.length < 30) {
      console.warn(`description 过短(${data.description.length}): ${f}`);
    }
  } catch (e) {
    console.error(`frontmatter 解析失败: ${f}\n  ${String(e.message).split("\n")[0]}`);
    errors++;
  }
}
console.log(errors ? `共 ${errors} 个错误` : "frontmatter 校验通过");
process.exit(errors ? 1 : 0);
