/**
 * IndexNow 提交脚本（ESM）
 * 构建后自动执行，只提交“近期有改动”的 URL，避免每次全站重复提交。
 *
 * 选取规则（来自构建产物 sitemap.xml）：
 *   - <lastmod> 在最近 INDEXNOW_DAYS 天内（默认 3 天）的页面
 *   - 没有 <lastmod> 的页面（新建、尚无 git 历史），视为新页面
 * 环境变量：
 *   INDEXNOW_DAYS=7      调整时间窗口
 *   INDEXNOW_ALL=1       强制提交全部 URL
 *   INDEXNOW_URLS=a,b    只提交指定 URL（逗号分隔，优先级最高）
 *   INDEXNOW_DRY_RUN=1   只打印将要提交的 URL，不发送
 *
 * 手动运行: node scripts/submit-indexnow.js
 */
import https from "https";
import fs from "fs";
import path from "path";

const INDEXNOW_KEY = "7ed17addd6714c9bb9398a7251d90866";
const HOST = "clash-jichang.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const DAYS = Number(process.env.INDEXNOW_DAYS || 3);
const MAX_URLS = 500;

const sitemapPath = path.resolve("docs/.vuepress/dist/sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.log("[IndexNow] 未找到 sitemap.xml，已跳过。");
  process.exit(0);
}

const xml = fs.readFileSync(sitemapPath, "utf8");
const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  loc: (m[1].match(/<loc>(.*?)<\/loc>/) || [])[1]?.trim(),
  lastmod: (m[1].match(/<lastmod>(.*?)<\/lastmod>/) || [])[1]?.trim(),
}));

const cutoff = Date.now() - DAYS * 24 * 3600 * 1000;
const explicit = (process.env.INDEXNOW_URLS || "").split(",").map((s) => s.trim()).filter(Boolean);
const selected = explicit.length ? explicit : entries
  .filter((e) => e.loc)
  .filter((e) => process.env.INDEXNOW_ALL === "1" || !e.lastmod || new Date(e.lastmod).getTime() >= cutoff)
  .map((e) => e.loc);

const urlList = [...new Set(selected)].slice(0, MAX_URLS);
console.log(`[IndexNow] sitemap 共 ${entries.length} 个 URL，其中近 ${DAYS} 天有改动或为新页面的有 ${selected.length} 个，本次提交 ${urlList.length} 个`);

if (urlList.length === 0) {
  console.log("[IndexNow] 没有需要提交的 URL，已跳过。");
  process.exit(0);
}
if (process.env.INDEXNOW_DRY_RUN === "1") {
  urlList.forEach((u) => console.log("  " + u));
  console.log("[IndexNow] DRY RUN：未发送。");
  process.exit(0);
}

const payload = JSON.stringify({ host: HOST, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList });

const post = (apiHost) =>
  new Promise((resolve) => {
    const req = https.request(
      {
        hostname: apiHost,
        path: "/indexnow",
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on("error", (e) => resolve({ status: 0, body: e.message }));
    req.write(payload);
    req.end();
  });

// IndexNow 协议规定：提交到任一参与的搜索引擎即会共享给其他引擎，无需向每个引擎都提交。
// 依次尝试 api.indexnow.org、Bing、Yandex，任一成功即停止。
(async () => {
  for (const apiHost of ["api.indexnow.org", "www.bing.com", "yandex.com"]) {
    const { status, body } = await post(apiHost);
    console.log(`[IndexNow] ${apiHost} 响应状态: ${status}`);
    if (status === 200 || status === 202) {
      console.log(`[IndexNow] ✅ 已通过 ${apiHost} 提交 ${urlList.length} 个 URL`);
      return;
    }
    if (body) console.log(`[IndexNow] ${apiHost} 详情: ${body}`);
    if (status === 403) {
      console.log("[IndexNow] 403 通常表示该站点在 IndexNow 一侧未通过 key 验证：请在 Bing Webmaster 的 IndexNow 页面确认 key 已关联到本站，并检查 Cloudflare 防火墙/Bot 规则是否拦截了 Bing 对 key 文件的抓取。");
    }
  }
  console.log("[IndexNow] ❌ 所有端点均提交失败（不影响构建）。");
})();
