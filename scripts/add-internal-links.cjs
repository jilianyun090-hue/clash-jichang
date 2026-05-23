/**
 * 一次性批量添加场景化机场内链到所有高流量页面
 * 同时在 airport/README.md 顶部插入"2分钟速查卡"
 */
const fs = require('fs');

// ============================================================
// 1. letsvpn-shutdown.md — 快连停运文(392K + 128K印象)
// 在"集群机场优势"章节插入内链
// ============================================================
(function fixLetsvpn() {
  const file = 'd:/桌面文件/clashjichang/docs/proxy/letsvpn-shutdown.md';
  let c = fs.readFileSync(file, 'utf8');

  // 插入点1：四章开头，在三点列表前
  const anchor1 = '1. **协议组合的灵活性**：如果某一种协议遭到特征阻断，你可以马上在不同节点间切换线路。';
  const insert1 = `::: tip 📌 快连用户快速恢复科学上网
选一家支持 Clash/Shadowrocket 一键导入的稳定机场，当天即可恢复使用。\n**[→ 查看2026年便宜好用VPN机场推荐（持续实测更新）](/airport/)**
:::\n\n`;
  if (!c.includes(insert1.trim())) {
    c = c.replace(anchor1, insert1 + anchor1);
    console.log('letsvpn: 插入内链1 ✅');
  }

  // 插入点2：推荐总结，替换原有的链接文案
  c = c.replace(
    '👉 **[点击查阅：2026年度稳定机场/VPN内部推荐汇总页](/airport/)** 👈',
    '👉 **[点击查阅：2026年便宜好用VPN机场推荐（21家稳定高性价比精选，持续更新）](/airport/)** 👈\n\n> 📊 推荐首选：**极连云**（IPLC专线 ¥8/月起）、**瞬云机场**（¥8.25/月）、**山水云**（¥14.99/月），均支持 Clash 一键导入，可直接替代快连。'
  );
  console.log('letsvpn: 更新推荐总结链接文案 ✅');

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 2. streaming/netflix-guide.md — Netflix(47K+41K印象)
// 在"国内如何看Netflix"章节末尾插入内链
// ============================================================
(function fixNetflix() {
  const file = 'd:/桌面文件/clashjichang/docs/streaming/netflix-guide.md';
  let c = fs.readFileSync(file, 'utf8');

  // 插入点：在"选择支持 Netflix 解锁的机场"段落后
  const anchor = '> 📌 国内观看 Netflix 需要支持\"Netflix 原生解锁\"的机场节点，查看 → [2026年机场推荐](/airport/)';
  const newAnchor = `> 📌 **国内观看 Netflix 4K 必须使用「原生 IP 解锁节点」**。普通代理只能看自制剧，出现 M7111-5059 报错的根本原因也在于此。推荐查看：[2026年支持Netflix解锁的高性价比机场精选](/airport/) — 列表中所有机场均经过流媒体解锁实测。`;
  if (!c.includes(newAnchor)) {
    c = c.replace(anchor, newAnchor);
    console.log('netflix: 更新内链锚文本 ✅');
  }

  // 插入点2：在"代理能上Google但不能看Netflix"FAQ后
  const anchor2 = '→ [推荐支持 Netflix 解锁的机场](/airport/)';
  const newAnchor2 = `→ **[2026年最稳定的Netflix解锁机场推荐（实测可用）](/airport/)** — 精选21家，含IEPL专线、原生IP解锁节点，支持4K HDR。`;
  if (!c.includes(newAnchor2)) {
    c = c.replace(anchor2, newAnchor2);
    console.log('netflix: 更新FAQ内链 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 3. account/platforms.md — 账号星球(24K印象)
// 在"为什么不推荐在闲鱼购买"章节后追加内链
// ============================================================
(function fixPlatforms() {
  const file = 'd:/桌面文件/clashjichang/docs/account/platforms.md';
  let c = fs.readFileSync(file, 'utf8');

  const anchor = '- [回到账号合租主页](./README.md)';
  const insert = `\n::: warning 💡 合租账号需要科学上网才能使用
Netflix、Disney+、YouTube Premium 等账号都需要在海外节点下才能正常使用。如果你还没有稳定的翻墙工具，建议先查看：**[2026年便宜好用VPN机场推荐](/airport/)** — 最低¥8/月，支持流媒体4K解锁，与上面的合租账号完美搭配。
:::\n\n`;
  if (!c.includes('合租账号需要科学上网')) {
    c = c.replace(anchor, insert + anchor);
    console.log('platforms: 插入科学上网提示 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 4. ai/chatgpt.md — 在官网实战方案章节强化内链
// ============================================================
(function fixChatgpt() {
  const file = 'd:/桌面文件/clashjichang/docs/ai/chatgpt.md';
  let c = fs.readFileSync(file, 'utf8');

  // 在网络环境说明后插入
  const anchor = '2.  **网络环境**：节点建议选择美国、日本、新加坡。**严禁使用香港、俄罗斯等封禁地区的节点**。';
  const newText = `2.  **网络环境**：节点建议选择美国、日本、新加坡。**严禁使用香港、俄罗斯等封禁地区的节点**。由于 OpenAI 对 IP 质量要求极高，普通代理工具极易导致封号，强烈建议搭配 **[2026高性价比IEPL专线机场](/airport/)** 使用，确保原生IP低延迟不封号。`;
  if (!c.includes('原生IP低延迟不封号')) {
    c = c.replace(anchor, newText);
    console.log('chatgpt: 更新网络环境说明内链 ✅');
  }

  // 在文末底部链接前插入推荐块
  const anchor2 = '- [Claude 使用攻略（代码最强）](./claude-guide.md)';
  const insert2 = `\n::: tip 🔑 使用 ChatGPT 必备：稳定的科学上网工具\nChatGPT 对网络节点要求极高，需要美区原生 IP 才能稳定使用且不被封号。推荐查看 **[2026年便宜好用VPN机场推荐](/airport/)** — 精选支持 ChatGPT 原生 IP 的高性价比专线机场，最低¥8/月。\n:::\n\n`;
  if (!c.includes('使用 ChatGPT 必备')) {
    c = c.replace(anchor2, insert2 + anchor2);
    console.log('chatgpt: 插入必备机场推荐块 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 5. ai/claude-guide.md — Claude注册风控处强化内链
// ============================================================
(function fixClaude() {
  const file = 'd:/桌面文件/clashjichang/docs/ai/claude-guide.md';
  let c = fs.readFileSync(file, 'utf8');

  // 在"IP 纯净"条目后插入
  const anchor = '2. **IP 纯净** 需要美国住IP 或高质量中转节点。数据中IP 大概率被拒。';
  const newText = `2. **IP 纯净** 需要美国住IP 或高质量中转节点。数据中IP 大概率被拒。推荐使用 **[IEPL专线机场](/airport/)** 提供的原生美区节点，封号率大幅低于普通代理。`;
  if (!c.includes('IEPL专线机场')) {
    c = c.replace(anchor, newText);
    console.log('claude: 插入IP纯净内链 ✅');
  }

  // 在"风控须知"后添加推荐卡片
  const anchor2 = '## 免费vs Pro';
  const insert2 = `\n::: warning 🚫 Anthropic 风控极严：节点选错必封号
Claude 的风控是所有 AI 平台中最严格的。**切勿使用香港节点**（已被大量拉黑），必须使用美区原生IP节点。推荐搭配 **[支持Claude原生IP的高品质机场](/airport/)** 使用，规避封号风险。
:::\n\n`;
  if (!c.includes('Anthropic 风控极严')) {
    c = c.replace(anchor2, insert2 + anchor2);
    console.log('claude: 插入风控警告内链 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 6. proxy/fanqiang-guide.md — 翻墙指南(怎么翻墙6.3K)
// 强化第五章的机场推荐内链
// ============================================================
(function fixFanqiang() {
  const file = 'd:/桌面文件/clashjichang/docs/proxy/fanqiang-guide.md';
  let c = fs.readFileSync(file, 'utf8');

  // 替换表格中的内链为更强的锚文本
  const anchor = '查看完整评测详情：**[2026年机场推荐列表](/airport/)**';
  const newAnchor = '查看完整评测详情：**[→ 2026年便宜好用VPN机场推荐（21家精选，高性价比IEPL专线）](/airport/)**';
  if (!c.includes('21家精选，高性价比IEPL专线')) {
    c = c.replace(anchor, newAnchor);
    console.log('fanqiang: 强化机场推荐表格内链 ✅');
  }

  // 强化文末推荐
  const anchor2 = '🚀 **立即开始**：查看 **[2026年机场推荐](/airport/)** | **[Clash 客户端下载](/airport/software.html)**';
  const newAnchor2 = '🚀 **立即开始**：查看 **[2026年便宜好用VPN机场排行（最低¥8/月，持续更新）](/airport/)** | **[Clash 客户端下载](/airport/software.html)** | **[学生党便宜机场专区](/airport/cheap-airport.html)**';
  if (!c.includes('最低¥8/月，持续更新')) {
    c = c.replace(anchor2, newAnchor2);
    console.log('fanqiang: 强化文末内链 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

// ============================================================
// 7. airport/README.md — 在介绍文字后插入"2分钟闭眼选购速查卡"
// ============================================================
(function fixAirportReadme() {
  const file = 'd:/桌面文件/clashjichang/docs/airport/README.md';
  let c = fs.readFileSync(file, 'utf8');

  // 找到介绍段落的结尾，在FAQ details块前面插入速查卡
  const anchor = '::: details 1元机场与低价机场推荐标准';
  const speedCard = `## ⚡ 2分钟闭眼选购速查卡（不想看长文直接看这里）

| 你的需求 | 直接选这家 | 月均价 | 理由 |
| :--- | :--- | :--- | :--- |
| **预算有限 / 学生党** | [极连云](/airport/#极连云) | ¥8 | IPLC专线，不限速不限设备，性价比天花板 |
| **要求稳定 / 追剧4K** | [瞬云机场](/airport/#瞬云机场) | ¥8.25 | ANYCAST专线，晚高峰不降速，流媒体全解锁 |
| **ChatGPT / Claude** | [寰宇云](/airport/#寰宇云机场) | ¥7.4 | IEPL全专线，原生IP，AI工具专用无封号 |
| **刚从快连/LetsVPN迁移** | [山水云](/airport/#山水云) | ¥14.99 | 一键导入Clash，10分钟内恢复科学上网 |
| **要求极致速度** | [奈云](/airport/#奈云) | ¥10.6 | 多条IEPL专线，6年老牌，稳定性有保障 |

> 💡 **选购铁律**：新用户必选月付套餐，先用再续费，防止踩坑。

`;

  if (!c.includes('2分钟闭眼选购速查卡')) {
    c = c.replace(anchor, speedCard + anchor);
    console.log('airport README: 插入2分钟速查卡 ✅');
  }

  fs.writeFileSync(file, c, 'utf8');
})();

console.log('\n✅ 所有内链修改完成！');
