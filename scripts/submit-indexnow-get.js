/**
 * IndexNow 单URL提交方式（GET请求）
 * 绕过批量POST的站点验证要求，直接逐个提交关键URL
 */
import https from "https";

const KEY = "7ed17addd6714c9bb9398a7251d90866";
const HOST = "clash-jichang.com";

// 优先提交机场推荐核心页面 + 内链更新的高流量页面
const priorityUrls = [
  `https://${HOST}/airport/`,
  `https://${HOST}/airport/best-airport-2026.html`,
  `https://${HOST}/airport/cheap-airport.html`,
  `https://${HOST}/airport/iepl-iplc.html`,
  `https://${HOST}/proxy/letsvpn-shutdown.html`,
  `https://${HOST}/streaming/netflix-guide.html`,
  `https://${HOST}/ai/chatgpt.html`,
  `https://${HOST}/ai/claude-guide.html`,
  `https://${HOST}/airport/choose-guide.html`,
  `https://${HOST}/proxy/fanqiang-guide.html`,
];

let completed = 0;
function submitUrl(url, apiHost) {
  return new Promise((resolve) => {
    const encodedUrl = encodeURIComponent(url);
    const path = `/indexnow?url=${encodedUrl}&key=${KEY}`;
    
    const options = {
      hostname: apiHost,
      path: path,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        const status = res.statusCode;
        const icon = (status === 200 || status === 202) ? "✅" : status === 429 ? "⏳" : "❌";
        console.log(`${icon} [${apiHost}] [${status}] ${url}`);
        resolve(status);
      });
    });

    req.on("error", (e) => {
      console.log(`❌ [${apiHost}] [ERROR] ${url}: ${e.message}`);
      resolve(0);
    });
    req.end();
  });
}

console.log(`[IndexNow] 正在通过 GET 逐个提交 ${priorityUrls.length} 个优先URL...\n`);

(async () => {
  for (const url of priorityUrls) {
    for (const host of ["yandex.com", "www.bing.com"]) {
      await submitUrl(url, host);
      // 每次提交间隔200ms
      await new Promise(r => setTimeout(r, 200));
    }
  }
  console.log(`\n✅ 全部提交完成！`);
})();
