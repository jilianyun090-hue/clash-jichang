/**
 * 更新 AI 页面里写死的旧模型版本。
 *
 * 已核实（2026-10 官方文档）：
 *   - Claude 当前系列：Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5
 *     https://platform.claude.com/docs/en/about-claude/models/overview
 *   - Grok 当前最新：grok-4.7（其后 4.6 / 4.5 / 4.3）
 *     https://docs.x.ai/docs/models
 * 无法核实（官方页面抓取失败）：GPT、Gemini、Midjourney、Cursor
 *   -> 不写新版本号，去掉旧版本号，改为“以官网/应用内显示为准”。
 * 价格与额度未逐项核实，页面加“以官网为准”提示，不改数字。
 * 可重复运行。
 */
import fs from "fs";
import path from "path";

const edit = (file, fn) => {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  const t = raw.replace(/\r\n/g, "\n");
  const out = fn(t);
  if (out !== t) {
    fs.writeFileSync(file, crlf ? out.replace(/\n/g, "\r\n") : out);
    console.log("edited", file);
  }
};

const insertAfterFirstParagraph = (t, marker, block) => {
  if (t.includes(marker)) return t; // 已插入
  const m = t.match(/^---\n[\s\S]*?\n---\n/);
  const start = m ? m[0].length : 0;
  // 找到正文第一个“普通段落”（非标题、非 :::、非图片、非空行）之后的空行
  const lines = t.slice(start).split("\n");
  let i = 0;
  while (i < lines.length && (lines[i].trim() === "" || /^(#|:::|!\[|>|<|\|)/.test(lines[i]))) i++;
  while (i < lines.length && lines[i].trim() !== "") i++;
  lines.splice(i, 0, "", block);
  return t.slice(0, start) + lines.join("\n");
};

// ---------- Claude ----------
edit("docs/ai/claude-guide.md", (t) => {
  t = t.replace(/content: Claude,Claude 3\.5,/, "content: Claude,Claude Opus 5.5,Claude Sonnet 5.5,");
  t = t.replace(/^Claude 3\.5 Sonnet /m, "Claude ");
  t = t.replace(/被多方评价为优于 GPT-4o/, "被不少用户评价为自然流畅");
  t = t.replace(/\| 模型 \| Claude 3\.5 Sonnet \(限量\) \| \*\*Claude 3\.5 Sonnet \(5x 额度\)\*\* \|/, "| 模型 | 以官方当前开放的模型为准（限量） | **可选模型更多，额度更高** |");
  t = insertAfterFirstParagraph(
    t,
    "## Claude 当前模型系列",
    `## Claude 当前模型系列

据 Anthropic 官方模型文档（2026 年 10 月核对），当前提供的系列如下：

| 模型 | 官方定位 |
| :--- | :--- |
| Claude Fable 5.1 | 面向高要求的推理与长时程智能体任务 |
| Claude Opus 5.5 | 长时间运行的智能体编程与知识工作，官方建议大多数场景优先从它开始 |
| Claude Sonnet 5.5 | 速度与智能的最佳平衡 |
| Claude Haiku 5.5 | 高并发、低延迟任务，如分类、提取和路由 |

以上为 API 文档中的模型列表；网页版和 App 中实际可选的模型、各套餐的额度与价格会不同，请以 [claude.ai](https://claude.ai) 与官方定价页为准。来源：[Anthropic 模型总览](https://platform.claude.com/docs/en/about-claude/models/overview)。`,
  );
  return t;
});

// ---------- Grok ----------
edit("docs/ai/grok-guide.md", (t) => {
  t = t.replace(/^title: ".*"$/m, 'title: "Grok AI国内怎么用？2026最新Grok官网使用与注册保姆级教程"');
  t = t.replace(/content: Grok 4,Grok AI/, "content: Grok,Grok AI");
  t = t.replace(/\*\*Grok 4 Code\*\*/g, "**代码能力**");
  t = t.replace(/\| Grok 4 额度 \|/g, "| Grok 额度 |");
  t = t.replace(/Grok 4 免费版能用多少次/g, "Grok 免费版能用多少次");
  t = t.replace(/\| 对比 \| Grok 4 \| ChatGPT \(GPT-4o\) \| Claude 3\.5 \| Gemini \|/, "| 对比 | Grok | ChatGPT | Claude | Gemini |");
  t = t.replace(/\| 图像生成 \| 支持 \| DALL-E 3 \| 不支[^|]*\| Imagen 3 \|/, "| 图像生成 | 支持 | 支持 | 不支持 | 支持 |");
  t = t.replace(/\[Claude 3\.5 使用攻略\]/g, "[Claude 使用攻略]");
  t = t.replace(/Grok 4 (?=在推理|是)/g, "Grok ");
  t = t.replace(/Grok 4(?![.\d])/g, "Grok");
  t = insertAfterFirstParagraph(
    t,
    "## Grok 当前模型",
    `## Grok 当前模型

据 xAI 官方模型文档（2026 年 10 月核对），文本模型中最新、能力最强的是 **grok-4.7**，其后依次为 grok-4.6、grok-4.5、grok-4.3。另有图像（grok-imagine-image 系列）、视频（grok-imagine-video 系列）和语音模型。网页版与 App 里实际可用的模型、额度和价格以 [grok.com](https://grok.com) 与官方订阅页为准。来源：[xAI 模型文档](https://docs.x.ai/docs/models)。`,
  );
  return t;
});

// ---------- ChatGPT ----------
edit("docs/ai/chatgpt.md", (t) => {
  t = t.replace(/ChatGPT镜像站,GPT-4,OpenAI/, "ChatGPT镜像站,GPT,OpenAI");
  t = t.replace(/^  - GPT-4o$/m, "  - GPT");
  t = t.replace(/支持 GPT-4o、Claude、Gemini 多模型/g, "支持 GPT、Claude、Gemini 等多模型");
  t = t.replace(/\| GPT-4o, Claude, Gemini \|/g, "| GPT、Claude、Gemini 等 |");
  t = t.replace(/\| GPT-4o \+ 多模型 \|/g, "| GPT 等多模型 |");
  t = t.replace(/如果您需要 GPT-4o 的强大性能/g, "如果您需要 Plus 套餐中的旗舰模型");
  t = t.replace(/\| GPT-4o \| 有限制 \|/g, "| 旗舰模型（以官网为准） | 有限制 |");
  t = t.replace(/\| DALL-E 生图 \|/g, "| 图像生成 |");
  t = insertAfterFirstParagraph(
    t,
    "::: tip 关于模型版本",
    `::: tip 关于模型版本
OpenAI 的模型名称、各套餐可用的模型和额度更新很快，本页不再写死具体版本号，请以 [chatgpt.com](https://chatgpt.com) 应用内显示和 OpenAI 官方说明为准。
:::`,
  );
  return t;
});

// ---------- Gemini ----------
edit("docs/ai/gemini.md", (t) => {
  t = t.replace(/Gemini Ultra\/Pro\/Nano 版本差异/, "Gemini 各模型系列的差异");
  t = t.replace(/的能力远超 GPT-4/, "的能力是其主要卖点");
  t = t.replace(/Gemini 1\.5 Pro 支持 100 万 token 上下文/, "Gemini 系列主打超长上下文，具体长度以官方文档为准");
  t = t.replace(/同时支持 Gemini、GPT-4o、Claude 多模型切换/g, "同时支持 Gemini、GPT、Claude 等多模型切换");
  t = t.replace(/\| 维度 \| Gemini Ultra \|/, "| 维度 | Gemini |");
  t = t.replace(/\| \*\*最强模型\*\* \| Gemini 2\.0 \| GPT-4o \| Claude 3\.5 Sonnet \|/, "| **最强模型** | 以 Google 官网为准 | 以 OpenAI 官网为准 | Claude Opus 5.5 / Fable 5.1 |");
  t = t.replace(/\| \*\*长上下文\*\* \| \*\*100万 token\*\* \| 128K token \| 200K token \|/, "| **长上下文** | 以官方文档为准 | 以官方文档为准 | 1M token（API） |");
  t = insertAfterFirstParagraph(
    t,
    "::: tip 关于模型版本",
    `::: tip 关于模型版本
Google 的 Gemini 模型名称、订阅套餐名称和额度调整较快，本页不再写死版本号，请以 [gemini.google.com](https://gemini.google.com) 和 Google 官方说明为准。
:::`,
  );
  return t;
});

// ---------- Midjourney ----------
edit("docs/ai/midjourney-guide.md", (t) => {
  t = t.replace(/V6 版本新功能详解/, "版本差异与参数说明");
  t = t.replace(/与 DALL-E 3、Stable Diffusion 的对比/, "与其他 AI 绘图工具的对比");
  t = insertAfterFirstParagraph(
    t,
    "::: tip 关于模型版本",
    `::: tip 关于模型版本
Midjourney 会持续发布新版本，默认版本和可用参数以其官方文档与更新日志为准（可在 [updates.midjourney.com](https://updates.midjourney.com/) 查看），本页不再写死具体版本号。
:::`,
  );
  return t;
});

// ---------- Cursor ----------
edit("docs/ai/cursor-guide.md", (t) => {
  t = t.replace(/GPT-4编程,Claude编程/, "AI模型,AI编程助手");
  t = t.replace(/内置 GPT-4 和 Claude 等顶级 AI 模型/, "内置多家厂商的主流 AI 模型（具体列表以 Cursor 内显示为准）");
  t = t.replace(/\| \*\*多模型支持\*\* \| GPT-4, Claude, 自定义 \| 仅 GPT-4 \|/, "| **多模型支持** | 多厂商模型可切换，可自定义 | 取决于所订阅的 Copilot 套餐 |");
  return t;
});

// ---------- AI 导航页与其它页面的零散提及 ----------
edit("docs/ai/README.md", (t) =>
  t
    .replace(/\| GPT-4o, Claude, Gemini \|/g, "| GPT、Claude、Gemini 等 |")
    .replace(/\| Claude 3\.5 Sonnet \|/g, "| Claude |")
    .replace(/\| Gemini Pro \|/g, "| Gemini |"),
);

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === ".vuepress" ? [] : walk(p);
    return e.name.endsWith(".md") ? [p] : [];
  });

// 合租页等：只改产品/套餐名称里的旧版本号，不动价格
for (const f of walk("docs")) {
  if (f.includes("xisu-ai-review")) continue; // 该页描述的是中转站当前目录，不改
  edit(f, (t) =>
    t
      .replace(/Claude 3\.5 Sonnet 高级版/g, "Claude Pro 套餐")
      .replace(/共享\/独享车位 \(GPT-4o\)/g, "共享/独享车位")
      .replace(/\[Claude 3\.5 使用攻略\]/g, "[Claude 使用攻略]")
      .replace(/Claude 3\.5 Sonnet/g, "Claude")
      .replace(/Claude 3\.5/g, "Claude")
      .replace(/GPT-4o/g, "GPT"),
  );
}
