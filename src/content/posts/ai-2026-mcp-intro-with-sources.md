---
title: MCP到底是什么？一篇讲透Model Context Protocol（含架构、核心概念与落地注意事项）
summary: MCP（Model Context Protocol）是连接AI助手与外部数据/工具的开放协议。本文用工程视角讲清它的架构、核心概念、优缺点与落地坑，并附参考来源。
category: AI相关
tags: MCP,ModelContextProtocol,Agent,Tools,Resources,Prompts,协议
readingTime: 14
date: 2026-03-17
featured: true
---

# MCP到底是什么？一篇讲透Model Context Protocol（含架构、核心概念与落地注意事项）

如果你最近在开发者圈里听到越来越多的 MCP，但又觉得“看了几篇文章还是不明白它到底解决什么”，这篇就只做一件事：**把 MCP 讲清楚**。

MCP（Model Context Protocol，模型上下文协议）可以理解为一种“标准化接口”：让 AI 应用（客户端）用一致的方式连接到各种外部系统（服务器），从而拿到数据、调用工具、加载提示词模板。

它背后的直觉是：模型再强，如果被锁在对话框里，离真实数据和工具太远，输出就很难稳定；而每个工具都单独接一遍又会非常碎片化。MCP 试图用协议把这件事统一起来。

---

## 1. MCP想解决的核心问题：上下文与工具的碎片化

在真实工程里，你会遇到三个反复出现的痛点：

1) **数据在各处**：GitHub、Git、本地文件、数据库、知识库、工单系统……
2) **工具各自为政**：每接一个系统就写一套 integration，维护成本高
3) **上下文不可控**：模型到底拿到了哪些信息？有没有越权读取？能否审计？

MCP 的目标就是：
- 把“连接外部系统”变成一套 **通用协议**
- 把“模型可用的能力”变成 **可声明、可限制、可审计** 的接口

---

## 2. 架构是什么样的（用一句话 + 文字版“架构图”）

一句话：**MCP是 Client–Server 架构。**

文字版架构图：

- 你电脑上的 AI 应用（例如某个桌面客户端/IDE 插件）= **MCP Client**
- 每一个数据源/工具（GitHub、Postgres、文件系统、浏览器自动化等）= **MCP Server**
- Client 通过协议去“发现/调用” Server 提供的能力

所以你不需要给每个 AI 应用单独写 GitHub 连接器：只要有一个 GitHub MCP Server，多个 Client 都可以复用。

---

## 3. MCP的三类核心能力：Tools / Resources / Prompts

不同资料的叫法可能略有差异，但 MCP 在工程上通常围绕三类原语（primitives）：

### 3.1 Tools（工具）
**工具=可执行动作**。例如：
- 查询数据库
- 调用一个 API
- 跑一个脚本

关键点：工具是“可控的”。你能限制：允许调用哪些工具、参数范围、频率、是否需要审批。

### 3.2 Resources（资源）
**资源=可读取的上下文**。例如：
- 某个仓库 README
- 某个目录的文件
- 某份知识库文档

资源让模型不再凭空猜测，而是有依据地回答/生成。

### 3.3 Prompts（提示词模板）
**提示词=可复用的任务模板**。例如：
- “把一个 Bug 修复流程固定成模板”
- “按团队代码规范生成组件”

它的价值在于：把组织经验固化，减少临场发挥。

---

## 4. 优点：为什么它会流行

1) **标准化**：减少重复造轮子
2) **可组合**：你可以把多个 Server 组合成一个工作流（比如 GitHub + Postgres + Browser）
3) **更安全/可治理**：在协议层更容易做权限控制与审计

---

## 5. 缺点与落地坑（非常重要）

### 5.1 “协议有了，但治理没跟上”
如果你给了工具调用能力，却没有：
- allowlist
- workspace 限制
- 日志审计
- 最小权限

那就等于把风险扩大。

### 5.2 “看起来标准化，实际还是需要工程投入”
MCP 减少的是“每个地方都写一份”的成本，不是“完全不用写”。
你仍要：
- 选定你要暴露的资源/工具
- 写清楚参数 schema
- 处理错误与限流

### 5.3 “不要把它当万能钥匙”
如果任务本身不适合 Agent（例如强确定性、安全敏感、不可逆操作），就算有 MCP 也不该自动化。

---

## 6. 学习路径（建议按三步走）

1) **理解概念**：Client/Server + Tools/Resources/Prompts
2) **跑一个现成 Server**：先体验“可连接、可调用、可审计”
3) **为自己的项目做最小落地**：只暴露一两个最有价值的工具/资源（例如只读仓库 + 构建命令），把权限收紧

---

## 结论

MCP 的本质不是“又一个 AI 概念”，而是把“AI 接入真实系统”这件事做成标准化协议：更可复用、更可治理、更可审计。

你可以不立刻上 MCP，但应该尽早建立同样的工程思路：**上下文来源可控、工具调用可控、变更可验证**。

---

## 参考来源
- [Anthropic：Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [MCP 官方组织/代码仓库（spec/SDK/servers 集合入口）](https://github.com/modelcontextprotocol)
- [MCP Servers 仓库（示例服务器集合）](https://github.com/modelcontextprotocol/servers)
