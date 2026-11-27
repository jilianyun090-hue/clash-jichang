# Bing IndexNow 自动提交配置

## ✅ 现状

- **项目**: clash-jichang.com
- **API Key**: `12a9889fbf3e4ca29d6272a042c1dc73`
- **自动化**: GitHub Actions 每次 push 到 main 分支后触发
- **功能**: 自动收集近 3 天有改动的页面，提交给 Bing IndexNow

## 🔧 配置步骤

### 1. 添加 GitHub Secret

在你的 GitHub 仓库中：
1. 点击 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 填写：
   - **Name**: `BING_INDEXNOW_KEY`
   - **Value**: `12a9889fbf3e4ca29d6272a042c1dc73`
4. 点击 **Add secret**

### 2. 文件配置说明

| 文件 | 作用 |
|------|------|
| `.github/workflows/indexnow.yml` | GitHub Actions 自动化工作流 |
| `scripts/submit-indexnow.js` | IndexNow API 提交脚本 |
| `docs/.vuepress/public/12a9889fbf3e4ca29d6272a042c1dc73.txt` | Bing 验证文件 |

### 3. 自动提交规则

**默认行为（push 到 main）**：
- ✅ 提交最近 3 天有改动的页面
- ✅ 提交没有 `lastmod` 的新页面
- ✅ 每次最多提交 500 个 URL
- ✅ 失败时不影响部署

**手动全量提交**（GitHub Actions UI）：
1. 点击 **Actions** 标签
2. 选择 **Submit updated URLs to IndexNow**
3. 点击 **Run workflow**
4. 勾选 **提交 sitemap 中全部 URL**
5. 点击 **Run workflow**

## 📊 监控提交状态

### 在 GitHub 中查看日志
1. 点击 **Actions**
2. 选择最新的 **Submit updated URLs to IndexNow** 运行
3. 点击 **submit** 任务查看详细日志

### 在 Bing 站长工具中查看
1. 打开 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择你的网站
3. 点击左侧 **IndexNow**
4. 查看 **已提交的 URL 列表** 和 **IndexNow 源** 统计图表

## 🛠️ 高级用法

### 环境变量

在工作流中可以配置以下环境变量：

```bash
INDEXNOW_DAYS=7       # 改为提交最近 7 天的更新（默认 3 天）
INDEXNOW_ALL=1        # 强制提交全部 URL
INDEXNOW_DRY_RUN=1    # 只打印待提交 URL，不实际发送
INDEXNOW_URLS=url1,url2  # 只提交指定 URL（逗号分隔）
```

### 本地测试

```bash
# 安装依赖
npm ci

# 构建并测试提交（干运行）
npm run build
INDEXNOW_DRY_RUN=1 INDEXNOW_KEY=12a9889fbf3e4ca29d6272a042c1dc73 npm run indexnow

# 实际提交
INDEXNOW_KEY=12a9889fbf3e4ca29d6272a042c1dc73 npm run indexnow
```

## ⚠️ 常见问题

### 403 错误

**原因**: API Key 未在 Bing 一侧关联到你的网站

**解决**:
1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择 **clash-jichang.com**
3. 点击 **IndexNow**
4. 确认 Key 已关联并保存
5. 检查 Cloudflare 防火墙是否拦截了 Bing 对验证文件的抓取

### 验证文件找不到

**原因**: `docs/.vuepress/public/12a9889fbf3e4ca29d6272a042c1dc73.txt` 未被部署

**解决**:
1. 确保文件存在于 `public` 目录
2. 重新构建并部署
3. 访问 `https://clash-jichang.com/12a9889fbf3e4ca29d6272a042c1dc73.txt` 验证

### 提交失败但构建成功

**正常现象**：脚本设计为提交失败不影响构建（见日志显示 ❌ 但构建继续）

**排查**:
1. 检查 GitHub Actions 日志中的错误信息
2. 确认 Secret 已正确添加
3. 在本地测试脚本是否正常工作

## 📈 效果预期

- **新页面**: 提交后 1-7 天内通常被 Bing 发现
- **更新页面**: 加快 Bing 重新爬取和索引
- **收录影响**: 有帮助，但不保证收录（页面质量、权重等因素同样重要）
