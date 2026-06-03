/**
 * IndexNow 提交脚本（ESM 格式）
 * 每次 npm run build 后自动执行，将所有 URL 推送到 Bing 加速收录
 * 手动运行: node scripts/submit-indexnow.js
 */
import https from "https";

const INDEXNOW_KEY = "7ed17addd6714c9bb9398a7251d90866";
const HOST = "clash-jichang.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// 网站所有页面 URL 列表
const urlList = [
  // 首页
  `https://${HOST}/`,
  // 机场推荐
  `https://${HOST}/airport/`,
  `https://${HOST}/airport/best-airport-2026.html`,
  `https://${HOST}/airport/cheap-airport.html`,
  `https://${HOST}/airport/iepl-iplc.html`,
  `https://${HOST}/airport/choose-guide.html`,
  `https://${HOST}/airport/software.html`,
  `https://${HOST}/airport/client-windows.html`,
  `https://${HOST}/airport/client-android.html`,
  `https://${HOST}/airport/client-ios.html`,
  // 流媒体
  `https://${HOST}/streaming/`,
  `https://${HOST}/streaming/netflix-guide.html`,
  `https://${HOST}/streaming/disney-guide.html`,
  `https://${HOST}/streaming/youtube-guide.html`,
  `https://${HOST}/streaming/spotify-guide.html`,
  `https://${HOST}/streaming/hbo-max-guide.html`,
  `https://${HOST}/streaming/hulu-hbo-guide.html`,
  `https://${HOST}/streaming/sms-guide.html`,
  // 账号合租
  `https://${HOST}/account/platforms.html`,
  `https://${HOST}/account/price.html`,
  `https://${HOST}/account/how-to-share.html`,
  // AI 指南
  `https://${HOST}/ai/`,
  `https://${HOST}/ai/chatgpt.html`,
  `https://${HOST}/ai/claude-guide.html`,
  `https://${HOST}/ai/gemini.html`,
  `https://${HOST}/ai/grok-guide.html`,
  `https://${HOST}/ai/midjourney-guide.html`,
  `https://${HOST}/ai/cursor-guide.html`,
  `https://${HOST}/ai/openclaw-guide.html`,
  // 科学上网知识库
  `https://${HOST}/proxy/`,
  `https://${HOST}/proxy/vpn-guide.html`,
  `https://${HOST}/proxy/fanqiang-guide.html`,
  `https://${HOST}/proxy/backup-airport-guide.html`,
  `https://${HOST}/proxy/after-fanqiang-guide.html`,
  `https://${HOST}/proxy/gfw-websites.html`,
  `https://${HOST}/proxy/line-type-guide.html`,
  `https://${HOST}/proxy/isp-speed-differences.html`,
  `https://${HOST}/proxy/streaming-unlock-guide.html`,
  `https://${HOST}/proxy/protocol-comparison.html`,
  `https://${HOST}/proxy/hysteria-guide.html`,
  `https://${HOST}/proxy/clients.html`,
  `https://${HOST}/proxy/custom-client-guide.html`,
  `https://${HOST}/proxy/router-vpn-guide.html`,
  `https://${HOST}/proxy/apple-id-guide.html`,
  `https://${HOST}/proxy/telegram-guide.html`,
  `https://${HOST}/proxy/telegram-bot.html`,
  `https://${HOST}/proxy/relay-crackdown-2026.html`,
  `https://${HOST}/proxy/relay-darkest-hour.html`,
  `https://${HOST}/proxy/letsvpn-shutdown.html`,
  `https://${HOST}/proxy/pc-guide.html`,
  `https://${HOST}/proxy/phone-guide.html`,
  // 其他页面
  `https://${HOST}/airport/apple-id-shared.html`,
  `https://${HOST}/links.html`,
  `https://${HOST}/stats.html`,
];

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
