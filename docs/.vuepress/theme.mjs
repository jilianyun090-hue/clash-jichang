import { readFileSync } from "node:fs";
import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
    hostname: "https://clash-jichang.com",

    // 博客自动生成页面标题配置（解决 Bing 标题太短的 SEO 警告）
    locales: {
        "/": {
            toc: true,
            // 自动生成的聚合页只用于站内浏览，不参与索引（见 customHead 中的 noindex），标题保持简短
            blogLocales: {
                article: "全部文章",
                articleList: "文章列表",
                category: "分类",
                categoryList: "全部分类",
                tag: "标签",
                tagList: "全部标签",
                timeline: "时间轴",
                timelineList: "文章时间轴",
                star: "精选文章",
                slides: "幻灯片",
                encrypt: "加密内容",
            },
        },
    },

    // 主题色：深蓝色
    themeColor: "#1565c0",

    // 面包屑导航
    breadcrumb: true,
    breadcrumbIcon: true,

    // 网站 Logo
    logo: "/globe.png",
    logoAlt: "Clash机场推荐指南",
    
    docsDir: "docs",

    footer: '<a href="/airport/">机场推荐</a> · <a href="/airport/compare">机场对比</a> · <a href="/airport/best-value">性价比机场</a> · <a href="/airport/coupons">优惠码</a> · <a href="/airport/brands">机场库</a> · <a href="/airport/paolu">跑路预警</a> · <a href="/ai/">AI指南</a> · <a href="/proxy/">知识库</a> · <a href="/faq/">常见问题</a><br/><a href="/about">关于与评测方法</a> · <a href="/disclosure">推广披露</a> · <a href="/privacy">隐私政策</a> · <a href="/terms">使用条款</a> · <a href="/links">友链</a><br/>本站部分链接为推广链接，详见推广披露',
    displayFooter: true,
    copyright: "© 2026 clash-jichang.com",

    // 顶部导航：按用户任务分为机场、AI、账号与知识库四条主路径。
    navbar: [
        { text: "首页", link: "/" },
        {
            text: "机场推荐",
            children: [
                { text: "机场推荐总览", link: "/airport/" },
                { text: "机场测评合集", link: "/airport/reviews" },
                { text: "稳定机场排行榜", link: "/airport/best-airport-2026" },
                { text: "性价比机场", link: "/airport/best-value" },
                { text: "机场对比", link: "/airport/compare" },
                { text: "机场优惠码", link: "/airport/coupons" },
                { text: "机场库", link: "/airport/brands" },
                { text: "跑路预警", link: "/airport/paolu" },
            ],
        },
        { text: "AI使用指南", link: "/ai/" },
        { text: "账号与合租", link: "/account/" },
        { text: "科学上网知识库", link: "/proxy/" },
        { text: "常见问题", link: "/faq/" },
        {
            text: "更多",
            children: [
                { text: "客户端下载", link: "/airport/software" },
                { text: "关于与评测方法", link: "/about" },
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
                text: "账号与合租中心",
                children: [
                    { text: "账号合租总览", link: "" },
                    { text: "流媒体与 AI 合租平台", link: "platforms" },
                    { text: "2026 奈飞(Netflix)账号合租与防封指南", link: "netflix-hezu-guide" },
                    { text: "合租价格行情与省钱攻略", link: "price" },
                    { text: "合租价格监控工具", link: "/tools/" },
                    { text: "账号合租防骗与避坑指南", link: "how-to-share" },
                ],
            },
            {
                text: "平台优惠与独立评测",
                collapsible: true,
                children: [
                    { text: "银河录像局优惠码与评测", link: "yinheluxiangju" },
                    { text: "账号星球优惠码与评测", link: "zhanghaoxingqiu" },
                ],
            },
        ],
        "/airport/": [
            {
                text: "机场推荐与选型",
                children: [
                    { text: "机场推荐总览", link: "" },
                    { text: "稳定机场推荐排行榜", link: "best-airport-2026" },
                    { text: "性价比机场排行（按价格）", link: "best-value" },
                    { text: "机场对比表", link: "compare" },
                    { text: "机场优惠码", link: "coupons" },
                    { text: "机场库（全部评测索引）", link: "brands" },
                    { text: "便宜机场推荐（学生党）", link: "cheap-airport" },
                    { text: "一元机场与真实成本计算", link: "one-yuan-airport-cost-2026" },
                    { text: "按场景选择机场", link: "scenario-airport-ranking-2026" },
                    { text: "科学上网机场避坑指南", link: "choose-guide" },
                    { text: "Clash 机场购买前核查", link: "clash-airport-purchase-checklist" },
                    { text: "机场测评合集", link: "reviews" },
                    { text: "⚠️ 跑路风险与预警", link: "paolu" },
                ],
            },
            {
                text: "线路与机场专项",
                collapsible: true,
                children: [
                    { text: "专线机场对比（IEPL/IPLC）", link: "iepl-iplc" },
                    { text: "机场订阅导入与更新", link: "subscription-guide" },
                ],
            },
            {
                text: "订阅与客户端配置",
                collapsible: true,
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
                text: "AI 工具与平台",
                children: [
                    { text: "AI使用指南首页", link: "" },
                    { text: "ChatGPT国内注册与使用", link: "chatgpt" },
                    { text: "Claude国内注册与使用教程", link: "claude-guide" },
                    { text: "Google Gemini使用指南", link: "gemini" },
                    { text: "Grok AI注册与访问教程", link: "grok-guide" },
                ],
            },
            {
                text: "AI创作与开发",
                collapsible: true,
                children: [
                    { text: "Midjourney AI绘画教程", link: "midjourney-guide" },
                    { text: "Cursor AI编辑器教程", link: "cursor-guide" },
                    { text: "OpenClaw聚合AI教程", link: "openclaw-guide" },
                ],
            },
            {
                text: "AI中转站与模型评测",
                collapsible: true,
                children: [
                    { text: "AI中转站总览与选型指南", link: "ai-relay-stations-2026" },
                    { text: "黑喵中转站评测（国内模型）", link: "heimao-ai-review" },
                    { text: "快AI模型评测（多供应商）", link: "kuai-ai-review" },
                    { text: "科技狐模型评测（倍率与生图）", link: "keji-hu-review" },
                    { text: "犀速AI评测（国内直用Codex/Gemini）", link: "xisu-ai-review" },
                ],
            },
        ],
        "/proxy/": [
            {
                text: "入门与选购",
                collapsible: true,
                children: [
                    { text: "科学上网知识库首页", link: "" },
                    { text: "什么是翻墙？Clash教程", link: "fanqiang-guide" },
                    { text: "2026年VPN推荐完整指南", link: "vpn-tuijian-2026" },
                    { text: "2026年梯子推荐与选购", link: "tizi-guide-2026" },
                    { text: "如何选购稳定VPN机场", link: "vpn-guide" },
                    { text: "高性价比机场与Clash梯子选购", link: "cost-effective-airport-guide" },
                    { text: "机场核心关键词合并与选购指南", link: "airport-keyword-guide-2026" },
                    { text: "免费VPN真相揭秘", link: "mianfei-vpn-guide-2026" },
                    { text: "Proton、Nord 与 Urban VPN 对比", link: "proton-nord-urban-vpn-guide" },
                    { text: "免费机场与 GitHub 节点核查", link: "free-airport-github-guide" },
                ],
            },
            {
                text: "线路、协议与性能",
                collapsible: true,
                children: [
                    { text: "什么是IEPL/IPLC专线", link: "line-type-guide" },
                    { text: "三网宽带翻墙速度差异", link: "isp-speed-differences" },
                    { text: "SSR与Trojan协议性能对比", link: "protocol-comparison" },
                    { text: "Hysteria2最快协议详解", link: "hysteria-guide" },
                    { text: "AnyTLS新协议原理与配置", link: "anytls-guide" },
                    { text: "机场流媒体解锁原理解析", link: "streaming-unlock-guide" },
                ],
            },
            {
                text: "客户端、订阅与工具",
                collapsible: true,
                children: [
                    { text: "VPN下载与客户端安装", link: "vpn-download-guide-2026" },
                    { text: "Windows VPN、Radmin 与 FortiClient", link: "windows-vpn-connection-types" },
                    { text: "科学上网代理客户端下载", link: "clients" },
                    { text: "Shadowrocket小火箭完整教程", link: "shadowrocket-guide-2026" },
                    { text: "暗影火箭/小火箭官网下载与共享账号", link: "shadowrocket-official-download" },
                    { text: "Shadowrocket Windows电脑版与Shadowsocks指南", link: "shadowrocket-windows" },
                    { text: "小火箭共享账号网站与免费Apple ID获取", link: "xiaohuojian-gongxiang-zhanghao" },
                    { text: "机场自研与开源软件选择", link: "custom-client-guide" },
                    { text: "路由器科学上网配置教程", link: "router-vpn-guide" },
                    { text: "美区Apple ID注册教程", link: "apple-id-guide" },
                    { text: "电报(Telegram)注册教程", link: "telegram-guide" },
                    { text: "电报(Telegram)机器人推荐", link: "telegram-bot" },
                ],
            },
            {
                text: "故障排查与行业动态",
                collapsible: true,
                children: [
                    { text: "备用机场与双订阅策略", link: "backup-airport-guide" },
                    { text: "翻墙后必逛境外网站", link: "after-fanqiang-guide" },
                    { text: "有哪些国外网站被墙", link: "gfw-websites" },
                    { text: "国内中转拔线专线枯竭", link: "relay-crackdown-2026" },
                    { text: "中转机场的稳定替代方案", link: "relay-darkest-hour" },
                    { text: "快连VPN停运与替代推荐", link: "letsvpn-shutdown" },
                    { text: "10月 Clash Verge 与 mihomo 更新", link: "clash-verge-mihomo-october-2026" },
                ],
            },
        ],
        "/tools/": false,
        // 博客自动生成页面，不需要侧边栏
        "/tag/": false,
        "/category/": false,
        "/article/": false,
        "/star/": false,
        "/timeline/": false,
        "/links": false,
        "/stats": false,
        "/disclosure": false,
        "/privacy": false,
        "/terms": false,
        "/about": false,
        "/about/": false,
    },



    // 关闭不必要的图标插件
    plugins: {
        blog: true,
        seo: {
            customHead: (head, page, app) => {
                const upsertMeta = (attrs, content) => {
                    const key = attrs.name ? 'name' : 'property';
                    const index = head.findIndex(item => item[0] === 'meta' && item[1][key] === attrs[key]);
                    if (index !== -1) {
                        head[index][1].content = content;
                    } else {
                        head.push(['meta', { ...attrs, content }]);
                    }
                };

                // 自动生成的聚合页（标签、分类、文章列表、时间轴等）不参与索引。
                // noindex 与 sitemap 排除由 config.mjs 的 extendsPage 处理，这里只补一份简短描述。
                if (/^\/(tag|category|article|timeline|star)\//.test(page.path)) {
                    const desc = `「${page.title || '文章'}」相关文章归档，本站机场测评与科学上网教程的站内浏览入口。`;
                    upsertMeta({ name: 'description' }, desc);
                    upsertMeta({ property: 'og:description' }, desc);
                }

                // 为正文页同步社交分享标题与描述，避免只显示站点默认标题。
                const pageTitle = page.title || '机场推荐与科学上网指南';
                const pageDescription = page.frontmatter?.description || head.find(item => item[0] === 'meta' && item[1].name === 'description')?.[1].content || '机场推荐、VPN梯子、Clash配置、节点选择与流媒体解锁指南。';
                upsertMeta({ property: 'og:title' }, pageTitle);
                upsertMeta({ property: 'og:description' }, pageDescription);
                upsertMeta({ name: 'twitter:title' }, pageTitle);
                upsertMeta({ name: 'twitter:description' }, pageDescription);

                // 自动注入 Canonical 规范链接与 BreadcrumbList 面包屑 JSON-LD
                const pageUrl = `https://clash-jichang.com${page.path.replace(/\.html$/, '')}`;
                const canonical = head.find(item => item[0] === 'link' && item[1].rel === 'canonical');
                if (canonical) canonical[1].href = pageUrl;
                else head.push(['link', { rel: 'canonical', href: pageUrl }]);
                upsertMeta({ property: 'og:url' }, pageUrl);

                // BreadcrumbList：按目录层级生成（首页 > 栏目 > 当前页）
                const SECTION_NAMES = {
                    airport: '机场推荐',
                    ai: 'AI使用指南',
                    account: '账号与合租',
                    proxy: '科学上网知识库',
                    faq: '常见问题',
                    tools: '工具',
                };
                const segments = page.path.replace(/\.html$/, '').split('/').filter(Boolean);
                const crumbs = [{ name: '首页', url: 'https://clash-jichang.com/' }];
                if (segments.length > 1 && SECTION_NAMES[segments[0]]) {
                    crumbs.push({ name: SECTION_NAMES[segments[0]], url: `https://clash-jichang.com/${segments[0]}/` });
                }
                if (segments.length > 0) {
                    crumbs.push({ name: page.title || '正文', url: pageUrl });
                }
                if (page.path !== '/') {
                    head.push([
                        'script',
                        { type: 'application/ld+json' },
                        JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'BreadcrumbList',
                            itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })),
                        }),
                    ]);
                }

                // Article 结构化数据（含 datePublished / dateModified）由 SEO 插件按页面生成，这里不重复输出。

                // 对比 / 性价比 / 机场库页：ItemList，条目来自 airports.json
                if (['/airport/compare', '/airport/best-value', '/airport/brands'].includes(page.path.replace(/\.html$/, ''))) {
                    const airports = JSON.parse(readFileSync(new URL('./data/airports.json', import.meta.url), 'utf8')).filter((a) => a.status === 'active');
                    const list = page.path.includes('best-value') ? airports.filter((a) => a.fromMonthly != null) : airports;
                    head.push([
                        'script',
                        { type: 'application/ld+json' },
                        JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'ItemList',
                            name: pageTitle,
                            itemListElement: list.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.name + '机场', url: 'https://clash-jichang.com' + a.path })),
                        }),
                    ]);
                }

                // 机场目录页使用 CollectionPage + FAQPage，帮助搜索引擎理解榜单与排障内容。
                if (page.path === '/airport/' || page.path === '/airport/index.html') {
                    head.push([
                        'script',
                        { type: 'application/ld+json' },
                        JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'CollectionPage',
                                    '@id': `${pageUrl}#collection`,
                                    name: pageTitle,
                                    description: pageDescription,
                                    url: pageUrl,
                                    isPartOf: { '@id': 'https://clash-jichang.com/#website' },
                                    mainEntity: {
                                        '@type': 'ItemList',
                                        itemListElement: [
                                            { '@type': 'ListItem', position: 1, name: '稳定机场推荐', url: 'https://clash-jichang.com/airport/best-airport-2026' },
                                            { '@type': 'ListItem', position: 2, name: '便宜机场推荐', url: 'https://clash-jichang.com/airport/cheap-airport' },
                                            { '@type': 'ListItem', position: 3, name: 'IPLC/IEPL专线机场', url: 'https://clash-jichang.com/airport/iepl-iplc' },
                                        ],
                                    },
                                },
                                {
                                    '@type': 'FAQPage',
                                    '@id': `${pageUrl}#faq`,
                                    mainEntity: [
                                        {
                                            '@type': 'Question',
                                            name: '机场订阅更新失败、节点不显示怎么办？',
                                            acceptedAnswer: { '@type': 'Answer', text: '检查订阅是否过期或被截断，重新添加订阅并确认客户端支持对应协议；仍无法更新时，联系机场客服获取备用订阅地址。' },
                                        },
                                        {
                                            '@type': 'Question',
                                            name: '机场速度慢、延迟高或晚高峰变卡怎么办？',
                                            acceptedAnswer: { '@type': 'Answer', text: '分别测试香港、日本、新加坡和美国节点，再比较直连、BGP中转和IEPL/IPLC专线；持续丢包时建议准备第二个备用机场。' },
                                        },
                                        {
                                            '@type': 'Question',
                                            name: '原生IP和住宅IP机场适合哪些场景？',
                                            acceptedAnswer: { '@type': 'Answer', text: '原生IP或住宅IP更适合对地区识别敏感的流媒体、TikTok和部分AI服务，但应以实际解锁测试和服务商说明为准。' },
                                        },
                                    ],
                                },
                            ],
                        }),
                    ]);
                }

                // AI 指南与中转站评测页补充 TechArticle 语义，方便搜索与生成式检索识别主题。
                if (page.path.startsWith('/ai/')) {
                    head.push([
                        'script',
                        { type: 'application/ld+json' },
                        JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'TechArticle',
                            headline: pageTitle,
                            description: pageDescription,
                            url: pageUrl,
                            inLanguage: 'zh-CN',
                            about: {
                                '@type': 'Thing',
                                name: 'AI工具、国内模型与AI中转站',
                            },
                            author: {
                                '@type': 'Organization',
                                name: 'Clash机场推荐指南团队',
                                url: 'https://clash-jichang.com/about',
                            },
                            publisher: {
                                '@type': 'Organization',
                                name: 'Clash机场推荐指南团队',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://clash-jichang.com/logo.png',
                                },
                            },
                        }),
                    ]);
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
    toc: true,
    darkmode: "toggle",
    fullscreen: false,
    backToTop: true,
    pure: false,  // 关闭pure模式以显示侧边栏
});
