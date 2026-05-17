/**
 * Cloudflare Pages Function: /api/appleid
 * 代理 fanqiangnan.com/data_sync.php，实时获取共享苹果ID数据
 */
export async function onRequest(context) {
  const targetUrl = "https://fanqiangnan.com/data_sync.php";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://fanqiangnan.com/appleid.html",
        "Accept": "application/json, text/plain, */*",
      },
      cf: {
        // Cloudflare 边缘缓存 10 分钟，避免每次用户刷新都请求对方接口
        cacheTtl: 600,
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "上游数据源暂时不可用", code: response.status }), {
        status: 502,
        headers: { "Content-Type": "application/json;charset=UTF-8" },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "请求失败: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    });
  }
}
