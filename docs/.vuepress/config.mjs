import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.mjs";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "Clash机场推荐指南",
    description: "2026年机场推荐与VPN梯子指南：持续更新稳定机场、便宜机场、性价比机场和IPLC/IEPL专线测评，覆盖Clash、Shadowrocket、V2Ray客户端配置，以及Netflix、YouTube、TikTok和ChatGPT等流媒体与AI使用教程。",
    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        // 页面标题、摘要和类型由 SEO 插件按页面生成，避免全站重复首页元信息
        ["meta", { property: "og:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { property: "og:image:width", content: "610" }],
        ["meta", { property: "og:image:height", content: "610" }],
        // Twitter Card meta tags
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { name: "keywords", content: "机场推荐,VPN推荐,梯子推荐,机场测评,稳定机场,便宜机场,性价比机场,机场节点,IPLC机场,IEPL机场,Clash机场,Shadowrocket机场,V2Ray机场,机场订阅,节点推荐,流媒体机场,ChatGPT机场" }],
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
                        "name": "Clash机场推荐指南",
                        "description": "2026年机场推荐与VPN梯子指南，持续更新稳定机场、性价比机场、IPLC/IEPL专线测评，以及Clash、Shadowrocket和V2Ray配置教程。",
                        "inLanguage": "zh-CN",
                        "publisher": {
                            "@id": "https://clash-jichang.com/#organization"
                        }
                    },
                    {
                        "@type": "Organization",
                        "@id": "https://clash-jichang.com/#organization",
                        "name": "Clash机场推荐指南团队",
                        "url": "https://clash-jichang.com/about",
                        "logo": "https://clash-jichang.com/globe.png"
                    }
                ]
            })
        ],
    ],
    theme,
    bundler: viteBundler(),
});
