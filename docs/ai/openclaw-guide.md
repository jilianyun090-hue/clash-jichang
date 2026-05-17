---
title: "2026 OpenClaw（小龙虾）最全保姆级安装配置教程：AI 聚合工具完整使用指南"
description: "2026年最新 OpenClaw 安装教程，涵盖 Windows、macOS 与 Linux 平台，手把手教你配置 API Key、接入飞书/Telegram 机器人，打造你的个人 AI 智能体。本指南专门为您量身定制了最新的评测数据与全方位的实战教程，内容涵盖详细的网络平台配置指导、主流客户端的细致使..."
head:
  - - meta
    - name: keywords
      content: OpenClaw, 小龙虾, AI智能体, OpenClaw安装教程, 飞书机器人, Telegram机器人, ChatGPT接入, Claude接入, AI助理, Node.js, 2026最新教程, 大模型部署, AI工具
tag:
  - OpenClaw
  - AI智能体
  - 飞书机器人
  - Telegram机器人
  - AI工具教程
  - 2026最新
---

![OpenClaw Banner](/assets/img/guide/openclaw/banner.png)

**发布日期：2026年3月10日 (最新版)**

**OpenClaw** (俗称"小龙虾") 是一个开源的 AI 智能体网络，它可以让你轻松地把各类大模型 (ChatGPT, Claude, Kimi 等) 接入到你常用的聊天软件（飞书、Telegram、WhatsApp 等）中，打造属于你自己的 7x24 小时在线 AI 助理。

本教程整合了全网最新资源，旨在通过最通俗易懂的语言，带你从零开始完成 OpenClaw 的部署。

---

## 🛠️ 一、 准备工作：环境搭建

OpenClaw 基于 Node.js 运行，因此你的电脑必须先安装合适的环境。

### 1. 系统要求
- **macOS / Linux**: 原生支持，体验最佳。
- **Windows**: 建议使用 **WSL2** (Windows Subsystem for Linux) 或原生的 **PowerShell** (需 Node.js 22+)。

### 2. 安装 Node.js (推荐使用 nvm 管理)
我们推荐安装最新的 **Node.js 22** 版本。

- **Windows 用户**：
  1. 下载 [nvm-setup.exe](https://github.com/coreybutler/nvm-windows/releases) 并安装。
  2. 以管理员权限打开 PowerShell，运行：
     ```powershell
     nvm install 22
     nvm use 22
     ```
- **macOS/Linux 用户**：
  使用官方安装脚本：
  ```bash
  curl -fsSL https://fnm.vercel.app/install | bash
  fnm install 22
  ```

---

## 🚀 二、 安装 OpenClaw

### 1. 官方一键安装 (最推荐)
这是最简单、最稳妥的方法。

- **Windows (PowerShell)**:
  ```powershell
  iwr -useb https://openclaw.ai/install.ps1 | iex
  ```
- **macOS / Linux (Terminal)**:
  ```bash
  curl -fsSL https://openclaw.ai/install.sh | bash
  ```

### 2. 手动安装 (备选)
如果你熟悉 npm 或 pnpm，也可以直接安装：
```bash
npm install -g openclaw@latest
```

或者使用 pnpm：
```bash
pnpm add -g openclaw@latest
```

---

## ⚙️ 三、 初始配置：让小龙虾跑起来

在终端中输入以下命令启动向导：

```bash
openclaw onboard --flow quickstart
```

### 向导关键步骤说明：
1. **风险确认**：遇到 `Continue?` 选 `Yes`。
2. **选择模型**：输入你的 API Key。支持 OpenAI, Anthropic (Claude), DeepSeek, Kimi 等。
3. **工作目录**：默认回车即可 (通常在 `~/.openclaw/`)。
4. **启动网关**：配置完成后，系统会启动 Gateway。

完成上述步骤后，浏览器会自动打开控制台（默认地址：`http://127.0.0.1:18789/`）。

---

## 🤖 四、 进阶配置：接入飞书 (Lark) 机器人

这是目前国内用户最常用的场景。

### 1. 安装飞书插件
在控制台或终端执行：
```bash
openclaw plugins install @m1heng-clawd/feishu
```

### 2. 飞书开放平台配置
1. 访问 [飞书开放平台](https://open.feishu.cn/)，创建一个自建应用。
2. **启用机器人**：在应用详情页开启机器人功能。
3. **获取密钥**：复制 `App ID` 和 `App Secret` 粘贴到 OpenClaw 配置中。
4. **权限申请**：进入"权限管理"，选择批量导入，粘贴以下 JSON 权限包：
   ```json
   { "scopes": { "tenant": [ "im:message", "im:message:send_as_bot", "im:chat:readonly" ] } }
   ```
5. **事件订阅**：选择"长连接"接收事件，并添加 `im.message.receive_v1` 事件。
6. **版本发布**：创建版本并申请上线。

![飞书配置示意图](/assets/img/guide/openclaw/feishu_config.png)

### 3. 开始对话
在飞书里找到你的机器人，尝试发送一条消息。它会引导你完成最后的配对。

![成功对话截图](/assets/img/guide/openclaw/success_reply.png)

---

## 🛡️ 五、 常见问题与排坑指南

| 问题现象 | 解决方法 |
| :--- | :--- |
| **Node 版本报错** | 确认 `node -v` 结果为 22+。 |
| **端口 18789 被占用** | 使用 `openclaw gateway --port 18790` 更换端口。 |
| **飞书不回消息** | 检查"事件订阅"里的长连接是否处于"已连接"状态。 |
| **Windows 路径失效** | 尝试关闭当前窗口并重新用管理员权限打开 PowerShell。 |

---

> **💡 小贴士**：OpenClaw 的强大之处在于其 **Skill (技能)** 系统。你可以随着深入使用，慢慢给它添加"联网搜索"、"生成图片"等各种超能力。

---

- [回到首页](/)
- [查看更多 AI 工具指南](./README.md)
- [获取科学上网支持](/proxy/)
