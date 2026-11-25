# Bing Webmaster Tools API 获取指南

## ✅ 步骤1：获取 API 密钥

### 1.1 访问 Bing Webmaster Tools
1. 打开 https://www.bing.com/webmasters
2. 用Microsoft账户登录（如果没有，需要注册）
3. 选择你的网站 clash-jichang.com

### 1.2 生成 API 密钥
1. 点击左侧菜单 → **设置** → **API访问**
2. 点击**创建新的API密钥**
3. 给密钥命名：例如"流量监控密钥"
4. 选择权限：
   - ✅ 查询流量数据（Traffic）
   - ✅ 查询索引覆盖（Coverage）
5. 点击**创建**

### 1.3 复制 API 密钥
- **API密钥**：长字符串，妥善保管
- **站点URL**：https://clash-jichang.com
- **用户ID**：你的Bing账户ID

---

## 📌 Bing API 密钥信息表

| 项目 | 说明 | 示例 |
| :--- | :--- | :--- |
| **API Key** | 32位的访问密钥 | `a1b2c3d4e5f6g7h8...` |
| **Site URL** | 要监控的网站 | `https://clash-jichang.com` |
| **User ID** | Bing账户ID | 在API页面可见 |

---

## ⚠️ 安全提示

- 🔒 **不要**将API密钥放在公开代码中
- 🔒 应该放在 `.env` 环境变量文件中
- 🔒 在GitHub中添加 `.env` 到 `.gitignore`

---

## 下一步

获取到API密钥后，使用以下脚本来获取数据：
1. `scripts/bing-traffic-monitor.mjs` - 获取Bing流量数据
2. `docs/.vuepress/data/bing-traffic.mjs` - 存储流量数据
3. `docs/monitoring/bing-traffic-dashboard.md` - 显示仪表板
