---
title: "Shadowrocket苹果手机配置教程：iOS小火箭订阅导入与使用指南"
description: "2026年 iOS 苹果手机 Shadowrocket 小火箭完整使用教程：如何获取美区 Apple ID 购买小火箭、订阅链接导入与一键连接配置。覆盖规则模式设置、分应用代理、HTTPS 证书安装等进阶功能，以及常见问题（无法连接、订阅过期、UDP 转发失败）的解决方案，助你快速实现 iPhone/iPad 科学上网。"
head:
  - - meta
    - name: keywords
      content: Shadowrocket,小火箭下载,iOS翻墙,iPhone科学上网,Apple ID共享,美区Apple ID,Shadowrocket教程
tag:
  - Shadowrocket
  - iOS
  - Apple ID
  - 翻墙教程
---

本教程以 **Shadowrocket (小火箭)** 为例，手把手教您在 iPhone / iPad 上完成科学上网配置。Shadowrocket 是 iOS 端最普及、最易用的代理客户端。在使用本软件前，你需要有可用的机场节点订阅，可以从 [2026年稳定便宜好用机场推荐列表](./README.md) 或专为学生推荐的 [学生党高性价比便宜机场精选](./cheap-airport.md) 中获取。

<br/>

## Shadowrocket 介绍

Shadowrocket（俗称小火箭）是一款 iOS 端的代理工具，支持 SS、Vmess、Trojan、Hysteria 2 等主流协议。售价 $2.99，一次购买永久使用。它的优势在于操作简单、社区教程多、兼容性好。

<br/>

| 特色 | 说明 |
| :--- | :--- |
| 价格 | $2.99 (一次性购买) |
| 支持协议 | SS / Vmess / Trojan / Vless / Hysteria 2 |
| 支持设备 | iPhone / iPad / Mac (M 芯片) |
| 适用人群 | 大多数用户 |
| 核心特点 | 一键导入订阅、操作最简单 |

<br/>

---

## 下载与安装

Shadowrocket 未上架中国区 App Store，需要通过 **海外 Apple ID** 下载。

<br/>

### 方式一：使用免费共享 Apple ID

如果您没有海外 Apple ID，可以使用免费共享账号下载：

<br/>

<div class="card-grid">
  <a class="card-item" href="https://ccbaohe.com/appleID/" target="_blank">
    <div class="card-title">最新免费美区Apple ID共享账号 | Shadowrocket/小火箭下载 | iOS美区账号每日更新</div>
    <div class="card-desc">最新免费共享美区Apple ID 账号，每日更新可用。提供美国、日本、韩国、香港、台湾等地区 iOS 账号，支持下载Shadowrocket（小火箭）、TikTok、ChatGPT 等海外应用。</div>
  </a>
  <a class="card-item" href="https://jilian.idid8.me/" target="_blank">
    <div class="card-title">独享账号购买、租用</div>
    <div class="card-desc">提供稳定的海外 Apple ID 独享账号购买与租用服务，账号归个人专属使用，安全无风险，适合长期下载或购买付费应用。</div>
  </a>
</div>

<br/>

### 方式二：自行注册海外 Apple ID

如果希望拥有自己的海外 Apple ID，可以自行注册美区账号。注册后在 App Store 搜索购买 Shadowrocket 即可永久使用。

<br/>

---

## 安装步骤（使用共享账号）

::: warning 重要提醒
使用共享账号时务必按以下步骤在 **App Store** 内登录，**切勿在手机“设置”中登录**，否则可能导致设备被锁定。
:::

<br/>

