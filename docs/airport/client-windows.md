---
title: "2026 Windows 电脑端 Clash Verge Rev 科学上网客户端完整下载与配置教程（附截图）"
description: "Clash Verge Rev下载与配置教程，支持Windows、macOS、Linux三平台，附国内加速下载链接、订阅导入步骤、TUN模式开启方法。为您量身定制的2026最新评测与实战教程方案，涵盖详细平台配置指导与实用有效避坑建议，助您全面优化安全数字生活体验。 本指南为您量身定制了最新的评测数。"
head:
  - - meta
    - name: keywords
      content: Clash Verge,Clash下载,Windows翻墙,Mac翻墙,科学上网客户代理工具,TUN模式
tag:
  - Clash Verge
  - Windows
  - Mac
  - 翻墙教程
---

本教程以 **Clash Verge Rev** 为例，手把手教您完成从下载安装到成功科学上网的全过程。Clash Verge Rev 是目PC 端最推荐的代理客户端，界面清晰、内TUN 模式、支持规则分流。

## 下载安装

### Windows

| 版本 | 下载链接 | 说明 |
| :--- | :--- | :--- |
| **Windows x64** (推荐) | [国内加速下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.x64.exe) | 适用于绝大多Windows 电脑 |
| Windows ARM64 | [ARM 版本下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Windows.arm64.exe) | 适用ARM 架构设备 (Surface Pro X) |

### macOS

| 版本 | 下载链接 | 说明 |
| :--- | :--- | :--- |
| **Apple Silicon** (推荐) | [M 系列芯片下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.aarch64.dmg) | 适用M1/M2/M3/M4 芯片 Mac |
| Intel x64 | [Intel 芯片下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Mac.x64.dmg) | 适用2020 年之前的 Intel Mac |

### Linux

| 版本 | 下载链接 | 说明 |
| :--- | :--- | :--- |
| Linux x64 deb | [下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.x64.deb) | 适用Ubuntu / Debian 系发行版 |
| Linux ARM64 deb | [下载](https://file.ermao.net/files/clash-verge-rev/Clash.Verge.Linux.arm64.deb) | 适用ARM 架构 Linux |

其他版本可前往 [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases) 获取。

---

## 快速安装要

| 平台 | 安装注意事项 |
| :--- | :--- |
| **Windows** | 安装后启用「服务模式」和「TUN 模式」，并开启系统代 |
| **macOS** | 拖到应用程序后，首次运行授予网络权限，开启系统代理与 TUN |
| **Linux** | 优先使用 deb 包，安装后按提示启动服务，参考发行版文档开TUN |

---

## 配置订阅

完成安装后按以下步骤导入机场订阅。

### 第一步：获取订阅链接

登录您的机场官网，在用户面板找到"订阅链接"Clash 订阅"，复制整URL。如果还没有机场，可以参[优质线路推荐](./README.md) 选购。

### 第二步：导入订阅

1. 打开 Clash Verge Rev，点击左侧菜单中***「订阅** 选项。
2. 将复制的订阅链接粘贴到输入框中。
3. 点击 **「导入** 按钮。
4. 导入成功后，订阅列表中会出现刚才导入的配置。

::: tip 提示
订阅默认1440 分钟4 小时）自动更新一次。右键点击订编辑配置，可调整更新频率、名称等信息。
:::

### 第三步：启用服务模式TUN

1. 进入 **「设置** 页面。
2. 找到 **「服务模式**，点击右侧的"安装"按钮，安装成功后点击"启动"。
3. 打开 **「TUN 模式** 开关。
4. 打开 **「系统代理** 开关。

### 第四步：确认代理模式

进入 **「代理** 页面，确认模式设置为 **「规则**。规则模式可以让国内流量直连、国外流量走代理，是最推荐的日常使用模式。

---

## 测试连接

1. Clash Verge Rev 中点***「测试** ***「测试全部**。
2. 等待延迟测试完成，绿色表示节点可用。
3. 打开浏览器访[Google](https://www.google.com) [YouTube](https://www.youtube.com)，能正常加载说明配置成功。

---

## 常见问题 (FAQ)

### Q: 下载失败或速度很慢?

优先使用上方"国内加速下直链。如果仍然失败，尝试切换网络环境（如手机热点）或使用其他下载工具。

### Q: 订阅导入后没有节

1. 确认订阅链接是否已过部分机场的订阅链接有有效期。
2. 检查链接是否完整复制（不要遗漏开头的 `https://`）。
3. 尝试点击订阅右侧更新"按钮刷新。

### Q: TUN 模式无法启动?

1. 确保***管理员权** 运行 Clash Verge Rev。
2. 关闭其他 VPN 或代理软件（WireGuard、V2RayN 等），避免冲突。
3. Windows 用户检查是否已正确安装"服务模式"。

### Q: 规则模式没有生效?

进入「代理」页面，确认当前模式选择为「规则」而非「全局」或「直连」。切换后点击刷新订阅即可。

### Q: Clash for Windows 还能用吗?

Clash for Windows (CfW) 原作者已2023 年停止维护。推荐迁移至 Clash Verge Rev，功能完全兼容且持续更新。如仍需使用 CfW，可下载 [汉化版](https://github.com/Z-Siqi/Clash-for-Windows_Chinese/releases/)。

---

- [优质线路推荐](./README.md)
- [机场选购避坑指南](./choose-guide.md)
- [Android 客户端下载](./client-android.md)
- [iOS 客户端下载](./client-ios.md)
- [回到首页](/)
