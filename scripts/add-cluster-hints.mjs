/**
 * A组 内链收敛（不删页、不跳转）：给词群内的次要页顶部加一条导航提示，
 * 指向该词群的主页，帮助搜索引擎识别主次，减少关键词内耗。
 * 提示插入在 frontmatter 之后、第一个标题之前；标记 <!-- cluster-hint --> 避免重复插入。
 */
import fs from "fs";

const hints = {
  "docs/airport/one-yuan-airport-cost-2026.md":
    "> 本页聚焦“低价套餐真实成本怎么算”。想直接看按价格排序的机场清单，请看[性价比机场排行](/airport/best-value)；按预算挑便宜机场看[便宜机场推荐](/airport/cheap-airport)。",
  "docs/proxy/cost-effective-airport-guide.md":
    "> 本页讲高性价比机场的选购方法。想直接看按起步价排序的机场清单，请看[性价比机场排行](/airport/best-value)；需要逐项对比价格与线路，看[机场对比](/airport/compare)。",
  "docs/proxy/airport-keyword-guide-2026.md":
    "> 本页解释“机场推荐、稳定、便宜、性价比”等关键词分别该怎么看。想看具体机场榜单，请看[稳定机场推荐](/airport/best-airport-2026)与[性价比机场排行](/airport/best-value)。",
  "docs/proxy/vpn-guide.md":
    "> 本页讲机场选购的判断方法。想看梯子/VPN 的完整推荐与类型对比，请看[梯子推荐指南](/proxy/tizi-guide-2026)与[VPN 推荐指南](/proxy/vpn-tuijian-2026)。",
};

let n = 0;
for (const [file, hint] of Object.entries(hints)) {
  let t = fs.readFileSync(file, "utf8");
  const crlf = t.includes("\r\n");
  t = t.replace(/\r\n/g, "\n");
  if (t.includes("<!-- cluster-hint -->")) {
    // 更新已有提示
    t = t.replace(/<!-- cluster-hint -->\n>.*(\n>.*)*/, `<!-- cluster-hint -->\n${hint}`);
  } else {
    const m = t.match(/^---\n[\s\S]*?\n---\n/);
    if (!m) { console.log("NO frontmatter:", file); continue; }
    t = t.slice(0, m[0].length) + `\n<!-- cluster-hint -->\n${hint}\n` + t.slice(m[0].length).replace(/^\n+/, "\n");
  }
  fs.writeFileSync(file, crlf ? t.replace(/\n/g, "\r\n") : t);
  console.log("hint added:", file);
  n++;
}
console.log(`total: ${n}`);
