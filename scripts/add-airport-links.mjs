/**
 * 给与“机场推荐/梯子推荐/机场节点/VPN推荐”相关、但正文里没有链到 /airport/ 的页面，
 * 在首段之后各加一句有语境的内链。
 *
 * 规则：
 *  - 每页只加一句，文字按页面主题单独写，不是整块重复
 *  - 页面正文已有 /airport/ 链接的不再添加
 *  - 用 <!-- internal-link:airport --> 标记，可重复运行（已加过则跳过）
 * 用法: node scripts/add-airport-links.mjs [--dry]
 */
import fs from "fs";

const DRY = process.argv.includes("--dry");
const MARK = "<!-- internal-link:airport -->";

// 主题页：每页一句，锚文本在 机场推荐 / 梯子推荐 / 机场节点 / VPN推荐 之间分散
const custom = {
  "docs/airport/client-windows.md": "还没有机场订阅？先看[机场推荐](/airport/)选好服务，再回来按本文导入节点。",
  "docs/airport/client-ios.md": "使用小火箭前需要有可用的订阅，可先参考[机场推荐与节点评测](/airport/)。",
  "docs/airport/client-android.md": "安卓端配置完成后需要订阅才能使用，[机场节点推荐](/airport/)可作参考。",
  "docs/airport/software.md": "客户端装好后还需要订阅，可先看[机场推荐](/airport/)里的价格与线路对比。",
  "docs/airport/choose-guide.md": "避开这些坑之后，可以到[机场推荐总览](/airport/)按价格和线路筛选。",
  "docs/airport/apple-id-shared.md": "小火箭装好后仍需要可用的节点订阅，可参考[机场推荐](/airport/)。",
  "docs/airport/paolu.md": "避开风险机场后，可到[机场推荐](/airport/)查看仍在正常运营的机场。",
  "docs/airport/reviews.md": "想直接对比价格与线路？查看[机场推荐总览](/airport/)和[机场对比](/airport/compare)。",
  "docs/proxy/anytls-guide.md": "想知道哪些机场提供这类协议和线路，可在[机场节点推荐](/airport/)里逐家查看。",
  "docs/proxy/clash-verge-mihomo-october-2026.md": "客户端更新后仍需要订阅节点，可参考[机场推荐](/airport/)。",
  "docs/proxy/clients.md": "选好客户端后，可到[机场推荐](/airport/)挑选订阅。",
  "docs/proxy/proton-nord-urban-vpn-guide.md": "如果你更看重访问海外网站而不是隐私保护，也可以参考[VPN推荐：机场节点评测](/airport/)。",
  "docs/proxy/shadowrocket-windows.md": "无论使用哪个客户端，都需要可用节点，可先看[机场推荐与评测](/airport/)。",
  "docs/proxy/windows-vpn-connection-types.md": "这类企业或远程办公 VPN 不用于翻墙；如果需要科学上网，可参考[VPN机场推荐](/airport/)。",
  "docs/proxy/xiaohuo-jian-guide-2026.md": "小火箭需要配合节点订阅使用，[梯子推荐：机场评测](/airport/)可作参考。",
  "docs/faq/README.md": "还没选好机场？先看[机场推荐总览](/airport/)。",
};

// 机场评测页不添加：它们已通过面包屑、侧栏和导航链到 /airport/，再加同一句话只会造成模板化重复

const hasAirportLink = (body) => /\]\(\/airport\/?(?:[#?][^)]*)?\)/.test(body);

const insertAfterIntro = (text, line) => {
  const fm = text.match(/^---\n[\s\S]*?\n---\n/);
  const start = fm ? fm[0].length : 0;
  const lines = text.slice(start).split("\n");
  let i = 0;
  let inContainer = false;
  let inFence = false;
  for (; i < lines.length; i++) {
    const l = lines[i];
    if (/^```/.test(l)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^:::/.test(l)) { inContainer = l.trim() === ":::" ? false : true; continue; }
    if (inContainer) continue;
    if (l.trim() === "" || /^(#|>|\||-|\*|\d+\.|<|!\[|\s|---)/.test(l)) continue;
    break; // 找到第一个正文段落
  }
  if (i >= lines.length) return null;
  while (i < lines.length && lines[i].trim() !== "") i++;
  lines.splice(i, 0, "", `${MARK}`, `> 延伸阅读：${line}`);
  return text.slice(0, start) + lines.join("\n");
};

let added = 0;
let skipped = [];
for (const [file, sentence] of Object.entries(custom)) {
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const text = raw.replace(/\r\n/g, "\n");
  if (text.includes(MARK)) { skipped.push([file, "已添加"]); continue; }
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, "");
  if (hasAirportLink(body)) { skipped.push([file, "正文已有链接"]); continue; }
  const out = insertAfterIntro(text, sentence);
  if (!out) { skipped.push([file, "找不到正文段落"]); continue; }
  added++;
  if (DRY) console.log(`+ ${file}\n    > 延伸阅读：${sentence}`);
  else fs.writeFileSync(file, crlf ? out.replace(/\n/g, "\r\n") : out);
}
console.log(`${DRY ? "[预览] " : ""}新增 ${added} 页；跳过 ${skipped.length} 页`);
skipped.forEach(([f, why]) => console.log(`  跳过 ${f}（${why}）`));
