---
id: claude-code-third-party-api-guide
title: Claude Code 使用教程：从上手到接入第三方 API 的完整实践
excerpt: 这篇文章从 Claude Code 是什么、如何安装和基础使用讲起，再到如何通过环境变量、LLM Gateway、云厂商通道与 MCP 接入第三方 API，适合想把 Claude Code 真正用进开发流程的人。
date: 2026-03-21
updatedAt: 2026-03-21
category: 技术
tags:
  - Claude Code
  - Anthropic API
  - 第三方 API
  - MCP
  - AI 编程
coverImage: /posts-img/claude-code-overview-shot.jpg
author: 跑路的duck
---

# Claude Code 使用教程：从上手到接入第三方 API 的完整实践

## 教程介绍

如果你这两个月一直在看 AI 编程工具，应该已经发现一个很明显的趋势：大家不再满足于“在网页里问一句、回一句”，而是更想要一个真正能进项目、能读代码、能改文件、能跑命令、还能跟外部系统打通的开发助手。

Claude Code 就是这个方向里很能打的一个产品。它不是单纯给你一个聊天框，而是把 Claude 变成一个可以直接在终端、编辑器、桌面端和 Web 里干活的 coding assistant。你可以让它分析整个仓库、修 Bug、补测试、生成提交信息，甚至接入外部 API、云厂商模型入口、MCP 服务和内部工具，把它变成你自己的开发代理。

![Claude Code 文档首页截图](/posts-img/claude-code-overview-shot.jpg)

这篇文章我按“真能落地”的方式来写，主要讲三件事：

- Claude Code 到底适合怎么用
- 新手第一次上手应该怎么装、怎么跑
- 如果你不想只走官方默认通道，如何接入第三方 API、网关和外部工具

文章内容主要参考了 Claude Code 官方文档、Anthropic 开发者文档，以及几篇开发者社区的实战文章。我把官方路线和实际可操作经验揉到一起，尽量不写那种一看就对、一做就翻车的“空气教程”。

---

## Claude Code 是什么，和普通 AI 聊天工具有什么区别

Claude Code 的核心定位，是一个可以直接参与开发流程的 AI 编程助手。根据 Claude Code 官方概览文档，它支持在终端里直接运行，可以跨多个文件理解项目结构，也能配合 VS Code、JetBrains、桌面端、Web、Slack、CI/CD 等入口一起工作。

它和普通聊天式 AI 工具最大的区别，不是“会不会写代码”，而是“能不能真正进入工作流”。Claude Code 更像一个带执行能力的开发协作者：

1. 它可以在项目目录中读取上下文，而不是只看你贴的那几段代码。
2. 它能基于自然语言完成多步任务，比如先分析、再改代码、再运行命令验证。
3. 它支持 `CLAUDE.md`、记忆机制、技能、hooks、MCP 服务器等扩展方式，可以逐步长成你团队自己的工作助手。
4. 它不只跑在一个终端里，还可以和编辑器、浏览器、云端入口协同。

![Build with Claude 页面截图](/posts-img/build-with-claude-shot.jpg)

如果你平时已经在用 VS Code、Cursor、JetBrains、GitHub Actions 这些东西，那 Claude Code 的价值会更明显。它不是取代你的开发环境，而是把 AI 能力嵌进去。

---

## Claude Code 适合什么场景

从官方文档和 Anthropic Academy 的描述来看，Claude Code 比较适合下面几类场景：

### 1. 新功能开发

比如你要加一个模块、补一个页面、做一次接口封装。你只要把目标讲清楚，它可以先规划，再动手，最后还帮你检查结果。

### 2. Bug 排查

把报错信息、复现现象或者调用链大致说清楚，它会沿着代码库往下查。这个能力对中大型项目很有价值，因为你自己查链路时最烦的就是上下文切换。

### 3. 项目杂活自动化

比如补测试、改 lint、处理批量重构、整理 release notes、写 commit message，这些重复劳动 Claude Code 很擅长。

