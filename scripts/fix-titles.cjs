const fs = require('fs');
const path = require('path');

const docsDir = 'd:/桌面文件/clashjichang/docs';

// Map each file to its clean, optimized title
const FIXED_TITLES = {
  // proxy/
  'proxy/vpn-guide.md': '如何选择稳定不跑路的VPN机场？2026年科学上网防坑指南',
  'proxy/fanqiang-guide.md': '什么是翻墙？2026年Clash代理工具与科学上网新手入门教程',
  'proxy/backup-airport-guide.md': '为什么翻墙老手需要备用机场？2026双机场备用订阅策略',
  'proxy/after-fanqiang-guide.md': '翻墙后做什么？2026老司机精选必逛国外热门网站与资源大全',
  'proxy/gfw-websites.md': '有哪些网站被防火长城封锁？2026最新Google/YouTube等访问状态指南',
  'proxy/line-type-guide.md': '什么是IEPL/IPLC专线机场？2026真假专线鉴别与单多线程测速对比',
  'proxy/isp-speed-differences.md': '电信联通移动翻墙速度为何差距大？2026出海路由深度解析与优化建议',
  'proxy/streaming-unlock-guide.md': '机场是如何解锁奈飞的？2026最新DNS解锁与流媒体解锁原理解析',
  'proxy/protocol-comparison.md': 'SSR/VLESS/Trojan翻墙协议对比：2026哪种协议速度最快抗封锁最强？',
  'proxy/hysteria-guide.md': 'Hysteria2协议详解：为什么它是最快的翻墙协议？2026原理与机场配置',
  'proxy/clients.md': 'MetaCubeX客户端下载汇总：2026各平台主流科学上网代理软件推荐',
  'proxy/custom-client-guide.md': '自研定制客户端对比开源代理软件：2026新手该怎么选择？',
  'proxy/router-vpn-guide.md': '路由器怎么翻墙？2026最新路由器VPN与Clash配置保姆级教程',
  'proxy/apple-id-guide.md': '如何注册美区Apple ID？2026免信用卡与礼品卡充值保姆级教程',
  'proxy/telegram-guide.md': 'Telegram国内最新注册流程：2026电报防风控与隐私安全设置教程',
  'proxy/telegram-bot.md': 'Telegram搜索机器人推荐：2026高效影视/资源搜索Bot汇总',
  'proxy/relay-crackdown-2026.md': '2026机场中转拔线潮升级解析：国内中转拔线与专线枯竭应对指南',
  'proxy/relay-darkest-hour.md': '国内中转机场的至暗时刻：2026科学上网用户如何寻找稳定方案',
  'proxy/letsvpn-shutdown.md': '快连VPN停止运营内幕：2026稳定好用VPN与替代品机场推荐',
  'proxy/pc-guide.md': '电脑如何翻墙科学上网？2026最新Windows与Mac新手保姆级教程',
  'proxy/phone-guide.md': '手机如何翻墙科学上网？2026最新Android与iOS客户端配置教程',
  'proxy/README.md': '科学上网与翻墙基础知识库：2026机场选择、协议解析与工具指南',

  // streaming/
  'streaming/netflix-guide.md': 'Netflix国内怎么看？2026最新奈飞4K高清播放与合租避坑指南',
  'streaming/disney-guide.md': 'Disney+国内怎么看？2026最新迪士尼合租订阅与4K解锁技巧',
  'streaming/youtube-guide.md': 'YouTube Premium合租拼车指南：2026最新低价订阅与4K解锁攻略',
  'streaming/spotify-guide.md': 'Spotify Premium怎么合租？2026最新低价拼车与账号合租攻略',
  'streaming/hbo-max-guide.md': 'HBO Max国内怎么看？2026最新HBO合租与4K解锁方案',
  'streaming/hulu-hbo-guide.md': 'Hulu与HBO Max国内观看教程：2026最新美区解锁与合租方案',
  'streaming/sms-guide.md': '接码平台哪个好？2026最新SMS-Activate等接码平台深度对比与海外手机号注册教程',
  'streaming/README.md': '流媒体账号合租拼车指南：2026最新奈飞/迪士尼/YouTube低价订阅攻略',

  // ai/
  'ai/chatgpt.md': 'ChatGPT国内怎么用？2026最新ChatGPT注册、镜像站与使用指南',
  'ai/claude-guide.md': 'Claude 3.5 Sonnet国内怎么用？2026最新注册、风控防封号与使用指南',
  'ai/gemini.md': 'Google Gemini国内怎么用？2026最新Gemini多模态AI模型直连使用指南',
  'ai/grok-guide.md': 'Grok AI国内怎么用？2026最新Grok 2.0官网使用与注册保姆级教程',
  'ai/midjourney-guide.md': 'Midjourney国内怎么用？2026最新Midjourney注册、参数设置与AI绘图教程',
  'ai/cursor-guide.md': 'Cursor AI怎么用？2026最新Cursor智能代码编辑器实战与配置教程',
  'ai/openclaw-guide.md': 'OpenClaw怎么配置？2026小龙虾AI聚合工具安装与使用指南',
  'ai/README.md': 'ChatGPT与Claude专用机场推荐：2026原生住宅IP完美解锁AI工具指南',

  // account/
  'account/platforms.md': '奈飞/ChatGPT合租平台推荐：2026银河录像局与奈飞小铺深度对比',
  'account/price.md': '奈飞/ChatGPT合租价格行情表：2026最新各大流媒体与AI账号合租省钱攻略',
  'account/how-to-share.md': '流媒体账号合租避坑实战指南：2026如何防骗防跑路新手攻略',
  'account/README.md': '流媒体与AI账号合租中心：2026奈飞/ChatGPT等拼车推荐与安全指南',

  // top-level
  'stats.md': '道一博客访问数据统计图表（2026实时更新）',
  'tag/README.md': '标签索引：科学上网、流媒体解锁、AI工具与翻墙机场文章分类',
  'tools/README.md': '账号合租价格监控与对比工具：2026各大合租拼车平台精选',
  'links.md': '友情链接与合作伙伴 - 优秀科学上网与流媒体合租资源共享',
  'index.md': '稳定便宜机场推荐：2026精选实测最稳专线机场与翻墙梯子推荐 - 道一博客',

  // airport/
  'airport/software.md': '科学上网客户端下载：2026主流 Clash/Shadowrocket/Sing-box 代理软件推荐',
  'airport/choose-guide.md': '购买翻墙梯子前必看的3个硬指标：2026机场选购防坑指南',
  'airport/apple-id-shared.md': '免费美区苹果 ID 共享：每日更新已购 Shadowrocket 小火箭账号',
  'airport/client-windows.md': 'Clash Verge Rev Windows配置教程：电脑端科学上网保姆级指南',
  'airport/client-android.md': 'Clash Meta Android端配置教程：安卓手机科学上网新手指南',
  'airport/client-ios.md': 'Shadowrocket苹果手机配置教程：iOS小火箭订阅导入与使用指南',
  'airport/iepl-iplc.md': 'IEPL专线 vs IPLC专线 vs BGP中转：2026年机场线路类型深度对比',
  'airport/reviews.md': '机场测评报告合集：2026精选稳定科学上网翻墙机场测速深度报告',
  'airport/cheap-airport.md': '学生党便宜机场推荐：2026月付8元起的高性价比科学上网梯子',
  'airport/subscription-guide.md': '如何购买与配置翻墙机场？2026最新科学上网新手订阅导入保姆级教程',

  // 24 individual airport reviews
  'airport/bianjiyun.md': '边界云怎么样？2026边界云机场稳定高速IEPL优化线路深度测评',
  'airport/dageyun.md': '大哥云怎么样？2026大哥云5年老牌IPLC专线机场深度测评与官网',
  'airport/duolaameng.md': '哆啦A梦机场怎么样？2026哆啦A梦IEPL专线大带宽游戏节点测评',
  'airport/edge-x.md': 'Edge-X怎么样？2026Edge-X机场高端企业级IEPL专线深度测评',
  'airport/feiniaojichang.md': '飞鸟机场怎么样？2026飞鸟机场高端全IEPL物理专线深度测评',
  'airport/guangnianti.md': '光年梯怎么样？2026光年梯IPLC专线老牌稳定机场深度测评',
  'airport/guangshuyun.md': '光速云怎么样？2026光速云机场IEPL专线流媒体解锁深度测评',
  'airport/huanyuyun.md': '寰宇云怎么样？2026寰宇云IEPL全专线原生IP解锁AI工具深度测评',
  'airport/huayunjichang.md': '花云怎么样？2026花云FlowerCloud高端金牌BGP专线机场深度测评',
  'airport/jilianyun.md': '极连云怎么样？2026极连云机场稳定高速IPLC专线深度测评',
  'airport/jisuyun.md': '极速云怎么样？2026极速云机场大流量IEPL专线与BGP中转深度测评',
  'airport/keda.md': '可达加速器怎么样？2026可达加速器高速稳定直连线路深度测评',
  'airport/lizione.md': 'LiZione怎么样？2026LiZione机场多线BGP中转低延迟深度测评',
  'airport/longmaoyun.md': '龙猫云怎么样？2026龙猫云机场IPLC专线晚高峰不降速深度测评',
  'airport/miaomiaoyun.md': '秒秒云怎么样？2026秒秒云中转高速节点多设备无限制深度测评',
  'airport/naiyun.md': '奈云怎么样？2026奈云机场6年老牌IEPL专线稳定翻墙深度测评',
  'airport/qingyunti.md': '青云梯怎么样？2026青云梯全IPLC专线不限设备稳定翻墙深度测评',
  'airport/quanqiuyun.md': '全球云怎么样？2026全球云机场BGP智能调度多线中转深度测评',
  'airport/shanhai.md': '山海机场怎么样？2026山海机场月付3元超低价便宜翻墙深度测评',
  'airport/shanshuiyun.md': '山水云怎么样？2026山水云中转+直连高性价比流媒体解锁深度测评',
  'airport/shunyun.md': '瞬云机场怎么样？2026瞬云机场Anycast高速专线流媒体解锁深度测评',
  'airport/xingdaomeng.md': '星岛梦怎么样？2026星岛梦IEPL专线晚高峰不降速机场深度测评',
  'airport/xundavpn.md': '迅达VPN怎么样？2026迅达VPN企业级BGP专线流媒体解锁深度测评',
  'airport/yinyun.md': '隐云怎么样？2026隐云机场IPLC物理内网专线免配置深度测评',
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
  
  if (!FIXED_TITLES[relPath]) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  const newTitle = FIXED_TITLES[relPath];
  
  // Replace title in frontmatter
  const titleRegex = /^title:\s*(["'])(.*?)\1\s*$/m;
  const match = content.match(titleRegex);
  
  if (match) {
    const oldTitle = match[2];
    if (oldTitle !== newTitle) {
      const quote = match[1];
      const target = `title: ${quote}${oldTitle}${quote}`;
      const replacement = `title: ${quote}${newTitle}${quote}`;
      content = content.replace(target, replacement);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated title for ${relPath}: ${oldTitle} -> ${newTitle}`);
      fixedCount++;
    }
  } else {
    // Try without quotes
    const titleNoQuoteRegex = /^title:\s*([^\s"'].*?)\s*$/m;
    const matchNoQuote = content.match(titleNoQuoteRegex);
    if (matchNoQuote) {
      const oldTitle = matchNoQuote[1];
      if (oldTitle !== newTitle) {
        const target = `title: ${oldTitle}`;
        const replacement = `title: "${newTitle}"`;
        content = content.replace(target, replacement);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated title for ${relPath}: ${oldTitle} -> ${newTitle}`);
        fixedCount++;
      }
    }
  }
});

console.log(`Successfully optimized ${fixedCount} titles.`);
