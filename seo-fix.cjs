// SEO Fix Script - Fixes all SEO issues in one pass
const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, 'docs');

// ===== MULTI H1 FIXES =====
// For each file with h1 in body: convert "# Title" -> "## Title" in body
// (Frontmatter title serves as the page h1)

const multiH1Files = [
  'ai/cursor-guide.md',
  'ai/grok-guide.md', 
  'proxy/after-fanqiang-guide.md',
  'proxy/clients.md',
  'proxy/fanqiang-guide.md',
  'proxy/hysteria-guide.md',
  'proxy/isp-speed-differences.md',
  'proxy/letsvpn-shutdown.md',
  'proxy/line-type-guide.md',
  'proxy/protocol-comparison.md',
  'proxy/relay-crackdown-2026.md',
  'proxy/relay-darkest-hour.md',
  'streaming/hbo-max-guide.md',
  'tag/README.md',
];

// ===== SHORT TITLE FIXES =====
const titleFixes = {
  'account/how-to-share.md': '2026 流媒体账号合租避坑实战指南：如何防骗防跑路，新手必看全攻略',
  'account/platforms.md': '2026 可靠的流媒体与 AI 账号合租平台推荐：银河录像局、奈飞小铺等深度对比',
  'account/price.md': '2026 最新流媒体与 AI 账号合租价格行情参考表：Netflix、ChatGPT 等平台最低价攻略',
  'account/README.md': '2026 流媒体与 AI 账号合租中心：Netflix、ChatGPT 等超低价拼车推荐与安全合租指南',
  'ai/chatgpt.md': '2026 最新 ChatGPT 深度使用指南：官网漫游秘籍、国内镜像站与进阶提示词技巧完全推荐',
  'ai/claude-guide.md': '2026 Claude 3.5 Sonnet 注册、国内访问与高级使用攻略：最强写作AI完整教程',
  'ai/cursor-guide.md': '2026 Cursor AI 智能代码编辑器完整教程与实战指南：提升10倍编程效率的AI工具',
  'ai/gemini.md': '2026 Google Gemini 最强多模态 AI 模型国内直连使用全攻略：注册与使用教程',
  'ai/midjourney-guide.md': '2026 Midjourney AI 绘画完整教程：注册、参数设置与实战案例全面解析',
  'ai/openclaw-guide.md': '2026 OpenClaw（小龙虾）最全保姆级安装配置教程：AI 聚合工具完整使用指南',
  'airport/choose-guide.md': '2026 机场避坑指南：购买VPN机场前必须看的 3 个硬指标，拒绝跑路坑保平安',
  'airport/client-android.md': '2026 Android 安卓手机端 Clash Meta 科学上网客户端完整下载与配置教程（含截图）',
  'airport/client-ios.md': '2026 iOS 苹果手机端 Shadowrocket 小火箭科学上网客户端完整下载与配置教程',
  'airport/client-windows.md': '2026 Windows 电脑端 Clash Verge Rev 科学上网客户端完整下载与配置教程（附截图）',
  'airport/README.md': '2026年便宜好用VPN机场推荐：稳定安全高性价比翻墙梯子精选，科学上网持续更新评测',
  'airport/software.md': '2026 全平台科学上网客户端下载指南：Clash、Shadowrocket 等主流代理软件推荐',
  'index.md': '2026 精选科学上网机场推荐：实测最稳专线机场与翻墙梯子推荐 - 道一博客',
  'links.md': '友情链接与合作伙伴 - 2026 科学上网机场推荐排行优质资源共享与友链交换',
  'proxy/after-fanqiang-guide.md': '翻墙后做什么？2026年老司机精心整理的必逛海外热门网站与实用资源大全',
  'proxy/apple-id-guide.md': '2026 如何正式注册美区 Apple ID 完整教程（免信用卡，含礼品卡充值方法）',
  'proxy/backup-airport-guide.md': '备用机场的重要性：为什么翻墙老手至少保留两个订阅（2026双机场策略指南）',
  'proxy/clients.md': '2026最全 MetaCubeX 核心及兼容客户端完整列表：代理软件维护状态与 GitHub 下载地址汇总',
  'proxy/custom-client-guide.md': '机场自研客户端 vs 开源软件全面对比：新手该用哪个？2026 详解与选择建议',
  'proxy/fanqiang-guide.md': '什么是翻墙？2026年Clash代理工具完整使用指南：新手从零学会科学上网教程',
  'proxy/gfw-websites.md': '2026 被防火长城封锁的网站大全：Google、YouTube、Twitter等平台访问状态详细指南',
  'proxy/hysteria-guide.md': '2026 Hysteria 协议详解：为什么它是目前最快的翻墙协议？原理与机场配置指南',
  'proxy/isp-speed-differences.md': '电信、联通、移动翻墙速度为何差距大？2026运营商出海路由深度解析与优化建议',
  'proxy/letsvpn-shutdown.md': '机场跑路确认：从辟谣到"拔管"，快连VPN宣布停止运营洗牌内幕与替代品推荐',
  'proxy/line-type-guide.md': '什么是 IEPL/IPLC 专线机场？2026深度揭秘单/多线程测速区别与真假专线鉴别指南',
  'proxy/pc-guide.md': '电脑如何翻墙科学上网？2026 年 Windows 与 Mac 翻墙新手保姆级配置指南',
  'proxy/phone-guide.md': '手机如何翻墙科学上网？2026 年最新 Android 与 iOS 科学上网完整保姆级教程',
  'proxy/protocol-comparison.md': '2026年 SSR、VLESS 与 Trojan 翻墙协议深度对比：哪种协议速度最快抗封锁最强？',
  'proxy/README.md': '科学上网与翻墙基础知识全面指南（2026年最新更新）：机场选择、协议解析与工具推荐',
  'proxy/relay-crackdown-2026.md': '2026年4月机场中转拔线潮升级全解析：专线枯竭、无IP可换，翻墙行业进入洗牌倒计时',
  'proxy/relay-darkest-hour.md': '国内中转机场的至暗时刻深度解析：系统性打击下科学上网用户如何突围与寻找稳定方案',
  'proxy/router-vpn-guide.md': '2026 路由器翻墙科学上网教程：最佳路由器 VPN 配置方法保姆级图文完整指南',
  'proxy/streaming-unlock-guide.md': '2026 流媒体解锁原理深度解析：机场如何解锁 Netflix、Disney+、ChatGPT 详细指南',
  'proxy/telegram-bot.md': '2026 Telegram 搜索机器人完整推荐：极搜、搜搜、神马搜索等高效 Bot 使用教程',
  'proxy/telegram-guide.md': '2026 年 Telegram 电报国内最新注册流程与安全使用完整详尽教程（含隐私设置）',
  'proxy/vpn-guide.md': '2026 年 VPN 机场选购实战避坑完整指南：如何识别优质线路与防跑路稳定机场策略',
  'stats.md': '科学上网机场与流媒体账号评测网站访问数据全面统计图表（2026实时更新）',
  'streaming/disney-guide.md': '2026 Disney+ 合租订阅完整观看指南：漫威星战4K解锁方法与低价合租技巧',
  'streaming/hbo-max-guide.md': '2026 HBO Max/Go 国内合租观看完整指南：美剧4K解锁、价格对比与最佳合租方案',
  'streaming/hulu-hbo-guide.md': '2026 Hulu 与 HBO Max 国内完整观看指南：含美区解锁、机场推荐与低价合租方案',
  'streaming/netflix-guide.md': '2026 Netflix 奈飞完整观看指南：国内如何看 4K 高清？避坑攻略与播放设置全解析',
  'streaming/README.md': '2026 最新流媒体账号完整注册与使用全指南：Netflix、Disney+、YouTube Premium 等',
  'streaming/sms-guide.md': '2026 接码平台完整评测：SMS-Activate、Hero SMS 深度对比与海外手机号注册实战教程',
  'streaming/spotify-guide.md': '2026 Spotify Premium 账号合租终极完整指南：低价拼车、高音质与跨区合租最佳方案',
  'streaming/youtube-guide.md': '2026 YouTube Premium 会员权益及订阅终极完整指南：低价合租与4K解锁全攻略',
  'tag/README.md': '完整标签索引 - 2026科学上网、流媒体解锁、AI 工具与翻墙机场推荐全分类导航',
  'tools/README.md': '2026流媒体与 AI 账号合租工具推荐、价格监控及精选平台综合评测与使用指南',
};