### 4. 外部系统接入

如果你想让它读 Jira、Slack、Google Drive、设计稿、日志系统，或者让它调用你自己的内部工具，那就可以通过 MCP、网关或者第三方 API 路径把能力接进来。

![Claude API 中文文档截图](/posts-img/claude-api-docs-shot.jpg)

---

## Claude Code 怎么安装

Claude Code 官方文档目前给出了多种安装方式，终端 CLI 是最直接的入口。

### macOS / Linux / WSL

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows PowerShell

```powershell
irm https://claude.ai/install.ps1 | iex
```

### Windows CMD

```bash
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

安装完成后，在你的项目目录执行：

```bash
cd your-project
claude
```

第一次运行时，会提示登录。官方文档说明，多数入口都需要 Claude 订阅或 Anthropic Console 账号。对于 Windows，官方还特别提示要先装 Git for Windows，因为命令执行和 shell 相关能力依赖它。

如果你偏好图形界面，也可以直接使用 Claude Code 的 VS Code 扩展、JetBrains 插件、桌面应用或者 Web 版本。CLI 仍然是最强的入口，但图形界面对很多人更友好，尤其是看 diff、切会话、并行开任务的时候。

![Anthropic Console 页面截图](/posts-img/anthropic-console-shot.jpg)

---

## 上手之后，先学会这几个基本用法

很多人第一次装完 Claude Code，会陷入一种很常见的误区：把它当“终端版聊天框”来用。这当然也能用，但其实有点浪费。

更推荐的使用方式，是直接给它完整目标，而不是只给一个问题。

### 1. 让它先做代码库理解

比如：

```bash
claude "帮我梳理这个项目的目录结构、启动方式、核心模块和数据流" 
```

这一步的意义，是让它先理解仓库，而不是上来就瞎改。官方也建议新用户从 codebase Q&A、小型 bug 修复和 feature request 开始，而不是一开始就把整个系统扔给它让它“自己发挥”。

### 2. 让它先做计划

比如：

```bash
claude "为这个登录模块重构方案先给我一个计划，不要直接改代码"
```

这个习惯特别值钱。先计划，再执行，能明显降低“AI 一本正经写歪了”的概率。

### 3. 用自然语言描述开发目标

比如：

```bash
claude "给文章系统加一个标签页，展示最近 10 篇技术文章，并补上对应路由和样式"
```

比起手动告诉它改哪几行，你更应该告诉它目标、边界和限制。

### 4. 配好 `CLAUDE.md`

Claude Code 官方文档反复强调，`CLAUDE.md` 是长期使用的关键。你可以把这些信息写进去：

- 项目启动命令
- 技术栈约定
- 目录结构说明
- 团队代码风格
- 常见测试方式
- 不要碰的敏感区域

这样 Claude Code 每次进项目时就不是“失忆状态”，而是自带项目背景。

---

## Claude Code 接入第三方 API，到底在说什么

很多人一看到“第三方 API 接入”，第一反应是：是不是要自己重新造一个 Claude 的 SDK？其实不是。

Claude Code 里“接第三方 API”常见有四种路线，难度和适用场景各不相同：

### 第一种：通过兼容网关或代理改写 API 入口

也就是不直接走 Anthropic 默认的官方入口，而是把请求转发到一个你可控的地址。官方在企业部署和 LLM Gateway 文档里明确给出了这种能力，典型变量包括：

- `ANTHROPIC_BASE_URL`
- `ANTHROPIC_BEDROCK_BASE_URL`
- `ANTHROPIC_VERTEX_BASE_URL`

这类方式适合：

- 团队内部统一做鉴权和额度管理
- 想把 Claude Code 接到自己的 AI 网关
- 想统一计费、限流、审计和日志采集

### 第二种：通过云厂商入口接入 Claude 模型

官方支持通过 Amazon Bedrock、Google Vertex AI、Microsoft Foundry 等路径使用 Claude Code。也就是说，你底层虽然还是 Claude 模型，但账户体系、权限体系、区域和计费方式来自第三方云平台。

### 第三种：通过 MCP 接入外部工具和外部服务

这不是替换模型接口，而是扩展 Claude Code 的“手脚”。比如让它访问 Jira、Slack、Notion、Google Drive、数据库、内部 API、日志平台等等。

### 第四种：你自己写一个中间层服务

如果你有自己的后端，可以把第三方 API 封装成内部接口，然后再通过 MCP 或网关方式交给 Claude Code 调用。这种最灵活，但也最考验你自己是否愿意维护。

![Claude Code 第三方集成文档截图](/posts-img/claude-code-integrations-shot.jpg)

---

## 方案一：最直接的第三方 API 接法——改环境变量

如果你当前的目标很简单，只是希望 Claude Code 不直接走默认官方入口，而是改走你自己的中转、代理或者统一网关，那么最直接的方案就是配置环境变量。

### macOS / Linux / WSL

```bash
export ANTHROPIC_BASE_URL="https://your-gateway.example.com/api"
export ANTHROPIC_AUTH_TOKEN="your-token"
```

为了避免每次开终端都重新配一遍，建议写进 `~/.zshrc` 或 `~/.bashrc`：

```bash
nano ~/.zshrc
source ~/.zshrc
```

### Windows CMD

```bash
setx ANTHROPIC_BASE_URL "https://your-gateway.example.com/api"
setx ANTHROPIC_AUTH_TOKEN "your-token"
```

Windows 这边最容易翻车的地方就两个：

1. 你设置完环境变量以后没有重开终端
2. 你把变量配到了一个当前 shell 看不到的位置

开发者社区那篇 Windows/macOS 实战文章里也专门提到，Windows 下环境变量改完以后，最好直接关掉所有终端窗口重新开，不然看着像配好了，实际 Claude Code 根本没吃到。

你可以用下面的命令检查：

macOS / Linux：

```bash
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_AUTH_TOKEN
```

Windows：

```bash
echo %ANTHROPIC_BASE_URL%
echo %ANTHROPIC_AUTH_TOKEN%
```

如果能正确输出，说明至少环境层已经通了。

---

## 方案二：通过 Amazon Bedrock、Vertex AI、Foundry 接入

这条路线很适合企业团队，因为权限、审计、账单、区域、合规要求都可以挂在已有云平台下面。

Claude Code 官方第三方集成文档给出的配置方式比较明确。

### Amazon Bedrock

```bash
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_REGION=us-east-1
```

如果你还要经过 LLM Gateway：

```bash
export ANTHROPIC_BEDROCK_BASE_URL='https://your-llm-gateway.com/bedrock'
export CLAUDE_CODE_SKIP_BEDROCK_AUTH=1
```

### Google Vertex AI

```bash
export CLAUDE_CODE_USE_VERTEX=1
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_VERTEX_PROJECT_ID=your-project-id
```

如果走网关：

```bash
export ANTHROPIC_VERTEX_BASE_URL='https://your-llm-gateway.com/vertex'
export CLAUDE_CODE_SKIP_VERTEX_AUTH=1
```

### Microsoft Foundry

```bash
export CLAUDE_CODE_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-resource
export ANTHROPIC_FOUNDRY_API_KEY=your-api-key
```

如果走网关：

```bash
export ANTHROPIC_FOUNDRY_BASE_URL='https://your-llm-gateway.com'
export CLAUDE_CODE_SKIP_FOUNDRY_AUTH=1
```

官方建议在配置完成后，用 `/status` 检查代理和网关配置是否生效。这个习惯非常重要，因为很多人以为自己“已经切成功了”，实际 Claude Code 还在走旧配置。

---

## 方案三：通过 MCP 把第三方服务接进 Claude Code

如果你理解成“改模型入口”是给 Claude Code 换后端，那 MCP 更像是给 Claude Code 加外挂。

官方文档里把 MCP 定义为连接外部数据源和工具的开放标准。你可以把它理解成一层标准化的工具协议，让 Claude Code 能安全地调用外部能力。

典型场景包括：

- 读 Google Drive 里的文档
- 更新 Jira 任务
- 看 Slack 消息
- 查询内部数据库
- 调用公司自己的 REST API
- 接日志检索、监控、告警系统

如果你团队内部已经有很多系统服务，MCP 基本是最值得投入的一条路。官方甚至建议由一个中心团队统一维护 MCP 服务器，并把 `.mcp.json` 配进代码库，让所有成员共享。

一个非常简化的思路大概是这样：

1. 你先写一个服务，把目标 API 包起来。
2. 这个服务按 MCP 协议暴露工具。
3. 在项目里配置 `.mcp.json`。
4. Claude Code 会在会话里识别并调用这些工具。

举个非常常见的例子，如果你要把一个内部工单系统接入 Claude Code，可以设计这样的工具：

- `search_ticket`
- `get_ticket_detail`
- `create_ticket_comment`
- `list_assignee_tasks`

然后把这些能力交给 Claude Code。这样它就不只是“告诉你下一步干嘛”，而是真的能去系统里做事。

---

## 方案四：直接调用 Claude API，自己做外部服务封装

有些团队不一定第一时间用 Claude Code 的完整能力，而是先自己把 Claude API 用起来，再逐步和 Claude Code 集成。这种做法也很常见。

Anthropic 开发者文档和技术博客里，对 Messages API 的使用说明都比较清楚。你可以先从最基础的 REST 调用开始。

### cURL 示例

```bash
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1000,
    "messages": [
      {"role": "user", "content": "帮我解释一下 MCP 的用途"}
    ]
  }'
