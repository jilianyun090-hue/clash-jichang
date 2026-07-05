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
        // Umami 实时统计
        // 脚本从 cloud.umami.is 直接加载（翻墙用户本身开代理可正常访问）
        // data-host-url 指向同域代理，让 /api/send 上报走代理，绕过部分地区屏蔽
        // data-exclude-search: 排除搜索引擎爬虫（Bing, Google, Baidu 等）
        ["script", { defer: true, "data-website-id": "8f79ee64-6e73-47d2-b7f6-25cbe82aae0f", "data-host-url": "https://clash-jichang.com/umami", "data-exclude-search": "true", src: "https://cloud.umami.is/script.js" }],
        // Bing site verification
        ["meta", { name: "msvalidate.01", content: "35CCAB205AEAD2FDC8BEB03EB1519F89" }],
        // Google site verification
        ["meta", { name: "google-site-verification", content: "i49oHfS9JgaALfrt4GdHxUT4_XE0tAIKXPuSJNdp9F8" }],
        // Language declaration for SEO
        ["meta", { name: "content-language", content: "zh-CN" }],
    ],
    theme,
    bundler: viteBundler(),
});
