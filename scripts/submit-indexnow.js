/**
 * IndexNow 提交脚本（ESM 格式）
 * 每次 npm run build 后自动执行，将所有 URL 推送到 Bing 加速收录
 * 手动运行: node scripts/submit-indexnow.js
 */
import https from "https";
import fs from "fs";
import path from "path";

const INDEXNOW_KEY = "7ed17addd6714c9bb9398a7251d90866";
const HOST = "clash-jichang.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// 动态从构建后的 sitemap.xml 中读取所有 URL
const sitemapPath = path.resolve("docs/.vuepress/dist/sitemap.xml");
let urlList = [];

if (fs.existsSync(sitemapPath)) {
  try {
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
    const locRegex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(sitemapContent)) !== null) {
      const url = match[1].trim();
      // 排除不必要的系统页面（如果需要），这里全部提交以加速收录
      urlList.push(url);
    }
    console.log(`[IndexNow] 成功从 sitemap.xml 解析出 ${urlList.length} 个 URL`);
  } catch (err) {
    console.error("[IndexNow] 读取/解析 sitemap.xml 失败，采用备用 URL 列表:", err);
  }
}

if (urlList.length === 0) {
  console.log("[IndexNow] ⚠️ 警告: 未能从 sitemap.xml 中提取到 URL。使用基础 URL 列表进行兜底提交。");
  urlList = [
    `https://${HOST}/`,
    `https://${HOST}/airport/`,
    `https://${HOST}/streaming/`,
    `https://${HOST}/account/platforms.html`,
    `https://${HOST}/ai/`,
    `https://${HOST}/proxy/`,
  ];
}


const payload = JSON.stringify({
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList,
});const targets = ["yandex.com", "www.bing.com", "api.indexnow.org"];

async function submitToTarget(apiHost) {
  return new Promise((resolve) => {
    const options = {
      hostname: apiHost,
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    console.log(`[IndexNow] 正在提交 ${urlList.length} 个 URL 到 ${apiHost}...`);

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        console.log(`[IndexNow] ${apiHost} 响应状态: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`[IndexNow] ✅ ${apiHost} 提交成功！`);
        } else {
          console.log(`[IndexNow] ❌ ${apiHost} 提交失败，状态码: ${res.statusCode}`);
          if (body) {
            console.log(`[IndexNow] ${apiHost} 详情: ${body}`);
          }
        }
        resolve(res.statusCode);
      });
    });

    req.on("error", (e) => {
      console.error(`[IndexNow] ${apiHost} 请求错误: ${e.message}`);
      resolve(0);
    });

    req.write(payload);
    req.end();
  });
}

(async () => {
  for (const target of targets) {
    await submitToTarget(target);
  }
})();
