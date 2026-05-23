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

function submitUrl(url) {
  return new Promise((resolve) => {
    const encodedUrl = encodeURIComponent(url);
    const path = `/indexnow?url=${encodedUrl}&key=${KEY}`;
    
    const options = {
      hostname: "www.bing.com",
      path: path,
      method: "GET",
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        const status = res.statusCode;
        const icon = (status === 200 || status === 202) ? "✅" : status === 429 ? "⏳" : "❌";
        console.log(`${icon} [${status}] ${url}`);
        resolve(status);
      });
    });

    req.on("error", (e) => {
      console.log(`❌ [ERROR] ${url}: ${e.message}`);
      resolve(0);
    });
    req.end();
  });
}

console.log(`[IndexNow] 正在逐个提交 ${priorityUrls.length} 个优先URL...\n`);

(async () => {
  for (const url of priorityUrls) {
    await submitUrl(url);
    // 每次提交间隔300ms，避免限频
    await new Promise(r => setTimeout(r, 300));
  }
  console.log(`\n✅ 全部提交完成！`);
  console.log(`\n📌 提示：若全部显示202，说明Bing已接受请求，将在数小时内重新抓取这些页面。`);
})();
