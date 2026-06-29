const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

// Map each file to its clean, unique, 100-160 char description (no boilerplate)
const FIXED_DESCRIPTIONS = {
  // proxy/
  'proxy/after-fanqiang-guide.md': '翻墙之后你应该访问哪些网站？本文精选科技、新闻、娱乐、学术、工具等20+类高质量境外网站推荐，包含 Google、YouTube、Twitter、Reddit、GitHub 等必备平台的使用场景与安全访问建议，助你解锁全球互联网的真正价值。',
  'proxy/apple-id-guide.md': '2026年最新苹果 Apple ID（美区/港区）完整注册教程。详解邮箱注册、付款信息填写、账号安全设置与常见报错解决方法。注册美区苹果ID后，即可下载 Shadowrocket 小火箭、Quantumult X 等中国区下架的科学上网工具。',
  'proxy/backup-airport-guide.md': '为什么你需要备用机场？本文深度解析「双订阅策略」，手把手教你建立主力机场+备用机场的组合方案，彻底告别因单一机场跑路或故障导致的断网窘境，确保在敏感时期与高峰期始终保持稳定可靠的科学上网连接。',
  'proxy/clients.md': '2026年最全 MetaCubeX 核心及兼容客户端列表，涵盖 Windows、macOS、Android、iOS、路由器及鸿蒙等各平台代理软件的维护状态、下载地址与核心特性对比。帮助你选择适合自己平台的最新稳定版客户端，避免使用停更的过时版本。',
  'proxy/custom-client-guide.md': '自研客户端还是开源软件？本文从下载门槛、节点导入、分流规则、协议支持、更新频率五大维度深度对比机场定制客户端与 Clash Verge Rev 等开源工具的优劣，帮助小白用户和进阶用户做出最适合自己需求的科学上网客户端选择。',
  'proxy/fanqiang-guide.md': '2026年最新翻墙科学上网入门完整指南，详细介绍什么是科学上网、Clash代理工具的安装与使用方法、免费VPN与付费机场的对比，以及 Shadowsocks、Trojan、VLESS 等主流翻墙协议解析，助你安全高效地突破网络封锁畅享全球互联网。',
  'proxy/gfw-websites.md': '翻墙后必看的境外网站完整推荐清单，按类别深度介绍 ChatGPT、YouTube、Google、Netflix、GitHub、Twitter/X 等国外主流网站的官网链接、核心功能与使用场景，覆盖科技、社交、娱乐、学术、工具等20+品类，帮你充分利用科学上网的价值。',
  'proxy/hysteria-guide.md': '2026年 Hysteria2 协议完整深度解析：基于 QUIC 协议的新一代翻墙方案，高丢包率环境下速度超越传统 TCP 协议3-5倍。本文涵盖 Hysteria2 的工作原理、与 Trojan/VLESS 的性能对比、支持该协议的机场推荐及客户端配置教程。',
  'proxy/isp-speed-differences.md': '为什么同样的机场节点，电信、联通、移动用起来速度差异巨大？本文深度解析国内三大宽带运营商的国际出口带宽、跨网互联瓶颈与地域路由差异，并提供移动用户在科学上网中的实用优化解决方案，帮你找到最适合自己宽带类型的翻墙线路。',
  'proxy/letsvpn-shutdown.md': '快连 LetsVPN 停运大陆市场全复盘：从辟谣、强撑到最终停运退款的全过程深度解析。揭秘传统商业 VPN 在 GFW 持续升级打压下的生存困境，分析快连停运对2026年翻墙行业格局的影响，并推荐可靠的平替方案，帮助受影响用户快速恢复科学上网。',
  'proxy/line-type-guide.md': '三分钟看懂机场线路类型：IEPL专线、IPLC专线与BGP中转有什么区别？本文深度解析各类线路的物理路由、延迟表现与抗封锁能力，教你通过 Traceroute 路由追踪识别假专线机场，并对比单线程/多线程测速数据背后的真实含义，助你选购物有所值的科学上网服务。',
  'proxy/pc-guide.md': '2026年电脑翻墙完整保姆级教程：Windows 与 Mac 用户如何安装 Clash Verge Rev、导入机场订阅链接并开启系统代理。包含常见故障（节点全部超时、断开后无法上网）的排查步骤，以及规则模式 vs 全局模式的使用建议，10分钟轻松完成电脑科学上网配置。',
  'proxy/phone-guide.md': '2026年手机翻墙完整保姆级教程：安卓用户使用 Clash Meta，iPhone 用户使用 Shadowrocket 小火箭，手把手教你导入机场订阅链接并一键启动代理。包含 iOS 美区 Apple ID 获取方法、规则模式设置避免国内 App 变慢、耗电量优化等实用技巧。',
  'proxy/protocol-comparison.md': '2026年翻墙协议深度横评：SSR（ShadowsocksR）、VLESS 与 Trojan 三大主流协议的速度、稳定性与抗 GFW 检测能力全面对比，附 Hysteria2、NaïveProxy 等新兴协议分析。帮助你根据网络环境与使用场景选择最合适的翻墙协议，提升科学上网的稳定性与速度。',
  'proxy/README.md': '科学上网翻墙完整知识库（2026年持续更新）：涵盖机场选择方法论、IEPL/IPLC/BGP线路解析、Clash配置教程、GFW工作原理科普、流媒体解锁原理，以及备用机场策略、路由器翻墙配置等进阶内容。无论你是翻墙小白还是进阶用户，都能在这里找到所需的科学上网知识。',
  'proxy/relay-crackdown-2026.md': '2026年4月机场中转拔线潮深度复盘：GFW精准打击导致大量中转IP被封，众多主流机场流量中断，部分已无可用IP资源。本文解析此次打击的技术原因、受影响的机场名单与恢复情况，以及在专线枯竭背景下翻墙用户如何选择稳定方案度过封锁高峰期。',
  'proxy/relay-darkest-hour.md': '国内中转机场正面临系统性打击：专线成本飙升、合规压力剧增，大量中小机场被迫关停。本文深度解析2026年中转机场危机的成因、行业洗牌的走向，以及科学上网用户在这一至暗时刻如何评估风险、寻找稳定替代方案，避免主力机场突然跑路导致断网。',
  'proxy/router-vpn-guide.md': '2026年路由器翻墙配置完整教程：支持 Padavan、OpenWrt、梅林等主流固件的路由器 VPN 设置方法，让全家设备统一走科学上网代理，无需在每台设备单独安装客户端。涵盖华为、小米、TP-Link、华硕等主流品牌的固件刷入与 Clash 订阅配置全过程。',
  'proxy/streaming-unlock-guide.md': '深入解析机场流媒体解锁原理：Netflix、Disney+、YouTube、HBO Max 等平台如何识别用户地区？什么是原生 IP、DNS 解锁与 IPTV 解锁？本文教你看懂解锁检测工具的结果，判断机场节点是否真正解锁，以及为何同样的节点有时能看有时不行。',
  'proxy/telegram-bot.md': '2026年 Telegram 搜索机器人完整推荐与使用教程：介绍极搜、搜搜、神马搜索等高效 Telegram Bot，帮助用户快速查找频道、群组、资源文件与联系人。附各 Bot 的功能对比、搜索技巧与隐私注意事项，让你充分利用 Telegram 生态中的海量资源。',
  'proxy/telegram-guide.md': '2026年 Telegram 电报国内最新完整注册教程：从下载安装到账号注册、手机号验证、隐私安全设置、群组频道使用方法，全程图文指导。包含在中国大陆使用 Telegram 需要的代理配置要点、防止账号被封的安全使用建议，以及频道订阅与机器人使用技巧。',
  'proxy/vpn-guide.md': '2026年 VPN 机场选购完整避坑指南：如何通过线路类型（IEPL/IPLC/BGP）、运营时长、TG群活跃度三个硬指标筛选靠谱机场，识别跑路前兆，掌握"首选月付"原则。深度解析真专线与假专线的区别，防止被夸大宣传的测速图欺骗，让你的翻墙钱花在刀刃上。',
  
  // streaming/
  'streaming/README.md': '2026年全球热门流媒体账号完整指南：Netflix奈飞、Disney+迪士尼、YouTube Premium、Spotify Premium 的注册方法、价格对比与合租方案一览。包含海外手机号接码平台推荐、美区 Apple ID 注册教程、礼品卡购买指南，一站式解决国内用户观看正版境外流媒体的全部痛点。',
  'streaming/disney-guide.md': '2026年 Disney+ 完整观看指南：国内如何解锁漫威、星球大战、皮克斯4K片库？涵盖 Disney+ 账号注册流程、家庭共享方案、代理节点要求，以及靠谱低价合租平台推荐。附常见播放问题（黑屏、地区限制提示）解决方案，让你以最低成本畅享 Disney+ 全球内容。',
  'streaming/hbo-max-guide.md': '2026年 HBO Max（Max）国内完整观看攻略：如何解锁《权力的游戏》《西部世界》《芝加哥火》等顶级美剧4K资源。涵盖 Max 与 HBO Go 的区别、订阅方案对比、国内可用代理节点选择，以及低价合租平台推荐。附 HBO Max DRM 限制绕过方法与最佳播放设备建议。',
  'streaming/hulu-hbo-guide.md': '2026年 Hulu 与 HBO Max 国内完整观看教程：美区解锁方法、代理检测绕过策略与合租平台对比推荐。详解 Hulu 各订阅计划（含直播TV方案）的价格差异，以及与 Max 组合订阅的性价比分析。适合希望以低价同时解锁两大顶级美区流媒体平台的国内用户参考。',
  'streaming/netflix-guide.md': '2026年 Netflix 奈飞完整观看指南：国内如何实现4K HDR 极速观看？涵盖地区限制绕过方法、合租账号平台推荐、M7111-5059 等常见错误代码解决方案，以及如何选择支持真正解锁 Netflix 的机场节点。附最佳画质设置、多设备同播配置，让你以最低成本享受奈飞全球片库。',
  'streaming/sms-guide.md': '2026年接码平台完整评测：SMS-Activate、Hero SMS、5sim 等主流海外接码平台深度对比，附 ChatGPT、Claude、Telegram、WhatsApp 接码注册实战教程。分析虚拟号码 vs 实体 giffgaff 手机卡的优劣选择，帮你以最低成本完成各类境外平台的手机号码验证注册。',
  'streaming/spotify-guide.md': '2026年 Spotify Premium 完整合租指南：家庭组共享方案详解、印度区/土耳其区等低价订阅技巧，以及靠谱合租平台推荐对比。涵盖无损音质开启方法、离线下载设置、跨设备同步技巧，让你以每月不到10元的超低价畅享 Spotify Premium 无广告高品质音乐服务。',
  'streaming/youtube-guide.md': '2026年 YouTube Premium 完整订阅指南：家庭组共享方案、印度/土耳其低价区订阅技巧与合租平台推荐对比。详解会员权益（无广告、后台播放、YouTube Music、离线下载），以及4K极速观看的节点选择建议，帮你以远低于官方价格的方案开通 YouTube Premium 会员。',
  
  // airport/
  'airport/software.md': '2026年全平台科学上网客户端下载与推荐：Windows/macOS 首选 Clash Verge Rev，Android 推荐 Clash Meta for Android，iOS 推荐 Shadowrocket 小火箭。提供各客户端的官方/镜像下载链接、版本对比与快速配置三步走指南，适合各平台新手快速上手科学上网代理软件。',
  'airport/choose-guide.md': '2026年VPN机场选购完整避坑指南：月付优先、线路质量优先、实测数据优先三大核心消费策略，教你通过晚高峰测速评估法和跑路征兆预警识别优劣机场。深度解析 IEPL/IPLC 专线与 BGP 中转的性价比差异，及如何配置主备双机场方案规避断网风险，适合新手与老用户参考。',
  'airport/apple-id-shared.md': '2026年免费美区苹果ID共享账号（已购 Shadowrocket 小火箭）每日更新。提供可直接使用的港区/美区 Apple ID 及密码，登录 App Store 后即可免费下载 Shadowrocket、Quantumult X 等科学上网工具。附账号使用注意事项与常见登录报错解决方法，不建议绑定个人信息。',
  'airport/subscription-guide.md': '2026年最新科学上网新手教程：详解什么是翻墙机场、订阅链接、Clash/小火箭客户端，对比传统VPN与节点订阅的优缺点，并提供主流客户端（Clash Verge/Shadowrocket）的导入与配置指南、选购避坑原则及常见网络连接问题（如节点超时、全红）排查方法。',
  
  // ai/
  'ai/README.md': '2026年 AI 工具实战使用完整指南：ChatGPT、Claude、Gemini、Grok、Midjourney、Cursor 等主流 AI 工具的国内访问方法、账号注册教程与深度使用技巧。包含各 AI 平台的功能对比、免费版 vs 付费版差异分析，以及科学上网节点选择建议，助你高效利用全球顶尖 AI 工具提升工作效率。',
  'ai/chatgpt.md': '2026年 ChatGPT 国内完整使用指南：OpenAI 账号注册流程、GPT-4o 与 GPT-4 的功能差异、Plus 会员开通方法，以及国内无法访问 ChatGPT 的解决方案推荐。涵盖 API 接入、自定义 GPT 搭建、代码生成、文档写作等核心应用场景实战技巧，助你充分挖掘 ChatGPT 在工作与学习中的潜能。',
  'ai/claude-guide.md': '2026年 Claude 使用完整指南：Anthropic Claude 3.5 Sonnet/Opus 账号注册、国内访问方法与 Claude Pro 订阅开通教程。深度对比 Claude vs ChatGPT 的代码生成、文档写作、长文本处理能力，以及 Claude 的特色功能 Artifacts 使用技巧，帮你判断是否值得订阅 Claude Pro。',
  'ai/cursor-guide.md': '2026年 Cursor AI 代码编辑器完整使用指南：Cursor 的安装配置、GPT-4 加持的代码补全功能、Chat 对话编程技巧，以及与 GitHub Copilot 的深度对比。涵盖 Python、JavaScript、Go 等主流语言的 Cursor 实战案例，帮助开发者提升编程效率，并解析 Cursor Pro 会员的性价比。',
  'ai/gemini.md': '2026年 Google Gemini 使用完整指南：Gemini Ultra/Pro/Nano 版本差异、国内访问方法、账号注册教程，以及 Gemini Advanced 订阅与 Google One 会员的性价比分析。覆盖 Gemini 在多模态理解、代码生成、Google 全家桶集成方面的核心优势，帮你判断是否值得从 ChatGPT 切换到 Gemini。',
  'ai/grok-guide.md': '2026年 Grok 使用完整指南：X（Twitter）平台旗下 Grok AI 的账号注册、国内访问方法、与 ChatGPT 和 Claude 的功能对比。解析 Grok 的实时联网搜索、幽默对话风格与无内容审查特性，以及 Grok 3 的最新能力升级。适合希望体验 Elon Musk 旗下 AI 产品的用户参考。',
  'ai/midjourney-guide.md': '2026年 Midjourney AI 绘图完整使用指南：账号注册、Prompt 提示词写作技巧、V6 版本新功能详解与订阅方案性价比分析。涵盖常用参数（--ar、--style、--no）的使用方法、以图生图技巧，以及与 DALL-E 3、Stable Diffusion 的对比。帮助设计师和创作者高效利用 Midjourney 生成高质量 AI 图片。',
  'ai/openclaw-guide.md': '2026年 OpenClaw AI 工具完整使用指南：账号注册方法、核心功能介绍与国内访问解决方案。覆盖 OpenClaw 在智能写作、数据分析、多语言翻译等场景的实际应用案例，以及与其他主流 AI 工具的功能对比，帮助用户快速上手并充分挖掘 OpenClaw 在日常工作与学习中的实用价值。',
  
  // account/
  'account/README.md': '2026年流媒体与 AI 账号合租完整指南：Netflix、Disney+、YouTube Premium、Spotify、ChatGPT Plus 等热门平台的合租平台推荐、价格行情监控与安全合租避坑技巧。对比银河录像局、奈飞小铺、账号星球等主流合租平台的信誉、价格与售后保障，助你以最低成本享受优质订阅服务。',
  'account/platforms.md': '2026年流媒体账号合租平台完整推荐：银河录像局、奈飞小铺、账号星球、蜂巢合租等主流平台深度评测对比。覆盖 Netflix、Disney+、YouTube Premium、Spotify、ChatGPT Plus、Claude Pro 等热门账号的合租价格行情、安全性评估与售后保障分析，帮你选择最可靠的合租平台。',
  'account/price.md': '2026年主流流媒体与 AI 账号合租价格行情一览：Netflix、Disney+、YouTube Premium、Spotify、ChatGPT Plus 等平台的月均合租费用对比，以及各合租平台的优惠活动汇总。帮你掌握账号合租的合理价格区间，避免被高价坑骗，以最低成本享受优质订阅服务。',
  'account/how-to-share.md': '账号合租完整入门指南：如何安全参与 Netflix 家庭组合租、Disney+ 共享账号、YouTube Premium 家庭计划？本文详解合租的技术原理、个人隐私保护措施、常见封号风险与规避方法，以及合租纠纷的处理建议，助新手用户以最低成本安全享受各大平台的优质内容。',
  
  // top-level
  'stats.md': '2026年本站实时访问数据统计：页面访问量、独立访客数、热门内容排行与流量来源分析。基于 Umami 隐私友好型统计工具呈现，数据公开透明。涵盖机场推荐、流媒体指南、AI工具教程等各栏目的内容分布与读者偏好，帮助持续优化最有价值的科学上网与翻墙内容。',
  'tag/README.md': '2026年科学上网机场推荐与翻墙指南全部标签索引：通过标签快速定位你感兴趣的内容，包括机场推荐、IEPL专线、Netflix解锁、ChatGPT、Clash配置、Shadowrocket、流媒体合租、AI工具等热门分类。一站式检索本站收录的所有科学上网知识、机场评测与实用翻墙教程资源。',
  'tools/README.md': '2026年流媒体与 AI 账号合租工具推荐：涵盖 Netflix、Disney+、YouTube Premium、ChatGPT Plus 等热门账号的当前合租市场价格、车位状态与平台信誉评分。定期更新的合租价格监控，帮助用户找到性价比最高的合租方案，告别繁琐比价，快速选购最优惠的流媒体与AI订阅服务。',
  
  // airport/client files
  'airport/client-windows.md': '2026年 Windows 电脑 Clash Verge Rev 完整下载安装与使用教程：从官网下载、安装配置到导入机场订阅链接、开启系统代理，全程图文指导。涵盖常用功能（规则模式、全局模式、节点测速、流量统计）的使用说明，以及内核切换、TUN模式等进阶配置方法，10分钟轻松完成 Windows 科学上网配置。',
  'airport/client-android.md': '2026年 Android 安卓手机 Clash Meta 完整下载安装与使用教程：APK 下载、订阅链接导入、规则配置一步到位。包含 CMFA（Clash Meta for Android）的界面功能详解、节点切换、分应用代理设置，以及常见连接问题（VPN 权限、移动数据不通）的排查解决方法，帮你快速完成安卓手机科学上网配置。',
  'airport/client-ios.md': '2026年 iOS 苹果手机 Shadowrocket 小火箭完整使用教程：如何获取美区 Apple ID 购买小火箭、订阅链接导入与一键连接配置。覆盖规则模式设置、分应用代理、HTTPS 证书安装等进阶功能，以及常见问题（无法连接、订阅过期、UDP 转发失败）的解决方案，助你快速实现 iPhone/iPad 科学上网。',
  'airport/README.md': '2026年便宜好用VPN机场精选推荐，持续更新实测评测。收录极连云、山水云、秒秒云、迅达VPN、瞬云机场等21家经过严格筛选的稳定安全高性价比机场，支持 Netflix、Disney+、YouTube 4K 解锁与 ChatGPT、Gemini 访问，最低14元/月起，涵盖 IEPL/IPLC 专线与 BGP 中转线路，附详细价格套餐对比表。',
};

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory() && !f.startsWith('.')) {
      files = files.concat(walk(fp));
    } else if (f.endsWith('.md')) {
      files.push(fp);
    }
  });
  return files;
}

