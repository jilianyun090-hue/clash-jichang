# Bing 流量监控系统使用指南

## 🚀 快速开始

### 步骤 1：获取 Bing API 密钥

1. 访问 https://www.bing.com/webmasters
2. 登录你的 Microsoft 账户
3. 选择网站 `clash-jichang.com`
4. 点击 **设置** → **API访问** → **创建新的API密钥**
5. 复制生成的 API 密钥

**详细步骤**：见 [BING_API_SETUP.md](/BING_API_SETUP.md)

### 步骤 2：配置环境变量

在项目根目录创建 `.env` 文件：

```bash
cp .env.example .env
```

然后编辑 `.env` 文件，填入你的 API 密钥：

```
BING_API_KEY=你的_API_密钥
BING_SITE_URL=https://clash-jichang.com
```

⚠️ **安全提示**：`.env` 文件已添加到 `.gitignore`，不会被提交到 GitHub

### 步骤 3：运行监控脚本

```bash
# 手动运行一次
npm run bing:monitor

# 输出示例：
# 🔗 Bing 流量监控
#    网站: https://clash-jichang.com
#    时间: 2026-11-25 10:30:45
#
# 📡 正在请求 Bing API...
# ✅ 数据已保存
#
# 📈 Bing 流量数据：
#    点击总数: 215
#    展示总数: 2500
#    平均CTR: 8.60%
#    平均排名: 3.5
#    最近7天数据已保存
```

---

## 📊 监控仪表板

运行脚本后，数据会自动保存到：
- `docs/.vuepress/data/bing-traffic.mjs` - 数据文件
- `docs/monitoring/bing-traffic-dashboard.md` - 可视化仪表板

访问仪表板查看实时数据：
https://clash-jichang.com/monitoring/bing-traffic-dashboard.html

---

## ⏰ 自动监控（可选）

### 方案 1：使用 Cron 定时任务（Linux/Mac）

编辑 crontab：
```bash
crontab -e
```

添加每天晚上8点运行的任务：
```
0 20 * * * cd /path/to/project && npm run bing:monitor
```

### 方案 2：使用 Node.js 定时任务

```bash
npm run bing:monitor:watch
```

这会每小时运行一次监控脚本。

### 方案 3：GitHub Actions（推荐）

创建 `.github/workflows/bing-monitor.yml`：

```yaml
name: Bing Traffic Monitor

on:
  schedule:
    - cron: '0 20 * * *'  # 每天晚上8点
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Create .env file
        run: |
          echo "BING_API_KEY=${{ secrets.BING_API_KEY }}" > .env
          echo "BING_SITE_URL=https://clash-jichang.com" >> .env
      
      - name: Run Bing Monitor
        run: npm run bing:monitor
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/.vuepress/data/bing-traffic.mjs
          git commit -m "chore: update bing traffic data" || true
          git push
```

然后在 GitHub 仓库 Settings → Secrets 中添加 `BING_API_KEY`。

---

## 📈 数据解释

| 指标 | 说明 |
| :--- | :--- |
| **总点击数** | 用户在搜索结果中点击你网站的次数 |
| **总展示数** | 你的网站在搜索结果中展示的次数 |
| **平均CTR** | 点击率 = 点击数 / 展示数 × 100% |
| **平均排名** | 你的页面在搜索结果中的平均位置 |

**示例**：
- 点击数: 215，展示数: 2500，CTR = 8.6%
- 排名 3.5 意味着平均排在搜索结果第3-4位

---

## 🔍 故障排除

### 问题 1：获取数据失败

```
❌ 获取数据失败: 401 Unauthorized
```

**解决方案**：
- 检查 `.env` 文件中的 `BING_API_KEY` 是否正确
- 确认 API 密钥有效期未过期
- 在 Bing Webmaster Tools 中重新生成 API 密钥

### 问题 2：未找到 .env 文件

```
❌ 未找到 .env 文件
```

**解决方案**：
```bash
cp .env.example .env
# 然后编辑 .env，填入 API 密钥
```

### 问题 3：数据未保存

检查以下目录是否存在：
- `docs/.vuepress/data/` - 数据存储目录

如果不存在，脚本会自动创建。

---

## 💡 最佳实践

1. **安全管理 API 密钥**
   - 不要将 `.env` 提交到 GitHub
   - 在 CI/CD 中使用 Secrets 存储密钥

2. **定期运行**
   - 建议每天运行一次
   - 或在重大更新后运行一次

3. **数据分析**
   - 结合 Google Search Console 数据
   - 追踪关键词排名变化
   - 对比 Bing 和 Google 的流量

4. **监控告警**
   - 当 CTR 大幅下降时，检查排名是否下降
   - 当展示数增加但点击数减少时，检查标题和描述

---

## 📚 相关资源

- [Bing Webmaster Tools 官方文档](https://www.bing.com/webmasters)
- [Bing API 获取指南](./BING_API_SETUP.md)
- [流量仪表板](../docs/monitoring/bing-traffic-dashboard.md)
- [Google Search Console](https://search.google.com/search-console)

---

**需要帮助？**
- 检查 `BING_API_SETUP.md` 获取 API 密钥
- 查看脚本错误信息了解具体问题
- 访问 Bing Webmaster Tools 官方文档
