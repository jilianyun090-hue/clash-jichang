/**
 * 第二批 AI 页修订：去掉过时的套餐价格/功能表述与无法核实的绝对化宣传。
 * 已核实来源见 update-model-mentions.mjs 的注释；其余一律改为“以官方为准”。
 */
import fs from "fs";

const edit = (file, pairs) => {
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let t = raw.replace(/\r\n/g, "\n");
  let miss = 0;
  for (const [from, to] of pairs) {
    if (!t.includes(from)) { miss++; console.warn(`  未找到: ${from.slice(0, 40)}`); continue; }
    t = t.replace(from, to);
  }
  fs.writeFileSync(file, crlf ? t.replace(/\n/g, "\r\n") : t);
  console.log(`edited ${file} (未匹配 ${miss})`);
};

edit("docs/ai/midjourney-guide.md", [
  ["Midjourney 是目前最强大的 AI 图像生成工具之一，通过文字描述（Prompt）即可生成高质量、风格多样的图像。无论你是设计师、插画师还是普通用户，都能用它创作令人惊叹的视觉作品。",
   "Midjourney 是一款 AI 图像生成工具，通过文字描述（Prompt）即可生成风格多样的图像，设计师、插画师和普通用户都可以用它做视觉创作。"],
  ["Midjourney 是一个独立研究实验室开发的 AI 图像生成工具，主要通过 Discord 平台使用。用户输入文字描述（Prompt），AI 即可在约 60 秒内生成 4 张高质量图像。",
   "Midjourney 由独立研究实验室开发，可通过其官网和 Discord 使用。用户输入文字描述（Prompt），AI 即可生成图像，具体出图数量与耗时以当前版本和套餐为准。"],
  ["| **图像质量** | 目前 AI 绘画工具中画质最高，细节最丰富 |", "| **图像质量** | 以细节丰富、画面风格感强著称（主观评价） |"],
  ["| **迭代快速** | 约 60 秒生成 4 张图，支持放大、变化、重新生成 |", "| **迭代快速** | 支持放大、变化、重新生成 |"],
  ["Midjourney 目前主要通过 Discord 使用，你需要先注册一个 Discord 账号：", "Midjourney 可通过官网或 Discord 使用，如果选择 Discord，需要先注册账号："],
  [`2. 点击 "Join the Beta" 加入 Discord 服务器
3. 在任意 \`#newbies\` 频道中开始使用`, "2. 按官网指引登录并开始使用；如果使用 Discord，请按官网提示加入官方服务器"],
  [`| 套餐 | 价格 | 说明 |
| :--- | :--- | :--- |
| **Basic** | $10/月 | 约 200 张图/月，适合轻度使用 |
| **Standard** | $30/月 | 无限生成（放松模式），推荐 |
| **Pro** | $60/月 | 隐身模式 + 更快速度 |

> 💡 可通过 [合租平台](/account/) 降低订阅费用`,
   `Midjourney 提供多档付费订阅，各档的出图额度、快速模式时长和价格会调整，请以官方订阅页 [midjourney.com](https://www.midjourney.com) 为准。

> 💡 通过合租平台订阅存在账号被收回的风险，请先阅读[合租避坑指南](/account/how-to-share)。`],
  ["| `--v` | 模型版本 | `--v 6`（最新版本） |", "| `--v` | 指定模型版本 | 例如 `--v 7`，可用版本以官方文档为准 |"],
]);

edit("docs/ai/gemini.md", [
  ["Google Gemini (原名 Bard) 是 Google 最强大的多模态 AI 模型，深度集成于整个 Google 生态链，并在逻辑分析、多媒体理解方面处于行业顶尖。",
   "Google Gemini（原名 Bard）是 Google 的多模态 AI 模型，与 Google 的各项服务有较深的集成，擅长多媒体理解和与 Google 搜索、Workspace 的联动。"],
  ["如果您在中国境内且没有稳定的科学上网环境，我们推荐使用以下直连镜像版：", "如果您在中国境内且没有稳定的科学上网环境，可以了解以下直连镜像站（第三方运营，可用性和隐私保护自行判断）："],
  ["1. Gemini 中文网 - 免费无限制", "1. Gemini 中文网"],
  ["针对国内用户优化的直连版本，无需翻墙，完全免费且无需注册即可使用。在数据分析和多语言处理上表现极其优异。", "面向国内用户的第三方入口，无需额外网络配置即可访问，具体免费额度和功能以站点说明为准。"],
  ["2. XSimpleChat - 综合体验最佳", "2. XSimpleChat"],
  ["界面设计简洁现代，同时支持 Gemini、GPT、Claude 等多模型切换，模型云同步，是目前国内最均衡的选择。", "支持 Gemini、GPT、Claude 等多模型切换，带对话云同步。"],
  ["3. 蓝鲸AI - 功能最全面", "3. 蓝鲸AI"],
  ["集成了主流 AI 模型，支持文件上传分析、联网实时搜索及 AI 绘图功能，内嵌 Gemini 模型，适合专业办公。", "集成多个主流 AI 模型，支持文件分析、联网搜索与绘图。"],
  [`| 网站名称 | 访问地址 | 核心特点 | 推荐指数 |
| :--- | :--- | :--- | :--- |
| Gemini 中文网 | [点击访问](https://www.gemini-chinese.com/) | 专注Gemini，免费无注册 | ⭐⭐⭐⭐⭐ |
| XSimpleChat | [点击访问](https://xsimplechat.com/) | 多模型，云同步，响应快 | ⭐⭐⭐⭐⭐ |
| 蓝鲸AI | [点击访问](https://chat.lanjingchat.com/) | 联网搜索，文件分析，绘图 | ⭐⭐⭐⭐ |`,
   `| 网站名称 | 访问地址 | 核心特点 |
| :--- | :--- | :--- |
| Gemini 中文网 | [点击访问](https://www.gemini-chinese.com/) | 以 Gemini 为主 |
| XSimpleChat | [点击访问](https://xsimplechat.com/) | 多模型，云同步 |
| 蓝鲸AI | [点击访问](https://chat.lanjingchat.com/) | 联网搜索，文件分析，绘图 |`],
  ["3.  **订阅建议**：Gemini Advanced 包含在 Google One 2TB 方案中（$19.99/月）。如果您想低价体验，可以参考 **[合租平台指南](/account/platforms)** 的相应板块。",
   "3.  **订阅建议**：Google 的 Gemini 订阅通常包含在 Google AI 系列套餐中，套餐名称、权益与价格调整较快，请以 Google 官方订阅页为准。通过合租平台订阅存在账号被收回的风险，请先阅读[合租平台指南](/account/platforms)。"],
  ["| **实时联网** | ✅ 原生支持 | ✅ 支持 | ❌ 无原生联网 |", "| **实时联网** | ✅ 支持 | ✅ 支持 | 支持联网搜索（以官方为准） |"],
  ["| **代码能力** | 强 | 强 | **最强** |", "| **代码能力** | 强 | 强 | 强 |"],
  ["| **国内直连** | ✅ 有镜像站 | ✅ 有镜像站 | ✅ 有镜像站 |", "| **国内直连** | 有第三方镜像站 | 有第三方镜像站 | 有第三方镜像站 |"],
]);
