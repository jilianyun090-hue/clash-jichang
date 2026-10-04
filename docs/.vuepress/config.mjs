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
        // Open Graph meta tags for social sharing
        ["meta", { property: "og:site_name", content: "科学上网机场推荐" }],
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:title", content: "2026机场推荐与VPN梯子指南｜Clash机场测评" }],
        ["meta", { property: "og:description", content: "稳定机场、便宜机场与IPLC/IEPL专线测评，覆盖Clash、Shadowrocket、V2Ray配置，以及流媒体和AI使用指南。" }],
        ["meta", { property: "og:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { property: "og:image:width", content: "1200" }],
        ["meta", { property: "og:image:height", content: "630" }],
        ["meta", { property: "og:locale", content: "zh_CN" }],
        // Twitter Card meta tags
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:title", content: "2026机场推荐与VPN梯子指南｜Clash机场测评" }],
        ["meta", { name: "twitter:description", content: "稳定机场、便宜机场与IPLC/IEPL专线测评，覆盖Clash、Shadowrocket、V2Ray配置，以及流媒体和AI使用指南。" }],
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
        // Language declaration & Hreflang for global Chinese SEO
        ["meta", { name: "content-language", content: "zh-CN" }],
        ["link", { rel: "alternate", hreflang: "zh-CN", href: "https://clash-jichang.com/" }],
        ["link", { rel: "alternate", hreflang: "x-default", href: "https://clash-jichang.com/" }],
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
                            "@id": "https://clash-jichang.com/about/#organization"
                        }
                    },
                    {
                        "@type": "Organization",
                        "@id": "https://clash-jichang.com/about/#organization",
                        "name": "Clash机场推荐指南团队",
                        "url": "https://clash-jichang.com/about.html",
                        "logo": "https://clash-jichang.com/globe.png"
                    }
                ]
            })
        ],
    ],
    theme,
    bundler: viteBundler(),
});
