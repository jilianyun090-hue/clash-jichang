import axios from 'axios';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://fanqiangnan.com/appleid.html';
const OUTPUT_FILE = path.join(process.cwd(), 'docs/airport/apple-id-shared.md');

async function fetchAppleId() {
    try {
        console.log('正在获取数据自: ' + TARGET_URL);
        const response = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = response.data;

        // 改进的提取逻辑：直接按 card 分割并提取，避免依赖可能变化的父容器结构
        const parts = html.split('<div class="account-card">');
        const cards = [];
        
        for (let i = 1; i < parts.length; i++) {
            const cardHtml = parts[i];
            
            // 提取账号 (从 copyText 提取)
            const emailMatch = cardHtml.match(/copyText\('([^']+)', this\)">复制账号/);
            // 提取密码 (从 copyText 提取)
            const passwordMatch = cardHtml.match(/copyText\('([^']+)', this\)">复制密码/);
            // 提取地区
            const regionMatch = cardHtml.match(/<div class="account-region">([^<]+)<\/div>/);
            // 提取状态
            const statusMatch = cardHtml.match(/<span class="status-text">([^<]+)<\/span>/);
            // 提取更新时间
            const timeMatch = cardHtml.match(/<div class="update-time">更新时间：([^<]+)<\/div>/);

            if (emailMatch && passwordMatch) {
                cards.push({
                    email: emailMatch[1],
                    password: passwordMatch[1],
                    region: regionMatch ? regionMatch[1].trim() : '未知',
                    status: statusMatch ? statusMatch[1].trim() : '正常',
                    time: timeMatch ? timeMatch[1].trim() : '未知'
                });
            }
        }

        if (cards.length === 0) {
            console.error('未解析到任何账号，请检查目标网站结构是否发生变化。');
            return;
        }

        // 生成 Markdown 内容
        let content = `---
title: "【免费】2026 小火箭共享账号 | 美区ID / 苹果ID共享 (已购Shadowrocket) - 每日更新"
description: "2026年最新苹果 Apple ID 共享账号，包含美区、日区、港区等已购 Shadowrocket (小火箭) 的账号，每30分钟自动更新，确保稳定可用。免费下载小火箭 VPN 必备。"
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
  - 免费节点
head:
  - - meta
    - name: keywords
      content: 小火箭共享账号, 美区ID共享, 苹果ID共享, Shadowrocket, 免费Apple ID, 小火箭下载, 科学上网, 2026苹果ID, 免费节点
  - - meta
    - name: author
      content: "道一博客"
---

# 2026 免费苹果ID (支持Shadowrocket下载) 与小火箭共享账号

![Apple ID](https://i.ibb.co/V0QLjfy5/apple-ID.jpg)

提供每30分钟自动更新的 **日区/港/台/美区苹果ID** 与免费 **小火箭VPN节点**。可用于 **Shadowrocket下载（小火箭下载）** 无需充值。账号稳定更新维护，内容一键复制。

::: danger 共享账号风险提示（必看）
1. **⚠️ 使用苹果ID必须从 App Store 登录，千万不要登录「iCloud」！** 否则可能导致锁机或者隐私泄漏！
2. **⚠️ 本站不提供任何付费解锁服务，也不会索取任何个人信息。** 任何收费解锁或信息索取行为，均为诈骗，请提高警惕。
:::

::: tip 使用须知
*   本资源来自海外社区贡献者，仅供学习和测试。请2小时内自行退出并删除。
*   登录后如弹出“开启双重认证”，请点击“**不升级**”或“**其他选项 -> 不升级**”。
*   共享账号容易被锁，如果无法登录请尝试其他账号或稍后再试。
:::

## 共享账号列表

| 地区 | 账号 | 密码 | 状态 | 更新时间 |
| :--- | :--- | :--- | :--- | :--- |
`;

        content += `<div class="accounts-grid">\n`;

        cards.forEach(card => {
            const cleanRegion = card.region.replace(/【|】/g, ''); // 移除原有的括号
            content += `
  <div class="account-card">
    <div class="card-header">
      <div class="card-email">${card.email}</div>
      <div class="card-status">${card.status}</div>
    </div>
    <div class="card-meta">
      <span class="region-badge">【${cleanRegion}】</span>
      <span class="update-time">检测: ${card.time.replace('2026-05-10', '').trim()}</span>
    </div>
    <div class="card-actions">
      <button class="btn-copy" data-copy-text="${card.email}">复制账号</button>
      <button class="btn-copy" data-copy-text="${card.password}">复制密码</button>
    </div>
  </div>`;
        });

        content += `
</div>

<style>
.accounts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 30px;
}
.account-card {
    border: 1px solid var(--c-border);
    border-radius: 12px;
    padding: 16px;
    background: var(--c-bg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
html[data-theme='dark'] .account-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.account-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
html[data-theme='dark'] .account-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-email {
    font-size: 1.05em;
    font-weight: 600;
    color: var(--c-text);
}
.card-status {
    font-size: 0.85em;
    color: #10b981;
    display: flex;
    align-items: center;
    gap: 4px;
}
.card-status::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
}
.card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85em;
}
.region-badge {
    background-color: #2563eb;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
}
.update-time {
    color: var(--c-text-light);
}
.card-actions {
    display: flex;
    gap: 12px;
    margin-top: 4px;
}
.btn-copy {
    flex: 1;
    padding: 8px 0;
    border: 1px solid var(--c-border);
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    font-size: 0.9em;
    color: var(--c-text);
    transition: all 0.2s;
}
.btn-copy:hover {
    background: var(--c-bg-mute);
    border-color: #2563eb;
    color: #2563eb;
}
</style>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const clickHandler = (e) => {
  if (e.target && e.target.matches('.btn-copy')) {
    const text = e.target.getAttribute('data-copy-text');
    if (!text) return;
    
    const btn = e.target;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showSuccess(btn));
    } else {
      let textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showSuccess(btn);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      textArea.remove();
    }
  }
};

const showSuccess = (btn) => {
  const originalText = btn.innerText;
  if (originalText === '已复制!') return;
  btn.innerText = '已复制!';
  btn.style.color = '#10b981';
  btn.style.borderColor = '#10b981';
  setTimeout(() => {
      btn.innerText = originalText;
      btn.style.color = '';
      btn.style.borderColor = '';
  }, 2000);
};

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', clickHandler);
  }
});

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', clickHandler);
  }
});
</script>

---

[回到首页](/) | [更多工具](/proxy/)
`;

        // 确保目录存在
        const dir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, content);
        console.log(`成功抓取 ${cards.length} 个账号，已更新到 ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('抓取过程中发生错误:', error.message);
    }
}

fetchAppleId();
