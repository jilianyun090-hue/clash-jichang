/**
 * 将评测页中没有真实测试支撑的“晚高峰丢包率与测速数据实测”整段（含数据表）
 * 替换为不含数字的“速度与稳定性说明”，并修正正文里指向该测试的表述。
 * 可重复运行。
 */
import fs from "fs";
import path from "path";

const dir = "docs/airport";
let sections = 0;
let phrases = 0;

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full, "utf8");
  const crlf = raw.includes("\r\n");
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  const start = lines.findIndex((l) => /^## 📊 .*(晚高峰|测速)/.test(l));
  if (start < 0) continue;

  const title = (raw.match(/^title:\s*"?(.*?)"?\s*$/m) || [])[1] || "";
  const name = (title.match(/^(.+?)(?:机场)?怎么样/) || [])[1] || "该机场";

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^---\s*$/.test(lines[i]) || /^## /.test(lines[i])) {
      end = i;
      break;
    }
  }

  const replacement = [
    "## 📊 速度与稳定性说明",
    "",
    `本站没有对${name}做标准化测速，因此不提供具体的速度、延迟和丢包数字。网络表现会因所在地区、运营商、时段和节点而不同，建议购买前这样自己判断：`,
    "",
    "1. **先买月付或体验套餐**，不要直接买年付。",
    "2. **在晚高峰（约 20:00–23:00）测试**常用节点的延迟和下载速度，观察是否稳定，而不是只看白天。",
    "3. **实际访问你要用的服务**（视频、AI、游戏等），确认是否可用，再决定是否续费。",
    "4. 对照[购买前核查清单](/airport/clash-airport-purchase-checklist)逐项确认，并参考[机场对比](/airport/compare)。",
  ];
  lines.splice(start, end - start, ...replacement, "");
  sections++;

  let text = lines.join("\n");
  const before = text;
  text = text
    .replace(/实测表现（包含晚高峰丢包与速度测试）/g, "线路架构")
    .replace(/\(根据晚高峰测试与稳定性评分\)/g, "(编辑主观评分，非标准化测试)")
    .replace(/（根据晚高峰测试与稳定性评分）/g, "（编辑主观评分，非标准化测试）");
  if (text !== before) phrases++;

  fs.writeFileSync(full, crlf ? text.replace(/\n/g, "\r\n") : text);
}
console.log(`replaced ${sections} benchmark sections, adjusted phrases in ${phrases} files`);
