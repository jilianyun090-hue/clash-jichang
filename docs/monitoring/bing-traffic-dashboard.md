---
title: "Bing 流量监控仪表板"
description: "实时监控网站在 Bing 搜索中的流量数据、关键词排名和点击率"
head:
  - - meta
    - name: robots
      content: noindex,follow
tag:
  - 监控
  - SEO
  - Bing流量
category: 工具
index: false
---

# Bing 流量监控仪表板

> ℹ️ **说明**：此页面用于内部监控，已设置 noindex 不参与搜索引擎索引。

## 📊 实时流量数据

<script setup>
import { bingTrafficData, bingTrafficChartData } from '../.vuepress/data/bing-traffic.mjs'
</script>

### 核心指标

| 指标 | 数值 |
| :--- | :--- |
| **总点击数** | {{ bingTrafficData.totalClicks }} |
| **总展示数** | {{ bingTrafficData.totalImpressions }} |
| **平均CTR** | {{ bingTrafficData.averageCTR }}% |
| **平均排名** | {{ bingTrafficData.averagePosition }} |
| **最后更新** | {{ bingTrafficData.lastUpdated }} |

### 最近7天趋势

::: details 数据详情

| 日期 | 点击 | 展示 | CTR | 排名 |
| :--- | :--- | :--- | :--- | :--- |
<template v-for="day in bingTrafficData.recentDays" :key="day.date">

| {{ day.date }} | {{ day.clicks }} | {{ day.impressions }} | {{ day.ctr }}% | {{ day.position }} |
</template>

:::

## 🔧 配置说明

### 1. 获取 Bing API 密钥

访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)，按照 [BING_API_SETUP.md](/monitoring/bing-api-setup.md) 获取 API 密钥。

### 2. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
BING_API_KEY=你的API密钥
BING_SITE_URL=https://clash-jichang.com
```

### 3. 运行监控脚本

```bash
# 手动运行一次
npm run bing:monitor

# 每小时自动运行
npm run bing:monitor:watch
```

## 📈 使用场景

- **SEO 效果追踪**：监控新创建页面的排名变化
- **关键词优化**：追踪关键词排名和CTR变化
- **流量分析**：了解 Bing 的流量贡献
- **数据对比**：与 Google Search Console 数据对比

## 💡 提示

- 数据更新于：{{ bingTrafficData.lastUpdated }}
- Bing 官方数据有 48 小时延迟
- 建议每天定时运行一次监控脚本
- 更多分析见 [Google Search Console](https://search.google.com/search-console)

---

**相关链接**：
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Google Search Console](https://search.google.com/search-console)
- [API 获取指南](/monitoring/bing-api-setup.md)
