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
const previousNames = new Map(previous.map((p) => [p.slug, p.name]));

const airports = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const slug = file.replace(/\.md$/, "");
  const text = fs.readFileSync(path.join(dir, file), "utf8");
  const { fm, body } = readFm(text);
  // 兼容“机场怎么样”和“机场测评：”标题；已收录的机场改名后仍保留跳转。
  const reviewTitle = (fm.title || "").match(/^(.{1,12}?)(?:机场)?(?:怎么样|测评[：:])/);
  if (!reviewTitle && !previousNames.has(slug)) continue;

  const name = reviewTitle?.[1] || previousNames.get(slug) || slug;

  // 注册链接：出现次数最多、且看起来是邀请/注册地址的外链
  const urls = [...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]).filter((u) => !u.includes("t.me") && AFF.test(u));
  const freq = new Map();
  urls.forEach((u) => freq.set(u, (freq.get(u) || 0) + 1));
  const affiliateUrl = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || previousAff.get(slug) || "";

  const priceLine = (body.match(/价格区间\*{0,2}[：:]\s*(.+)/) || [])[1]?.trim() || "";
  const firstPrice = (priceLine.match(/¥\s*(\d+(?:\.\d+)?)/) || [])[1];
  // 排除纯年份和 Markdown 链接边界，避免把“[机场优惠码](/airport/...)”识别成优惠码。
  const couponRaw = (body.match(/优惠码[^A-Za-z0-9\n\]]{0,6}\**`?([A-Za-z0-9][A-Za-z0-9-]{2,15})`?\**/) || [])[1] || "";
  const coupon = /^20\d\d$/.test(couponRaw) ? "" : couponRaw;
  // 页面开头出现跑路/停服警告的，只进预警列表，不进对比、性价比、优惠码
  const status = /跑路|停止服务|已停服/.test(body.slice(0, 800)) ? "warning" : "active";
  const lines = [];
  ["IPLC", "IEPL", "BGP", "Anycast", "ANYCAST", "中转", "专线"].forEach((k) => body.includes(k) && lines.push(k.toUpperCase() === "ANYCAST" ? "Anycast" : k));
  const unlimitedDevice = /不限设备|不限制设备|设备不限/.test(body);

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
    unlimitedDevice,
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