1.  打开手机桌面的 **App Store** 应用。
2.  点击右上角 **头像**，滑到底部，点击 **「退出登录」**。
3.  输入共享 Apple ID 账号和密码，点击 **「登录」**。
4.  弹出 Apple ID 安全页面时，选择 **「其它选项」→「不升级」**。
5.  登录成功后，App Store 会自动切换为英文界面（也可能是中文），如果没有切换请重启 App Store。
6.  搜索 **「Shadowrocket」**，确认图标正确后点击下载。也可直接点击 [Shadowrocket 下载链接](https://apps.apple.com/us/app/shadowrocket/id932747118) 跳转下载。
7.  安装完成后，**立即退出共享账号**，切回自己的 Apple ID。

<br/>

::: danger 注意辨别
App Store 中有山寨应用冒充 Shadowrocket，请认准正版图标（火箭图标，开发者为 Shadow Launch Technology Limited），售价为 $2.99。
:::

<br/>

---

## 配置订阅链接

### 第一步：获取订阅链接

登录您的机场官网，在用户面板找到“订阅链接”或“一键导入”，复制通用订阅 URL。

<br/>

### 第二步：添加订阅

1.  打开 **Shadowrocket** 应用。
2.  点击右上角的 **「+」** 按钮。
3.  类型选择 **「Subscribe」**。
4.  将复制的订阅链接粘贴到 **URL** 输入框中。
5.  点击 **「保存」**，应用会自动下载并更新配置文件。

<br/>

---

## 选择服务器

1.  订阅导入成功后，回到 Shadowrocket 主界面。
2.  可以看到订阅下方展开了 **服务器列表**。
3.  点击选择一个合适的服务器节点（推荐选择 Hong Kong、Japan 或 Singapore 节点）。

<br/>

---

## 启动代理

1.  将主界面右上角的 **总开关** 拨到「开启」位置。
2.  首次连接会弹出 VPN 配置请求，需要输入锁屏密码或通过 Face ID / Touch ID 授权。
3.  授权成功后，状态栏会出现 **VPN 图标**，表示 Shadowrocket 正在运行。

<br/>

---

## 测试连接

1.  打开 Safari 浏览器，访问 [Google](https://www.google.com)。
2.  如果 Google 能正常打开，说明配置成功。
3.  也可以在 Shadowrocket 主页点击 **「连通性测试」**，查看各节点的延迟和连通状态。

<br/>

---

## 高级设置（可选）

### 全局路由设置

| 模式 | 说明 | 推荐场景 |
| :--- | :--- | :--- |
| **配置** (推荐) | 按规则分流，国内直连，国外代理 | 日常使用 |
| **代理** | 所有流量都走代理 | 全部流量需要过墙时 |
| **直连** | 所有流量直连 | 临时关闭代理 |

<br/>

建议保持「配置」模式（即规则模式）。如果个别网站无法访问，可临时切换到「代理」模式测试。

<br/>

### 更新订阅

在主页中，点击订阅旁边的 **刷新图标** (圆形箭头)，即可手动更新订阅节点列表。

<br/>

---

## 常见问题 (FAQ)

### Q: 共享账号登录后提示“需要验证手机号”？
说明该共享账号已被 Apple 检测到异常。请更换另一个共享账号再试。前往 [免费 Apple ID 共享](https://ccbaohe.com/appleID/) 获取最新可用账号。

<br/>

### Q: 登录时提示“验证回答安全问题”？
说明操作步骤可能有误。请确保是在 **App Store 内退出登录**，而不是在手机「设置」中操作。

<br/>

### Q: Shadowrocket 连接后无法上网？
1.  检查订阅链接是否正确、是否已过期。
2.  尝试切换不同的服务器节点。
3.  检查全局路由是否设置为「配置」或「代理」。
4.  确认手机网络正常（WiFi 或移动数据可用）。

<br/>

### Q: 速度慢怎么办？
1.  点击「连通性测试」，选择延迟最低的节点。
2.  尝试切换到不同地区的节点（如从美国切换到香港或日本）。
3.  检查是否处于晚高峰时段（20:00-23:00），此时段拥堵属于正常现象。

<br/>

### Q: 能否在 iPad / Mac 上使用？

可以。Shadowrocket 支持 iPad 和搭载 M 系列芯片的 Mac。在对应设备 App Store 中使用相同的 Apple ID 登录后即可下载（需要同一个购买过 Shadowrocket 的账号）。

<br/>

---

- [优质线路推荐](./README.md)
- [机场选购避坑指南](./choose-guide.md)
- [Windows/Mac 客户端下载](./client-windows.md)
- [Android 客户端下载](./client-android.md)
- [回到首页](/)
