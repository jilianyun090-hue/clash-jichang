/**
 * 由 docs/.vuepress/data/airports.json 生成：
 *   docs/airport/{compare,best-value,coupons,brands}.md
 *   docs/.vuepress/public/_redirects        (/go/<slug> 联盟跳转，Cloudflare Pages 格式)
 * 并把 docs/**\/*.md 中的联盟外链改写为 https://clash-jichang.com/go/<slug>
 *
 * 先运行 node scripts/build-airport-data.mjs，再运行本脚本。可重复运行：
 * 已改写的链接不会再匹配，生成页每次整体覆盖。
 */
import fs from "fs";
import path from "path";

const SITE = "https://clash-jichang.com";
const TODAY = "2026-10-20";
const airports = JSON.parse(fs.readFileSync("docs/.vuepress/data/airports.json", "utf8"));
const active = airports.filter((a) => a.status === "active");
const warning = airports.filter((a) => a.status === "warning");

const price = (a) => (a.fromMonthly != null ? `¥${a.fromMonthly}/月起` : "见评测页");
const lines = (a) => (a.lineTypes.length ? a.lineTypes.join(" / ") : "见评测页");
const go = (a) => (a.affiliateUrl ? `[官网](${SITE}/go/${a.slug})` : "—");

const frontmatter = (title, description, keywords) => `---
title: "${title}"
description: "${description}"
head:
  - - meta
    - name: keywords
      content: ${keywords}
category: 机场推荐
date: ${TODAY}
---
<!-- 本页由 scripts/generate-airport-pages.mjs 生成，请修改评测页或脚本后重新生成，不要手工编辑 -->
`;

const DISCLOSURE = `> **推广披露**：本站部分“官网”链接为推广链接，用户通过链接购买时本站可能获得佣金，不影响你的购买价格。详见[推广披露与独立性声明](/disclosure)。`;
const NOTE = `> **数据说明**：价格取自各机场评测页中的“价格区间”，为月均起价，未必对应你所需的流量与设备数，实际价格、流量和优惠以机场官网为准。线路类型来自评测页正文中出现的线路描述，并非逐家复测结果。`;

const write = (file, content) => {
  fs.writeFileSync(path.join("docs/airport", file), content);
  console.log("generated", file);
};

// 对比页
write(
  "compare.md",
  frontmatter(
    "2026机场对比：起步价格、线路类型与优惠码一览",
    `机场对比表汇总${active.length}家评测页的起步月价、线路类型、优惠码和评测更新日期，可按预算快速比较直连、BGP、IPLC/IEPL等方案，并点击机场名称查看完整评测，购买前还可核对流量、设备数和退款规则。`,
    "机场对比,机场价格对比,机场线路对比,IPLC机场,IEPL机场,机场优惠码",
  ) +
    `
## 2026机场对比：起步价格、线路类型与优惠码一览

${NOTE}

${DISCLOSURE}

| 机场 | 起步价 | 线路 | 优惠码 | 评测更新 | 官网 |
| :--- | :--- | :--- | :--- | :--- | :--- |
${active.map((a) => `| [${a.name}](${a.path}) | ${price(a)} | ${lines(a)} | ${a.coupon ? `\`${a.coupon}\`` : "—"} | ${a.date} | ${go(a)} |`).join("\n")}

## 按需求快速筛选

下面按常见需求从上表中筛出候选，条件来自评测页中的线路描述、起步价和设备说明；具体可用性请以服务商官网和个人测试为准。

### 专线机场（IPLC / IEPL） {#special-line}

对稳定性要求高、看重晚高峰表现的用户优先看专线。原理见[IEPL/IPLC 专线对比](/airport/iepl-iplc)。

${active.filter((a) => a.lineTypes.some((l) => l === "IPLC" || l === "IEPL")).map((a) => `- [${a.name}](${a.path})（${price(a)}，${lines(a)}）`).join("\n") || "- 暂无"}

### 不限设备机场 {#unlimited-device}

全家多设备、宿舍或路由器共享可优先看不限设备数的机场（以评测页与官网说明为准）。

${active.filter((a) => a.unlimitedDevice).map((a) => `- [${a.name}](${a.path})（${price(a)}）`).join("\n") || "- 暂无"}

### 低价入门机场（起步 ¥10/月以内） {#budget}

预算有限或第一次尝试，先用低价月付试水。更系统的比较见[性价比机场排行](/airport/best-value)与[便宜机场推荐](/airport/cheap-airport)。

${active.filter((a) => a.fromMonthly != null && a.fromMonthly <= 10).map((a) => `- [${a.name}](${a.path})（${price(a)}，${lines(a)}）`).join("\n") || "- 暂无"}

### ChatGPT / Netflix 等解锁需求 {#unlock}

多数机场宣称支持 ChatGPT、Netflix 等平台，但解锁随 IP 和地区变化，**务必先用月付套餐实际登录目标平台测试**。解锁原理见[流媒体解锁指南](/proxy/streaming-unlock-guide)，AI 使用见[AI 指南](/ai/)。上表中线路为专线的机场通常更适合对地区识别敏感的服务。

## 怎么用这张表

- **只看价格会选错**：低价套餐往往流量少、设备数少，先到评测页确认流量、设备数和退款规则。
- **线路类型**决定晚高峰体验，区别见[IEPL/IPLC 专线对比](/airport/iepl-iplc)和[线路类型指南](/proxy/line-type-guide)。
- 想按预算挑，直接看[性价比机场排行](/airport/best-value)；想核对优惠，看[机场优惠码](/airport/coupons)。
- 已出现跑路或失联迹象的机场不在表内，见[跑路预警名单](/airport/paolu)。
- 想从头了解怎么选，回到[机场推荐总览](/airport/)。
`,
);

