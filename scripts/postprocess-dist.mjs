/**
 * 构建后处理（在 vuepress build 之后运行）：
 * 1. 给联盟/推广外链加 rel="sponsored nofollow noopener"
 *    （/go/ 跳转、airports.json 中的注册链接域名、airportgo.org）
 * 2. 写入 _headers：/go/* 不索引、不跟踪
 * 3. 从 sitemap.xml 删除 noindex 页面以外仍可能出现的辅助页（兜底）
 */
import fs from "fs";
import path from "path";

const dist = path.resolve("docs/.vuepress/dist");
if (!fs.existsSync(dist)) {
  console.warn("postprocess-dist: dist 不存在，已跳过");
  process.exit(0);
}

const hosts = new Set(["airportgo.org"]);
const airportsFile = path.resolve("docs/.vuepress/data/airports.json");
if (fs.existsSync(airportsFile)) {
  for (const a of JSON.parse(fs.readFileSync(airportsFile, "utf8"))) {
    if (a.affiliateUrl) hosts.add(new URL(a.affiliateUrl).hostname);
  }
}

// 带推广参数的链接（?aff= / ?ref= / ?code= / ?invite=）同样视为推广链接
const PROMO_PARAM = /[?&](aff|ref|code|invite)=/i;
const isSponsored = (href) => {
  if (/^https?:/i.test(href) && PROMO_PARAM.test(href)) return true;
  if (/^https?:\/\/clash-jichang\.com\/go\//.test(href) || href.startsWith("/go/")) return true;
  try {
    return hosts.has(new URL(href).hostname);
  } catch {
    return false;
  }
};

let changedFiles = 0;
let changedLinks = 0;
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) rewrite(p);
  }
};

const REL = "sponsored nofollow noopener";
const rewrite = (file) => {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(/<a\b([^>]*?)>/g, (tag, attrs) => {
    const href = (attrs.match(/\shref="([^"]*)"/) || [])[1];
    if (!href || !isSponsored(href)) return tag;
    changedLinks++;
    if (/\srel="/.test(attrs)) return `<a${attrs.replace(/\srel="[^"]*"/, ` rel="${REL}"`)}>`;
    return `<a${attrs} rel="${REL}">`;
  });
  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles++;
  }
};
walk(dist);
console.log(`postprocess-dist: rel 已写入 ${changedLinks} 个链接（${changedFiles} 个文件）`);

fs.writeFileSync(path.join(dist, "_headers"), "/go/*\n  X-Robots-Tag: noindex, nofollow\n");

const sitemapPath = path.join(dist, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const skip = /<loc>https:\/\/clash-jichang\.com\/(tag|category|article|timeline|star)(\/|<)|<loc>https:\/\/clash-jichang\.com\/(stats)(\.html)?<\/loc>/;
  let removed = 0;
  const out = xml.replace(/<url>[\s\S]*?<\/url>/g, (u) => (skip.test(u) ? (removed++, "") : u));
  fs.writeFileSync(sitemapPath, out);
  console.log(`postprocess-dist: sitemap 兜底移除 ${removed} 个辅助页`);
}