const files = walk(docsDir);
let fixedCount = 0;

files.forEach(filepath => {
  const relPath = filepath.replace(docsDir + '/', '').replace(docsDir.replace(/\//g, '\\') + '\\', '').replace(/\\/g, '/');
  
  if (!FIXED_DESCRIPTIONS[relPath]) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  const newDesc = FIXED_DESCRIPTIONS[relPath];
  
  // Replace description in frontmatter - handle multi-line quoted strings
  // Pattern: description: "..." possibly spanning multiple lines
  const descRegex = /^(description:\s*)"([\s\S]*?)"\s*\n/m;
  const descRegexSimple = /^(description:\s*)([^\n"]+)\n/m;
  
  let newContent;
  if (descRegex.test(content)) {
    newContent = content.replace(descRegex, `$1"${newDesc}"\n`);
  } else if (descRegexSimple.test(content)) {
    newContent = content.replace(descRegexSimple, `$1"${newDesc}"\n`);
  } else {
    console.log(`WARN: Could not find description in ${relPath}`);
    return;
  }
  
  if (newContent !== content) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    fixedCount++;
    console.log(`FIXED: ${relPath} (${newDesc.length} chars)`);
  } else {
    console.log(`SKIP (no change): ${relPath}`);
  }
});

console.log(`\nTotal fixed: ${fixedCount} files`);