// 性价比页
const byPrice = active.filter((a) => a.fromMonthly != null);
write(
  "best-value.md",
  frontmatter(
    "2026性价比机场排行：按起步月价从低到高",
    `性价比机场排行按评测页起步月均价整理${byPrice.length}家机场，展示线路类型、流量与独立评测入口；同时提醒倍率、设备数、退款规则、年付折算和低价套餐的真实使用成本，适合学生党与预算有限的用户先做月付比较。`,
    "性价比机场,便宜机场推荐,低价机场,月付机场,学生党机场",
  ) +
    `
## 2026性价比机场排行：按起步月价从低到高

${NOTE}

${DISCLOSURE}

| 排序 | 机场 | 起步价 | 线路 | 评测 |
| :--- | :--- | :--- | :--- | :--- |
${byPrice.map((a, i) => `| ${i + 1} | ${a.name} | ${price(a)} | ${lines(a)} | [查看评测](${a.path}) |`).join("\n")}

## 排序只按价格，购买前还要核对

1. **流量与设备数**：起步价通常对应小流量、少设备的套餐。
2. **付款周期**：折合月价多为年付，年付一般不支持退款；建议先买月付试用。
3. **跑路风险**：低价且要求预付长周期的套餐风险更高，参考[跑路预警](/airport/paolu)。

更完整的选购方法见[机场推荐总览](/airport/)、[便宜机场推荐](/airport/cheap-airport)、[一元机场真实成本](/airport/one-yuan-airport-cost-2026)和[稳定机场排行榜](/airport/best-airport-2026)。
`,
);

// 优惠码页
const withCoupon = active.filter((a) => a.coupon);
write(
  "coupons.md",
  frontmatter(
    "2026机场优惠码：已收录优惠码与使用说明",
    `整理机场评测页中已出现的优惠码、适用机场和对应评测入口，标注页面更新时间与使用提醒；优惠可能随时失效，注册或付款前请在机场官网结算页核对适用套餐、折扣金额和有效期。`,
    "机场优惠码,机场折扣码,机场优惠,机场注册优惠",
  ) +
    `
## 2026机场优惠码：已收录优惠码与使用说明

${DISCLOSURE}

以下优惠码来自各机场评测页，“评测更新”是该评测页的更新日期，**不代表优惠码在该日期被重新核对**。优惠码可能随时失效，请在结算页确认折扣后再付款。

| 机场 | 优惠码 | 评测更新 | 评测 | 官网 |
| :--- | :--- | :--- | :--- | :--- |
${withCoupon.map((a) => `| ${a.name} | \`${a.coupon}\` | ${a.date} | [查看评测](${a.path}) | ${go(a)} |`).join("\n")}

## 使用建议

- 在订单结算页的“优惠券/折扣码”输入框填写，应用后确认实付金额。
- 先看适用套餐，部分优惠码只适用于特定周期。
- 不要因为优惠力度大而直接买年付，先月付试用，见[购买前核查清单](/airport/clash-airport-purchase-checklist)。
- 如果某个优惠码已失效，欢迎通过[关于页](/about)的联系方式告知。
- 想先对比再决定，回到[机场推荐总览](/airport/)。
`,
);

// 机场库
write(
  "brands.md",
  frontmatter(
    "机场库：全部机场评测索引与风险状态",
    `机场库收录${active.length}家正常运营机场的独立评测入口，以及${warning.length}家风险预警记录；按名称、起步价格、线路类型和风险状态快速查找，并查看每篇评测的实际更新日期、订阅限制与购买前核查提示。`,
    "机场库,机场大全,机场评测索引,机场列表",
  ) +
    `
## 机场库：全部机场评测索引与风险状态

**快速入口**：查看[机场测评合集](/airport/reviews)，或按名称在下方索引中查找单独评测页。

${NOTE}

## 正常运营的机场（${active.length}）

| 机场 | 起步价 | 线路 | 评测更新 |
| :--- | :--- | :--- | :--- |
${[...active].sort((a, b) => a.name.localeCompare(b.name, "zh-CN")).map((a) => `| [${a.name}](${a.path}) | ${price(a)} | ${lines(a)} | ${a.date} |`).join("\n")}

## 已跑路或出现预警的机场（${warning.length}）

${warning.map((a) => `- [${a.name}](${a.path})：详见[跑路预警名单](/airport/paolu)`).join("\n")}

对比、性价比和优惠码页面不收录以上机场。想按用途挑选，请看[机场推荐总览](/airport/)。
`,
);

// /go 跳转表与链接改写
// 已下线栏目的旧地址 301 到最相关的现有页面
const redirects = ["/streaming/* /proxy/streaming-unlock-guide 301"];
for (const a of airports.filter((x) => x.affiliateUrl && x.status === "active")) {
  redirects.push(`/go/${a.slug} ${a.affiliateUrl} 302`);
  redirects.push(`/go/${a.slug}/ ${a.affiliateUrl} 302`);
}
fs.writeFileSync("docs/.vuepress/public/_redirects", redirects.join("\n") + "\n");
console.log(`_redirects: ${(redirects.length - 1) / 2} brands + 1 static rule`);

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === ".vuepress" ? [] : walk(p);
    return e.name.endsWith(".md") ? [p] : [];
  });

let rewritten = 0;
let files = 0;
for (const file of walk("docs")) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const a of airports.filter((x) => x.affiliateUrl && x.status === "active")) {
    const n = text.split(a.affiliateUrl).length - 1;
    if (n) {
      text = text.split(a.affiliateUrl).join(`${SITE}/go/${a.slug}`);
      rewritten += n;
    }
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    files++;
  }
}
console.log(`rewrote ${rewritten} affiliate links in ${files} files`);