```

### Node.js SDK 示例

```bash
npm install @anthropic-ai/sdk
```

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1000,
  messages: [
    { role: 'user', content: '为一个前端项目写一个 API 封装层示例' }
  ]
});

console.log(response.content[0].text);
```

### Python SDK 示例

```bash
pip install anthropic
```

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1000,
    messages=[
        {"role": "user", "content": "帮我生成一个 Python FastAPI 的鉴权中间件示例"}
    ]
)

print(response.content[0].text)
```

如果你打算让 Claude Code 间接使用这些能力，比较实用的做法是：

- 先把你自己的业务 API 封成标准 REST 服务
- 再用 MCP 把这些服务变成工具
- 最后让 Claude Code 调用这些工具

这样结构更清晰，维护起来也不会乱成一锅粥。

---

## 一个推荐的实战接入方案

如果你问我，个人开发者和小团队应该怎么选，我会给一个很务实的建议。

### 个人开发者

优先顺序可以是：

1. 先直接装 Claude Code 官方 CLI
2. 用 `CLAUDE.md` 固化项目说明
3. 如果有网络、计费或统一入口需求，再加 `ANTHROPIC_BASE_URL`
4. 如果有外部系统需求，再逐步加 MCP

### 团队使用

更推荐这样：

1. 用统一的云平台入口，比如 Bedrock、Vertex 或 Foundry
2. 中间加 LLM Gateway 做鉴权、审计和预算控制
3. 在仓库层维护 `CLAUDE.md`
4. 由平台团队统一维护 MCP 服务
5. 对不同仓库设置统一安全策略和权限边界

这个路线的好处是，前期可能麻烦一点，但一旦铺开，团队里每个人的 Claude Code 体验会稳定很多，不容易出现“同样的工具，我这边能跑，你那边死活不行”的喜剧情况。

---

## 接入第三方 API 时最容易踩的坑

### 1. 以为自己改了入口，实际上没生效

最典型的就是环境变量设了，但当前 shell 没刷新，或者 Windows 的 PATH / setx 没生效。解决办法很朴素：改完就重开终端，必要时直接重启。

### 2. 把“第三方 API”理解成“任何模型都能无缝平替”

这事没那么丝滑。Claude Code 官方明确支持的是 Anthropic 直连、Bedrock、Vertex、Foundry 以及网关路线。你如果要接完全不同协议、不同参数风格的模型，就需要中间层做兼容，而不是指望直接换一个地址就完事。

### 3. 没有做统一日志和错误处理

如果你接了第三方网关，最少要记录：

- 请求时间
- 调用模型
- 鉴权用户
- 失败原因
- 响应时延
- 额度消耗

否则出现问题时，你会进入一种经典状态：你知道坏了，但你完全不知道坏在哪。

### 4. 没有给 Claude Code 明确边界

接入能力越强，越要控制权限。特别是 MCP 工具能直接调内部系统时，一定要控制“能看什么、能写什么、能改什么”。官方也建议用安全策略去定义 Claude Code 允许和不允许执行的动作。

### 5. 不写 `CLAUDE.md`

这个坑最常见也最容易避免。很多人一边抱怨 Claude Code“不懂我项目”，一边项目根目录里什么上下文都没给。你不给，它当然只能猜。AI 再聪明，也不能靠通灵做团队协作。

---

## 一套适合新手的最小可用流程

如果你想今天就把 Claude Code 跑起来，并且顺手接一个第三方入口，我建议按这条路线走：

### 第一步：安装 Claude Code

按官方脚本装好 CLI，确保 `claude --version` 能输出版本。

### 第二步：在项目根目录新建 `CLAUDE.md`

至少写清楚：

- 项目技术栈
- 启动命令
- 常用测试命令
- 代码风格
- 重点目录说明

### 第三步：配置第三方网关环境变量

例如：

```bash
export ANTHROPIC_BASE_URL="https://your-gateway.example.com/api"
export ANTHROPIC_AUTH_TOKEN="your-token"
```

### 第四步：启动 Claude Code

```bash
claude
```

### 第五步：先做一个小任务验证

比如：

```bash
claude "先分析这个项目的启动流程，再帮我找出可能的配置风险，不要直接改文件"
```

### 第六步：如果要接外部系统，再加 MCP

从最简单的一个工具开始，比如日志查询、工单查询、内部配置读取，不要一口气接十几个服务。那样很容易把自己接成一个大型事故现场。

---

## 我的建议：别把 Claude Code 只当“写代码机器人”

看完官方文档和几篇技术博客后，我越来越觉得，Claude Code 真正强的不是“生成一段代码”，而是“把 AI 放进开发工作流”。

如果你只是偶尔问几句代码问题，那它和普通 AI 助手的差距不会特别大。但如果你愿意把项目说明、工作习惯、外部工具、云平台入口、团队规范都逐步接进来，它会越来越像一个熟悉你项目的长期协作者。

你不一定要一上来就搭全套企业级架构。最推荐的顺序其实很简单：

先安装，再写 `CLAUDE.md`，再尝试通过环境变量走第三方入口，最后视需要接 MCP。一步一步来，成本最小，也最不容易翻车。

---

## 参考资料

1. [Claude Code Overview - Claude Code Docs](https://code.claude.com/docs/en/overview)
2. [Enterprise Deployment Overview / Third-party Integrations - Claude Code Docs](https://code.claude.com/docs/en/third-party-integrations)
3. [Claude API Documentation（中文）](https://platform.claude.com/docs/zh-CN/home)
4. [Build with Claude - Anthropic Academy](https://www.anthropic.com/learn/build-with-claude)
5. [在 Windows & macOS 上安装 Claude Code，并使用第三方 Key 的完整教程 - CSDN](https://blog.csdn.net/qq_42801126/article/details/157763644)
6. [Claude API Integration Guide 2025: Complete Developer Tutorial with Code Examples - Collabnix](https://collabnix.com/claude-api-integration-guide-2025-complete-developer-tutorial-with-code-examples/)