// ===== SHORT/MISSING DESC FIXES =====
const descFixes = {
  'airport/apple-id-shared.md': '2026年最新免费共享美区Apple ID账号每日更新汇总，包含账号密码及使用须知。共享账号用于下载Shadowrocket等代理软件，请勿修改密码或绑定支付信息，建议使用后及时注销，保护个人隐私安全。',
  'proxy/after-fanqiang-guide.md': '翻墙之后第一件事该做什么？2026年老司机精心整理的海外必逛热门网站大全，涵盖社交媒体（Twitter/X、Reddit）、视频平台（YouTube、Netflix）、学习资源、游戏、购物等多个类别，助你充分利用科学上网的价值。',
};

let fixCount = 0;

// Fix multi-h1: convert first body h1 to h2
for (const relFile of multiH1Files) {
  const filePath = path.join(docsDir, relFile);
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', relFile); continue; }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const fmMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!fmMatch) continue;
  
  const fmEnd = fmMatch[0].length;
  let body = content.slice(fmEnd);
  
  // Replace all "# " h1 headings in body with "## "
  const newBody = body.replace(/^(# )(.+)$/mg, '## $2');
  
  if (newBody !== body) {
    fs.writeFileSync(filePath, content.slice(0, fmEnd) + newBody, 'utf8');
    console.log('FIXED multi-h1:', relFile);
    fixCount++;
  }
}

// Fix short titles
for (const [relFile, newTitle] of Object.entries(titleFixes)) {
  const filePath = path.join(docsDir, relFile);
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', relFile); continue; }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Match title line in frontmatter (quoted or unquoted)
  const updated = content.replace(
    /^(title:\s*)["']?[^"'\n\r]+["']?(\s*)$/m,
    `$1"${newTitle}"$2`
  );
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('FIXED title:', relFile, '(' + newTitle.length + ' chars)');
    fixCount++;
  } else {
    console.log('NO CHANGE (title):', relFile);
  }
}

// Fix short/missing descriptions
for (const [relFile, newDesc] of Object.entries(descFixes)) {
  const filePath = path.join(docsDir, relFile);
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', relFile); continue; }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const updated = content.replace(
    /^(description:\s*)["']?[^"'\n\r]*["']?(\s*)$/m,
    `$1"${newDesc}"$2`
  );
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('FIXED desc:', relFile, '(' + newDesc.length + ' chars)');
    fixCount++;
  } else {
    console.log('NO CHANGE (desc):', relFile);
  }
}

console.log('\nTotal fixes applied:', fixCount);
