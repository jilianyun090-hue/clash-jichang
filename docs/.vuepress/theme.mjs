import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
    hostname: "https://clash-jichang.com",

    // 博客自动生成页面标题配置（解决 Bing 标题太短的 SEO 警告）
    locales: {
        "/": {
            blogLocales: {
                article: "2026年科学上网机场推荐与翻墙梯子全部文章列表 - 涵盖最新稳定专线机场评测、Netflix流媒体解锁指南与ChatGPT等AI工具使用教程",
                articleList: "科学上网机场推荐与使用教程资讯文章完整索引 - 2026年最新稳定翻墙机场深度评测、Netflix/Disney+流媒体解锁详细指南与人工智能工具实战攻略",
                category: "翻墙机场推荐文章分类导航：机场推荐、AI工具教程、流媒体解锁与账号合租完整指南汇总",
                categoryList: "2026年科学上网与翻墙机场相关文章全部分类导航 - 涵盖节点推荐、网络代理知识、流媒体平台解锁、AI智能工具实操等各大核心板块",
                tag: "2026年科学上网机场推荐完整标签分类索引 - 通过标签快速定位翻墙节点类型、流媒体平台教程或AI人工智能工具使用攻略",
                tagList: "2026年科学上网与翻墙全部文章标签汇总索引 - 机场推荐、VPN翻墙、AI工具与流媒体标签一览 - 高效检索所需技术指南",
                timeline: "2026年科学上网机场推荐最新发布时间轴 - 持续更新翻墙方案 - 按时间线浏览每一次机场评测、网络代理教程与优质资源分享",
                timelineList: "2026年最新科学上网与翻墙机场推荐文章发布时间线完整索引 - 回顾历次重要机场评测更新、流媒体解锁技术进展及AI工具实操案例",
                star: "精选推荐文章合集 - 2026年科学上网与翻墙机场最佳实战指南与进阶技巧 - 年度最具价值的高性价比机场评测与流媒体合租避坑干货",
                slides: "科学上网技术分享幻灯片 - 网络代理配置及流媒体解锁技术演示文稿",
                encrypt: "加密保护内容 - 专属节点福利、深度机场评测数据及高级翻墙进阶教程",
            },
        },
    },

    // 主题色：深蓝色
    themeColor: "#1565c0",

    // 网站 Logo
    logo: "/globe.png",
    logoAlt: "2026年科学上网VPN机场推荐 - clash-jichang.com",
    
    docsDir: "docs",

    footer: '<a href="/airport/">机场推荐</a> | <a href="/ai/">AI指南</a> | <a href="/proxy/">知识库</a> | <a href="/faq/">常见问题</a> | <a href="/links">友链</a><br/>📧 联系我们：haozevpn@gmail.com<br/>优质资源共享 · 助你畅享全球互联网自由',
    displayFooter: true,
    copyright: "Copyright © 2026 clash-jichang.com · All Rights Reserved",

    // 导航栏 (机场推荐突出放前面)
    navbar: [
        { text: "首页", link: "/" },
        { text: "机场推荐", link: "/airport/" },
        { text: "机场测评", link: "/airport/reviews.html" },
        { text: "合租平台", link: "/account/platforms.html" },
        { text: "AI使用指南", link: "/ai/" },
        { text: "科学上网知识库", link: "/proxy/" },
        { text: "常见问题", link: "/faq/" },
        {
            text: "更多",
            children: [
                { text: "友链", link: "/links" },
                { text: "标签", link: "/tag/" },
                { text: "统计", link: "/stats" },
            ],
        },
        {
            text: "",
            icon: "/tg-plane.svg",
            link: "http://t.me/JIAN6688"
        }
    ],

    // 侧边栏 (移除小图标, 以纯净大方的文字目录为主)
    sidebar: {
        "/account/": [
            {
                text: "账号合租",
                children: [
                    { text: "流媒体与 AI 合租平台推荐", link: "platforms" },
                    { text: "合租价格行情与省钱攻略", link: "price" },
                    { text: "账号合租防骗与避坑指南", link: "how-to-share" },
                ],
            },
        ],
        "/airport/": [
            {
                text: "推荐与测评指南",
                children: [
                    { text: "便宜机场VPN与梯子推荐", link: "" },
                    { text: "稳定机场推荐排行榜", link: "best-airport-2026" },
                    { text: "便宜机场推荐 (学生党首选)", link: "cheap-airport" },
                    { text: "科学上网机场避坑指南", link: "choose-guide" },
                    { text: "⚠️ 跑路高危机场名单 (避坑)", link: "paolu" },
                    { text: "专线机场对比 (IEPL/IPLC)", link: "iepl-iplc" },
                    { text: "机场订阅导入与配置指南", link: "subscription-guide" },
                ],
            },
            {
                text: "客户端下载与配置",
                collapsible: false,
                children: [
                    { text: "全平台客户端下载汇总指南", link: "software" },
                    { text: "Windows 端 Clash Verge 教程", link: "client-windows" },
                    { text: "Android 端 Clash Meta 教程", link: "client-android" },
                    { text: "iOS 苹果小火箭 Shadowrocket 教程", link: "client-ios" },
                    { text: "免费美区 Apple ID / 小火箭账号共享", link: "apple-id-shared" },
                ],
            },
        ],
        "/ai/": [
            {
                text: "AI 工具实战",
                children: [
                    { text: "ChatGPT/Claude专用机场推荐", link: "" },
                    { text: "ChatGPT国内注册与使用", link: "chatgpt" },
                    { text: "Claude 3.5国内注册教程", link: "claude-guide" },
                    { text: "Google Gemini使用指南", link: "gemini" },
                    { text: "Grok AI注册与访问教程", link: "grok-guide" },
                    { text: "Midjourney AI绘画教程", link: "midjourney-guide" },
                    { text: "Cursor AI编辑器教程", link: "cursor-guide" },
                    { text: "OpenClaw聚合AI教程", link: "openclaw-guide" },
                ],
            },
        ],
        "/proxy/": [
            {
                text: "基础入门",
                collapsible: true,
                children: [
                    { text: "科学上网知识库首页", link: "" },
                    { text: "如何选购稳定VPN机场", link: "vpn-guide" },
                    { text: "什么是翻墙？Clash教程", link: "fanqiang-guide" },
                    { text: "备用机场与双订阅策略", link: "backup-airport-guide" },
                    { text: "翻墙后必逛境外网站", link: "after-fanqiang-guide" },
                    { text: "有哪些国外网站被墙", link: "gfw-websites" },
                ],
            },
            {
                text: "线路与技术",
                collapsible: true,
                children: [
                    { text: "什么是IEPL/IPLC专线", link: "line-type-guide" },
                    { text: "三网宽带翻墙速度差异", link: "isp-speed-differences" },
                    { text: "机场流媒体解锁原理解析", link: "streaming-unlock-guide" },
                    { text: "SSR与Trojan协议性能对比", link: "protocol-comparison" },
                    { text: "Hysteria2最快协议详解", link: "hysteria-guide" },
                    { text: "AnyTLS新协议原理与配置", link: "anytls-guide" },
                ],
            },
            {
                text: "工具与平台",
                collapsible: true,
                children: [
                    { text: "科学上网代理客户端下载", link: "clients" },
                    { text: "机场自研与开源软件选择", link: "custom-client-guide" },
                    { text: "路由器科学上网配置教程", link: "router-vpn-guide" },
                    { text: "美区Apple ID注册教程", link: "apple-id-guide" },
                    { text: "电报(Telegram)注册教程", link: "telegram-guide" },
                    { text: "电报(Telegram)机器人推荐", link: "telegram-bot" },
                ],
            },
            {
                text: "行业动态",
                collapsible: true,
                children: [
                    { text: "国内中转拔线专线枯竭", link: "relay-crackdown-2026" },
                    { text: "中转机场的稳定替代方案", link: "relay-darkest-hour" },
                    { text: "快连VPN停运与替代推荐", link: "letsvpn-shutdown" },
                ],
            },
        ],
        "/tools/": [
            {
                text: "合租中心",
                children: [
                    "",
                ],
            },
        ],
        // 博客自动生成页面，不需要侧边栏
        "/tag/": false,
        "/category/": false,
        "/article/": false,
        "/star/": false,
        "/timeline/": false,
        "/links.html": false,
        "/stats.html": false,
    },



    // 关闭不必要的图标插件
    plugins: {
        blog: true,
        seo: {
            customHead: (head, page, app) => {
                // 为自动生成的博客聚合页面（标签、分类、文章列表等）提供独特且足够长的 meta description
                if (page.path.startsWith('/tag/') || page.path.startsWith('/category/') || page.path.startsWith('/article/') || page.path.startsWith('/timeline/') || page.path.startsWith('/star/')) {
                    const pageName = page.title || '科学上网';
                    
                    // 根据不同页面类型生成差异化描述
                    let desc;
                    if (page.path.startsWith('/tag/')) {
                        desc = `浏览「${pageName}」相关文章合集。本站收录2026年最新科学上网机场推荐与翻墙指南，精选稳定高速的VPN机场评测，提供 Netflix、Disney+ 等流媒体解锁教程与合租方案，分享 ChatGPT 等前沿 AI 工具使用攻略。标签：${pageName}。`;
                    } else if (page.path.startsWith('/category/')) {
                        desc = `「${pageName}」分类下的全部文章。2026年最新科学上网机场推荐与翻墙指南，精选稳定高速的VPN机场评测，提供 Netflix、Disney+ 等流媒体解锁教程与合租方案，分享 ChatGPT、Claude 等前沿 AI 工具使用攻略。`;
                    } else if (page.path.startsWith('/article/')) {
                        desc = `2026年科学上网机场推荐全部文章列表。精选稳定高速的翻墙机场评测，提供 Netflix、Disney+、YouTube 4K 流媒体解锁教程与合租方案，分享 ChatGPT、Claude、Gemini 等前沿 AI 工具使用攻略，助您畅享全球互联网自由。`;
                    } else if (page.path.startsWith('/timeline/')) {
                        desc = `按时间线浏览2026年最新科学上网机场推荐与翻墙指南文章。持续更新稳定高速的VPN机场评测、Netflix/Disney+ 流媒体解锁教程与 ChatGPT 等 AI 工具使用攻略，记录每一次重要评测与资源分享。`;
                    } else if (page.path.startsWith('/star/')) {
                        desc = `精选推荐文章合集：2026年最具价值的科学上网机场推荐、翻墙攻略与流媒体解锁指南。经过严格筛选的高性价比VPN机场评测、Netflix合租技巧与 ChatGPT 使用攻略，助您快速找到最优方案。`;
                    } else {
                        desc = `这是「${pageName}」的相关内容归档。2026年最新科学上网机场推荐与翻墙指南，为您精选稳定高速的翻墙机场评测，提供 Netflix、Disney+ 等流媒体解锁教程与合租方案，分享 ChatGPT 等前沿 AI 工具使用攻略。`;
                    }
                    
                    const metaIndex = head.findIndex(item => item[0] === 'meta' && item[1].name === 'description');
                    if (metaIndex !== -1) {
                        head[metaIndex][1].content = desc;
                    } else {
                        head.push(['meta', { name: 'description', content: desc }]);
                    }
                    
                    const ogIndex = head.findIndex(item => item[0] === 'meta' && item[1].property === 'og:description');
                    if (ogIndex !== -1) {
                        head[ogIndex][1].content = desc;
                    } else {
                        head.push(['meta', { property: 'og:description', content: desc }]);
                    }
                }
            }
        },
        mdEnhance: {
            container: true,
        },
        icon: {
            assets: null,
        },
    },

    markdown: {
        align: true,
        attrs: true,
        tabs: true,
        tasklist: true,
    },

    // 隐藏作者和阅读时间
    pageInfo: ["Date", "Category", "Tag"],

    // 界面风格：极致纯净
    headerDepth: 2,
    darkmode: "toggle",
    fullscreen: false,
    backToTop: true,
    pure: true,
});
