import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme.mjs";

export default defineUserConfig({
    base: "/",
    lang: "zh-CN",
    title: "道一博客",
    description: "2026年最新科学上网机场推荐与翻墙指南。我们为您精选稳定高速的翻墙机场评测，提供 Netflix、Disney+、YouTube Premium 等流媒体解锁教程与合租方案，并分享 ChatGPT、Claude、Midjourney 等前沿 AI 工具使用攻略。致力于帮助用户突破网络封锁，畅享全球互联网自由，获取最前沿的数字技术资讯与资源共享服务。",
    head: [
        ["link", { rel: "icon", href: "/favicon.png" }],
        // Open Graph meta tags for social sharing
        ["meta", { property: "og:site_name", content: "科学上网机场推荐" }],
        ["meta", { property: "og:type", content: "website" }],
        ["meta", { property: "og:image", content: "https://clash-jichang.com/globe.png" }],
        ["meta", { property: "og:image:width", content: "1200" }],
        ["meta", { property: "og:image:height", content: "630" }],
        ["meta", { property: "og:locale", content: "zh_CN" }],
        // Twitter Card meta tags
        ["meta", { name: "twitter:card", content: "summary_large_image" }],
        ["meta", { name: "twitter:image", content: "https://clash-jichang.com/globe.png" }],
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
                        "name": "道一博客",
                        "description": "2026年最新科学上网机场推荐与翻墙指南。提供稳定专线机场评测、跑路预警、客户端配置与 AI 工具指南。",
                        "inLanguage": "zh-CN",
                        "publisher": {
                            "@id": "https://clash-jichang.com/about/#organization"
                        }
                    },
                    {
                        "@type": "Organization",
                        "@id": "https://clash-jichang.com/about/#organization",
                        "name": "道一博客团队",
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
