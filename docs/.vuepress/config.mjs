import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.mjs";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "机场推荐2026｜稳定机场与便宜机场测评对比",
    description: "机场推荐与梯子推荐指南：整理38家机场的套餐价格、线路对比、优惠码，覆盖IPLC/IEPL专线机场、性价比机场。提供Clash、Shadowrocket等客户端配置教程，附机场观察、跑路预警与选购避坑指南。",
    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        // 面向 AI/LLM 的内容索引声明，提升生成式检索可发现性
        ["link", { rel: "alternate", type: "text/plain", title: "llms.txt", href: "/llms.txt" }],
        // 页面标题、摘要和类型由 SEO 插件按页面生成，避免全站重复首页元信息
        ["meta", { property: "og:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { property: "og:image:width", content: "610" }],
        ["meta", { property: "og:image:height", content: "610" }],
        // Twitter Card meta tags
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { name: "keywords", content: "机场推荐,机场测评,稳定机场,便宜机场,性价比机场,梯子推荐,VPN推荐,Clash配置,Shadowrocket,小火箭共享账号,IPLC机场,IEPL机场,科学上网,翻墙梯子,机场对比,机场订阅,letsvpn,机场推荐2026" }],
        // Umami 实时统计
        // 脚本从 cloud.umami.is 直接加载（翻墙用户本身开代理可正常访问）
        // data-host-url 指向同域代理，让 /api/send 上报走代理，绕过部分地区屏蔽
        // data-exclude-search: 排除搜索引擎爬虫（Bing, Google, Baidu 等）
        ["script", { defer: true, "data-website-id": "8f79ee64-6e73-47d2-b7f6-25cbe82aae0f", "data-host-url": "https://clash-jichang.com/umami", "data-exclude-search": "true", src: "https://cloud.umami.is/script.js" }],
        // Bing site verification
        ["meta", { name: "msvalidate.01", content: "35CCAB205AEAD2FDC8BEB03EB1519F89" }],
        // Google site verification
        ["meta", { name: "google-site-verification", content: "i49oHfS9JgaALfrt4GdHxUT4_XE0tAIKXPuSJNdp9F8" }],
        // 单语言站点声明；不为所有内页指定首页作为 alternate
        ["meta", { name: "content-language", content: "zh-CN" }],
        // GEO 地理定位标记，提升AI搜索引擎(Perplexity/ChatGPT/Bing AI)的地理覆盖识别
        ["meta", { name: "geo.region", content: "CN" }],
        ["meta", { name: "geo.placename", content: "中国" }],
        ["meta", { name: "target-audience", content: "CN,HK,TW,MO" }],
        // GEO / LLM AI 搜索引擎结构化数据图谱 JSON-LD Graph
        [
            "script",
            { type: "application/ld+json" },
            JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "WebSite",
                        "@id": "https://clash-jichang.com/#website",
                        "url": "https://clash-jichang.com/",
                        "name": "道一博客",
                        "description": "道一博客整理机场推荐、机场观察、价格与线路对比、服务状态核查及客户端教程；区分服务商公开信息与本站实际验证内容。",
                        "inLanguage": "zh-CN",
                        "publisher": {
                            "@id": "https://clash-jichang.com/#organization"
                        },
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://clash-jichang.com/?s={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    },
                    {
                        "@type": "Organization",
                        "@id": "https://clash-jichang.com/#organization",
                        "name": "道一博客团队",
                        "url": "https://clash-jichang.com/about",
                        "logo": "https://clash-jichang.com/globe.png",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "CN",
                            "addressRegion": "中国大陆"
                        },
                        "areaServed": [
                            {
                                "@type": "Country",
                                "name": "中国"
                            },
                            {
                                "@type": "Country",
                                "name": "香港"
                            },
                            {
                                "@type": "Country",
                                "name": "台湾"
                            },
                            {
                                "@type": "Country",
                                "name": "澳门"
                            }
                        ],
                        "knowsAbout": [
                            "机场推荐",
                            "VPN梯子",
                            "科学上网",
                            "网络代理",
                            "Clash配置",
                            "Shadowrocket",
                            "IPLC专线",
                            "流媒体解锁"
                        ]
                    }
                ]
            })
        ],
    ],
    // 自动生成的聚合页与辅助页：noindex,follow。sitemap 插件会跳过带 noindex 的页面。
    extendsPage: (page) => {
        const p = page.path.replace(/\.html$/, "");
        const lowValue = /^\/(tag|category|article|timeline|star)(\/|$)/.test(p) || p === "/stats" || p === "/404";
        if (lowValue) {
            page.frontmatter.head = [...(page.frontmatter.head || []), ["meta", { name: "robots", content: "noindex,follow" }]];
        }
    },
    theme,
    bundler: viteBundler(),
});
