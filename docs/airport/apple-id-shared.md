---
title: "【免费】2026 小火箭共享账号 | 美区ID / 苹果ID共享 (已购Shadowrocket) - 每日更新"
description: "2026年最新免费共享美区Apple ID账号实时自动更新，包含账号密码及使用须知。共享账号可用于从美区App Store下载Shadowrocket等代理软件，请勿修改密码或绑定支付信息，建议使用后及时退出账号，保护个人设备与数据安全。"
category:
  - 客户端下载
  - 机场工具
tag:
  - 小火箭共享账号
  - 美区ID共享
  - 苹果ID共享
  - Shadowrocket
  - 免费Apple ID
  - 小火箭下载
  - 科学上网
  - 2026苹果ID
head:
  - - meta
    - name: keywords
      content: 小火箭共享账号, 美区ID共享, 苹果ID共享, Shadowrocket, 免费Apple ID, 小火箭下载, 科学上网, 2026苹果ID
  - - meta
    - name: geo.region
      content: "CN"
  - - meta
    - name: geo.placename
      content: "China"
  - - meta
    - name: author
      content: "道一博客"
---

![Apple ID](https://i.ibb.co/V0QLjfy5/apple-ID.jpg)

每 **30 分钟**自动检测更新的美区/港区苹果 ID，可直接在 App Store 登录，用于下载 **Shadowrocket（小火箭）** 等代理软件，无需充值，一键复制即用。

::: danger 风险提示（必看）
1. **⚠️ 只能在 App Store 登录，千万不要登录「iCloud」！** 否则可能导致锁机或隐私泄漏！
2. **⚠️ 本站不提供任何付费解锁服务，也不会索取任何个人信息。** 任何收费行为均为诈骗，请提高警惕。
:::

::: tip 使用须知
- 本资源来自海外社区贡献者，仅供学习和测试，请 2 小时内自行退出并删除。
- 登录后如弹出"开启双重认证"，请点击「**不升级**」或「其他选项 → 不升级」。
- 共享账号容易被锁，登录失败请尝试下一个或稍后刷新重试。
:::

## 共享账号列表

<div id="appleid-app">
  <div class="aid-toolbar">
    <span class="aid-status" id="aid-status">⏳ 正在加载最新账号...</span>
    <button class="aid-refresh-btn" id="aid-refresh-btn" onclick="window._aidLoad && window._aidLoad()">🔄 立即刷新</button>
  </div>
  <div class="accounts-grid" id="accountsGrid"></div>
</div>

<style>
.accounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.account-card {
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 16px;
  background: var(--c-bg);
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  transition: transform .2s, box-shadow .2s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.account-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,.1);
}
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-email { font-size: 1em; font-weight: 600; color: var(--c-text); word-break: break-all; }
.card-status { font-size: .82em; color: #10b981; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
.card-status::before { content:""; display:inline-block; width:6px; height:6px; border-radius:50%; background:#10b981; }
.card-meta { display: flex; justify-content: space-between; align-items: center; font-size: .82em; }
.region-badge { background: #2563eb; color: #fff; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
.update-time { color: var(--c-text-light); }
.card-actions { display: flex; gap: 10px; }
.btn-copy {
  flex: 1; padding: 7px 0; border: 1px solid var(--c-border); border-radius: 8px;
  background: transparent; cursor: pointer; font-size: .88em; color: var(--c-text);
  transition: all .2s;
}
.btn-copy:hover { background: var(--c-bg-mute); border-color: #2563eb; color: #2563eb; }
.btn-copy.copied { border-color: #10b981; color: #10b981; }
.aid-toolbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:8px; }
.aid-status { color: var(--c-text-light); font-size: .9em; }
.aid-error { color: #ef4444; }
.aid-refresh-btn {
  padding: 5px 14px; border: 1px solid var(--c-border); border-radius: 8px;
  background: transparent; cursor: pointer; font-size: .85em; color: var(--c-text);
  transition: all .2s;
}
.aid-refresh-btn:hover { border-color: #2563eb; color: #2563eb; background: var(--c-bg-mute); }
.aid-countdown { font-size: .78em; color: var(--c-text-light); margin-left: 6px; }
</style>

<script>
(function () {
  function maskEmail(email) {
    if (!email) return '';
    const at = email.indexOf('@');
    if (at <= 2) return email;
    return email.slice(0, 2) + '***' + email.slice(at);
  }

  function copyText(text, btn) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      })
      .then(() => {
        const orig = btn.textContent;
        btn.textContent = '✅ 已复制'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
      });
  }

  function renderCards(accounts) {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    accounts.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'account-card';
      card.innerHTML = `
        <div class="card-header">
          <div class="card-email">${maskEmail(acc.fullEmail || acc.email || '')}</div>
          <div class="card-status">${acc.status || '正常'}</div>
        </div>
        <div class="card-meta">
          <span class="region-badge">【${acc.regionName || acc.region || '未知'}】</span>
          <span class="update-time">检测: ${(acc.checkTime || '').slice(11, 19) || '--'}</span>
        </div>
        <div class="card-actions">
          <button class="btn-copy" data-val="${acc.fullEmail || acc.email || ''}">复制账号</button>
          <button class="btn-copy" data-val="${acc.password || ''}">复制密码</button>
        </div>`;
      card.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => copyText(btn.dataset.val, btn));
      });
      grid.appendChild(card);
    });
  }

  // 自动刷新间隔：5 分钟
  const REFRESH_INTERVAL = 5 * 60;
  let countdown = REFRESH_INTERVAL;
  let timer = null;

  function loadAccounts() {
    const status = document.getElementById('aid-status');
    const btn = document.getElementById('aid-refresh-btn');
    if (btn) btn.disabled = true;
    if (status) { status.classList.remove('aid-error'); status.textContent = '⏳ 正在更新...'; }

    // 优先调用 CF Function 代理；本地开发时直连源接口（需浏览器支持 CORS）
    const url = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? 'https://fanqiangnan.com/data_sync.php'
      : '/api/appleid';

    fetch(url)
      .then(r => r.json())
      .then(json => {
        if (!json.success || !json.data) throw new Error('数据格式错误');
        // 只取 accounts，过滤掉 vpn_ads 节点广告
        const all = [];
        const groups = json.data.accounts || {};
        Object.values(groups).forEach(g => { if (Array.isArray(g)) all.push(...g); });
        if (all.length === 0) throw new Error('暂无可用账号，请稍后重试');
        if (status) status.textContent =
          `✅ 共 ${all.length} 个账号  |  更新于 ${new Date().toLocaleTimeString('zh-CN')}  |  5分钟后自动刷新`;
        renderCards(all);
        // 重置倒计时
        countdown = REFRESH_INTERVAL;
      })
      .catch(err => {
        if (status) {
          status.textContent = '❌ 加载失败：' + err.message;
          status.classList.add('aid-error');
        }
      })
      .finally(() => {
        if (btn) btn.disabled = false;
      });
  }

  // 暴露给刷新按钮的 onclick
  window._aidLoad = loadAccounts;

  // 倒计时 & 自动刷新
  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        countdown = REFRESH_INTERVAL;
        loadAccounts();
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { loadAccounts(); startTimer(); });
  } else {
    loadAccounts();
    startTimer();
  }
})();
</script>

---

[回到首页](/) | [客户端下载指南](/airport/software.html) | [更多工具](/proxy/)
