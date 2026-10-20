/**
 * 清理 2026-05-24 批量 SEO 改动中无法核实的表述，并修正与正文不符的描述。
 * 不新增任何数据；可重复运行。
 */
import fs from "fs";
import path from "path";

const COUNT = 36; // 与 airports.json 中正常运营的评测页数量一致

const edit = (file, fn) => {
  let t = fs.readFileSync(file, "utf8");
  const crlf = t.includes("\r\n");
  t = t.replace(/\r\n/g, "\n");
  const out = fn(t);
  if (out !== t) {
    fs.writeFileSync(file, crlf ? out.replace(/\n/g, "\r\n") : out);
    console.log("edited", file);
  }
};

// 1. 稳定机场排行榜：去掉无法核实的测试周期、权重、综合评分
edit("docs/airport/best-airport-2026.md", (t) => {
  t = t.replace(/深度实测对比35家翻墙服务商/, `汇总本站收录的${COUNT}家翻墙服务商信息`);
  t = t.replace(/我们连续多周对 34 家主流翻墙服务商进行了自费测试与\*\*深度机场测评\*\*。/, `我们整理了本站收录的 ${COUNT} 家主流机场的价格、线路与评测信息。`);
  t = t.replace(/本排行榜中的所有服务商均经过\*\*至少连续7天[^\n]*\n/, "**排序说明**：下列排序是本站编辑综合线路类型、价格、套餐灵活性和评测页信息后的判断，不是标准化测试得分；速度和解锁情况因地区、运营商和时段而异，购买前请先用月付或试用套餐自行测试。\n");
  // 独占一行的“综合评分”整行删除；与价格同行的去掉评分前缀
  t = t.replace(/^\s*\* \*\*综合评分\*\*：[\d.]+ ?\/ ?10\s*\n/gm, "");
  t = t.replace(/\*\*综合评分\*\*：[\d.]+ ?\/ ?10 \| /g, "");
  t = t.replace(/本文主要针对 TOP 13 优质专线机场进行深度横向评分与排行榜解析。/, "本文列出其中排名靠前的机场及选择理由。");
  t = t.replace(/我们还对以下 24 家各具特色的机场进行了测试，它们同样能够满足/, "以下 24 家机场同样收录于本站，可以满足");
  return t;
});

// 2. 便宜机场页
edit("docs/airport/cheap-airport.md", (t) => {
  t = t.replace(/所有机场均\*\*经过实际测速\*\*，拒绝纯广告机场，价格真实可查。/, "价格取自各机场评测页，实际价格以官网为准；部分链接为推广链接，详见[推广披露](/disclosure)。");
  t = t.replace(/\n\*\*实测体验\*\*：[^\n]*\n/g, "\n");
  t = t.replace(/全部经过实测验证稳定可用/g, "价格与线路信息来自各评测页");
  t = t.replace(/34家精选/g, `${COUNT}家`);
  return t;
});

// 3. 线路对比页
edit("docs/airport/iepl-iplc.md", (t) => {
  t = t.replace(/本文用一张表格 \+ 真实测速数据，帮你5分钟看懂机场线路/, "本文用一张表格帮你5分钟看懂机场线路");
  t = t.replace(/以下机场均经过实测验证，线路类型真实可查：/, "以下线路类型取自各机场评测页中的描述，购买前请向机场确认并自行测试：");
  t = t.replace(/24家机场推荐列表（含详细价格和实测数据）/, "全部机场评测列表（含价格与线路信息）");
  t = t.replace(/24家精选/g, `${COUNT}家`);
  t = t.replace(/(查看完整)24家/g, `$1${COUNT}家`);
  return t;
});

// 4. 评测页页脚套话：21 / 24 家“综合实测比对”
const dir = "docs/airport";
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
  edit(path.join(dir, f), (t) =>
    t
      .replace(/—— 综合实测比对行业前 21 家优质科学上网梯子。/g, `—— 本站收录的全部 ${COUNT} 家机场评测与价格线路对照。`)
      .replace(/—— 纵览瞬云在内的24家主流实测机场排行。/g, `—— 本站收录的全部 ${COUNT} 家机场评测与价格线路对照。`),
  );
}

// 5. 其他页面的数量统一
edit("docs/proxy/fanqiang-guide.md", (t) => t.replace(/24家精选/g, `${COUNT}家`));
edit("docs/proxy/letsvpn-shutdown.md", (t) => t.replace(/21家稳定高性价比精选/g, `${COUNT}家`).replace(/24家稳定高性价比精选/g, `${COUNT}家`));
edit("docs/proxy/vpn-tuijian-2026.md", (t) => t.replace(/34家实测对比/g, `${COUNT}家评测汇总`));

// 6. AI 页描述与正文/标题对齐，去掉过时的模型版本号
const setDesc = (file, desc) =>
  edit(file, (t) => t.replace(/^description: ".*"$/m, `description: "${desc}"`));

setDesc("docs/ai/chatgpt.md", "ChatGPT 国内使用指南：官网注册与漫游流程的注意事项、国内镜像站选择、Plus 订阅方式，以及提高回答质量的提示词写法。");
setDesc("docs/ai/claude-guide.md", "Claude 注册与国内访问指南：账号注册流程、访问网络要求、订阅方式，以及 Claude 在写作、代码和长文本处理上的使用技巧。");
setDesc("docs/ai/grok-guide.md", "Grok 国内使用指南：X 平台账号注册、访问网络要求、联网搜索与对话风格特点，以及与 ChatGPT、Claude 的使用差异。");
setDesc("docs/ai/cursor-guide.md", "Cursor AI 代码编辑器使用指南：安装配置、代码补全与 Chat 编程用法、与 GitHub Copilot 的区别，以及订阅方案的选择。");

// 7. 站点 logo 的 alt 文本不要堆关键词
edit("docs/.vuepress/theme.mjs", (t) => t.replace(/logoAlt: "[^"]*"/, 'logoAlt: "Clash机场推荐指南"'));
