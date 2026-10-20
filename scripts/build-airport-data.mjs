/**
 * 从 docs/airport/*.md 评测页中提取机场数据，输出 docs/.vuepress/data/airports.json
 * 只提取页面中已有的信息，提取不到的字段留空，不做任何推测或补全。
 * 用法: node scripts/build-airport-data.mjs
 */
import fs from "fs";
import path from "path";

const dir = path.resolve("docs/airport");
const outFile = path.resolve("docs/.vuepress/data/airports.json");

const AFF = /register|\/reg\b|\/reg\?|\/r\/|ref=|code=|aff|invite/i;

const readFm = (text) => {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (!m) return { fm, body: text };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return { fm, body: text.slice(m[0].length) };
};

// 联盟链接被改写为 /go/<slug> 后，页面里不再有原始地址，沿用上一次数据文件中的值
const previous = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf8")) : [];
const previousAff = new Map(previous.map((p) => [p.slug, p.affiliateUrl]));

const airports = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const { fm, body } = readFm(text);
  // 评测页：标题形如“XX怎么样？…”，榜单、教程页不收录
  if (!/^.{1,12}?(机场)?怎么样/.test(fm.title || "")) continue;

  const name = (fm.title.match(/^(.+?)(?:机场)?怎么样/) || [])[1] || slug;

  // 注册链接：出现次数最多、且看起来是邀请/注册地址的外链
  const urls = [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]).filter((u) => !u.includes("t.me") && AFF.test(u));
  const freq = new Map();
  urls.forEach((u) => freq.set(u, (freq.get(u) || 0) + 1));
  const affiliateUrl = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || previousAff.get(slug) || "";

  const priceLine = (body.match(/价格区间\*{0,2}[：:]\s*(.+)/) || [])[1]?.trim() || "";
  const firstPrice = (priceLine.match(/¥\s*(\d+(?:\.\d+)?)/) || [])[1];
  // 优惠码：排除纯年份（如“2026”），保留 2026-99 这类带连字符的码
  const couponRaw = (body.match(/优惠码[^A-Za-z0-9\n]{0,6}\**`?([A-Za-z0-9][A-Za-z0-9-]{2,15})`?\**/) || [])[1] || "";
  const coupon = /^20\d\d$/.test(couponRaw) ? "" : couponRaw;
  // 页面开头出现跑路/停服警告的，只进预警列表，不进对比、性价比、优惠码
  const status = /跑路|停止服务|已停服/.test(body.slice(0, 800)) ? "warning" : "active";
  const lines = [];
  ["IPLC", "IEPL", "BGP", "Anycast", "ANYCAST", "中转", "专线"].forEach((k) => body.includes(k) && lines.push(k.toUpperCase() === "ANYCAST" ? "Anycast" : k));

  airports.push({
    slug,
    name,
    title: fm.title,
    date: fm.date || "",
    path: `/airport/${slug}`,
    priceText: priceLine,
    fromMonthly: firstPrice ? Number(firstPrice) : null,
    coupon,
    status,
    affiliateUrl,
    lineTypes: [...new Set(lines)],
  });
}

airports.sort((a, b) => (a.fromMonthly ?? 1e9) - (b.fromMonthly ?? 1e9));
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(airports, null, 2) + "\n");
console.log(`airports: ${airports.length}`);
console.log(`with affiliateUrl: ${airports.filter((a) => a.affiliateUrl).length}`);
console.log(`with price: ${airports.filter((a) => a.fromMonthly != null).length}`);
console.log(`with coupon: ${airports.filter((a) => a.coupon).length}`);
console.log(`warning status: ${airports.filter((a) => a.status === "warning").map((a) => a.slug).join(",")}`);
console.log(`missing date: ${airports.filter((a) => !a.date).length}`);
