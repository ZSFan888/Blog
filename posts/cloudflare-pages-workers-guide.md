---
id: cloudflare-pages-workers-guide
title: Cloudflare Pages 和 Workers 详解：怎么选、能做什么、适合哪些项目
excerpt: 这篇文章系统梳理 Cloudflare Pages 和 Workers 的定位、差异、典型场景、组合方式与上手路径，并结合官方文档和社区实战经验，帮助你判断什么时候该用 Pages，什么时候该直接上 Workers。
date: 2026-03-21
updatedAt: 2026-03-21
category: 技术
tags:
  - Cloudflare
  - Pages
  - Workers
  - 边缘计算
  - 全栈开发
coverImage: /posts-img/cloudflare-dev-products-preview.png
author: 跑路的duck
---

# Cloudflare Pages 和 Workers 详解：怎么选、能做什么、适合哪些项目

## 教程介绍

这两年 Cloudflare 的开发者产品线越来越像一整套平台，而不再只是“给网站套个 CDN”。如果你最近在看独立开发、出海项目、个人博客、API 服务或者全栈应用，大概率已经频繁看到两个名字：**Cloudflare Pages** 和 **Cloudflare Workers**。

很多人第一次接触这两个产品时，都会有点懵：Pages 看起来像静态站点托管，Workers 看起来像边缘函数平台，但文档里它们又经常互相提到，甚至连控制台都放在同一个入口里。说白了，这俩既有分工，也有重叠，不搞清楚边界，项目一开始就很容易选型拧巴。

![Cloudflare 开发者平台总览图](/posts-img/cloudflare-dev-products-preview.png)

这篇文章我尽量按“先讲人话，再讲技术”的顺序来写，重点回答这几个问题：

- Cloudflare Pages 到底是什么，适合什么类型的网站
- Cloudflare Workers 和传统 Serverless 有什么不一样
- Pages 和 Workers 的边界分别在哪，重叠在哪里
- 什么时候应该选 Pages，什么时候该直接用 Workers
- 如果想做一个完整项目，这两个产品应该怎么组合

这篇内容主要参考了 Cloudflare 官方产品页、开发者文档、参考架构，以及几篇社区里的实战教程。我会尽量把官方表述和实际开发体验揉在一起，不写那种看着很懂、做起来一地问号的“官方翻译腔”。

---

## 先说结论：Pages 更像部署入口，Workers 更像运行平台

如果你只想先记一句话，那就是：**Pages 更接近前端项目和站点部署体验，Workers 更接近真正的边缘运行时与应用平台。**

Cloudflare 对 Pages 的官方定义是“无服务器全栈开发人员平台”，强调的是构建、协作、测试和部署，尤其适合直接从 Git 仓库把前端项目发到全球网络。它的重点在于开发者能不能更快上线站点、能不能方便接 Git、能不能自动预览、能不能顺手挂上动态能力。

而 Workers 的官方定义更直接：一个“在 Cloudflare 全球网络上构建、部署和扩展应用的无服务器平台”，而且是基于 V8 isolates 跑代码，不需要你自己维护基础设施。它的核心不只是“托管页面”，而是**处理请求、承接业务逻辑、连接存储、跑后台任务、构建 API、做边缘计算**。

![Cloudflare 核心服务预览图](/posts-img/cloudflare-core-services-preview.png)

所以你可以这样理解：

- 如果你脑子里想的是“把 React / Next / Astro / Hugo 之类的网站快速发出去”，你更容易先想到 Pages。
- 如果你脑子里想的是“我要一个全球分发的 API / 鉴权层 / 边缘逻辑 / 数据处理服务”，你更应该先想到 Workers。
- 如果你想做的是完整应用，那最后大概率会走向 **Pages + Workers + D1 / KV / R2** 这样的组合。

---

## Cloudflare Pages 是什么

Cloudflare Pages 最开始给很多人的印象就是“Cloudflare 版 Vercel / Netlify 的静态站点托管”。这个理解不算错，但只说一半。

从官方产品页和文档来看，Pages 的几个核心点非常清晰。

### 1. 它对 Git 工作流特别友好

你可以直接连接 GitHub 或 GitLab，把仓库接进来，推送代码后自动触发构建和部署。这也是很多人第一次上手 Pages 最顺手的地方：**不需要自己搭 CI，不需要手传产物，不需要额外维护服务器**。

社区实战文章里普遍都把这个当成最大优点之一，尤其是个人博客、文档站、作品集、小型产品官网，基本十几二十分钟就能跑起来。

### 2. 它天然适合静态站点和前端项目

Pages 官方文档明确支持通过 Git 集成、Direct Upload，或者命令行方式部署项目。它也提供一堆框架指南，常见的 React、Hugo、Next.js 等都能找到对应路线。

![Cloudflare DNS / 平台配置页面截图](/posts-img/cloudflare-dns-setup-shot.jpg)

对于下面这些项目，Pages 会非常顺手：

- 技术博客
- 文档站
- 落地页
- 作品集网站
- 以静态内容为主、动态能力较少的前端项目

### 3. 它不是纯静态，能挂动态能力

这一点很关键。Pages 文档里明确有 **Pages Functions**，也就是你可以在 Pages 项目里部署服务端代码，为前端站点补动态功能，而不用单独再起一台服务器。

比如这些场景就很典型：

- 表单提交
- 简单 API
- SSR 页面逻辑
- 登录态处理
- 内容重写和边缘路由

这也是为什么很多人第一次看 Pages 会有点迷糊：它一开始像静态托管，但实际已经可以覆盖到不少“轻全栈”场景。

### 4. 它的预览部署体验很好

Pages 的一个非常实用的点，是每次提交都可以生成独立预览链接，方便你给同事、设计师或者自己做验收。这种体验对前端协作真的很有用，尤其是样式调整、内容校对和 PR 检查阶段。

### 5. 它对小团队和个人项目很友好

Cloudflare 官方产品页提到，Pages 所有计划都支持无限站点、席位、请求和带宽。文档里还提到 Free 计划每月有 500 次部署额度。对于个人博客、轻量产品、Demo 项目，这个门槛低得有点过分友好。

---

## Cloudflare Workers 是什么

如果说 Pages 更像“把项目发出去”的入口，那 Workers 更像整个 Cloudflare Developer Platform 的发动机。

Cloudflare Workers 官方文档里给出的描述非常明确：它是一个可以用单条命令构建、部署、扩展应用的平台，跑在 Cloudflare 全球网络上，没有基础设施管理负担。

### 1. 它的核心是边缘运行时

Workers 最特别的一点，是它不是传统意义上的容器或虚拟机模型，而是基于 **V8 isolates**。Cloudflare 在产品页里明确强调，这种架构让运行时几乎不用等待实例加载，因此可以显著减少冷启动。

这也是 Workers 经常被拿来和传统 Serverless 对比的原因。社区文章里把这个差异说得更直白：传统函数平台更像“先把环境拉起来再跑代码”，而 Workers 更像“运行时本来就在那，你的代码被迅速装进去执行”。

![Cloudflare 控制台页面截图](/posts-img/cloudflare-dashboard-shot.jpg)

对开发者来说，这意味着两件事：

- 请求离用户更近，全球延迟更均匀
- 做 API 网关、鉴权、中间层、边缘改写这类逻辑时特别顺手

### 2. 它不只是函数，而是一整套应用平台

看 Workers 文档目录你就会发现，它早就不是“写个 fetch handler 就完事”的时代了。现在围绕 Workers 的平台能力非常完整，常见的包括：

- KV：低延迟键值存储
- D1：Serverless SQL 数据库
- R2：对象存储
- Durable Objects：有状态协调和实时场景
- Queues：异步消息队列
- Workflows：长流程编排
- Workers AI：模型推理
- Browser Rendering：无服务器浏览器实例

这意味着 Workers 不是单独一个函数运行时，而是一整套围绕边缘应用搭建出来的生态。

### 3. 它适合动态逻辑和服务层

从官方说明和社区实践看，Workers 最适合这些方向：

- API 服务
- 代理层和 BFF
- CORS / 鉴权 / 限流中间层
- Webhook 接收器
- 边缘内容改写
- URL 短链
- 边缘缓存控制
- 轻量实时协作或状态协调

社区教程里也经常拿 **API 代理**、**短链接服务**、**Webhook 处理** 这几个例子来演示，因为这些场景能把 Workers 的低延迟和全球分发优势体现得很明显。

### 4. 它现在也能托管前端资源

这是 2025 到 2026 年很多人选型观念变化的关键点之一。Workers 文档里已经明确提供 **Static Assets** 能力，而且支持把 Worker 代码和静态资源一起部署。文档甚至直接给出 React SPA + API Worker 的示例，也支持通过 Vite 插件来做前端 + 后端一体化开发。

这意味着，**Workers 正在吞掉一部分过去更偏向 Pages 的能力边界**。

---

## Pages 和 Workers 到底差在哪

这一段是整篇最关键的部分。

### 1. 入口心智不同

Pages 的入口心智是“我有一个站点或前端项目，要快速部署上线”。

Workers 的入口心智是“我要一个运行逻辑的地方，并且这个地方最好离用户很近、扩展能力很强”。

两者不是互斥，而是起点不同。

### 2. 默认开发体验不同

Pages 更像是：

- 连接 Git 仓库
- 设构建命令
- 自动构建
- 自动生成预览链接
- 站点部署为中心

Workers 更像是：

- 用 Wrangler 或脚手架起项目
- 写 Worker 代码
- 配 bindings 和配置文件
- 部署运行逻辑
- 应用运行时为中心

### 3. 默认适合的项目不同

Pages 天然更适合内容型站点和前端项目。

Workers 天然更适合动态能力更重的服务型项目。

### 4. 平台边界正在收敛

以前你可以粗暴地说：Pages 管前端，Workers 管后端。现在这么说已经不太准确了。

因为：

- Pages 有 Functions
- Workers 有 Static Assets
- Workers 有 Vite 插件，可以做完整前端项目
- Pages 和 Workers 都能接到 Cloudflare 的其他数据与存储产品

![Cloudflare 平台设置相关页面截图](/posts-img/cloudflare-settings-blog-shot.jpg)

所以现在更合理的说法是：

- **Pages 更偏前端部署体验**
- **Workers 更偏统一运行平台**

也正因为如此，Cloudflare 文档里甚至专门给了 **从 Pages 迁移到 Workers** 的路线。这件事本身已经说明：Workers 在成为更底层、更统一的平台。

---

## 什么时候选 Cloudflare Pages

如果你的项目有下面这些特征，优先选 Pages 基本不会错。

### 1. 你主要在做网站，而不是服务平台

比如博客、文档站、个人主页、企业官网、落地页。这类项目对“Git 一推即发”“自动 HTTPS”“自定义域名”“预览部署”更敏感，而不是对复杂运行时能力更敏感。

### 2. 你希望最少配置就上线

Pages 的强项就是少折腾。尤其是和 Git 集成以后，整个过程非常接近现代前端开发者熟悉的托管体验。

### 3. 你需要一点动态能力，但不想把项目复杂度拉太高

比如只是想做评论提交、邮件订阅、简单登录、少量 SSR，这时 Pages Functions 通常够用。

### 4. 你是内容型项目或营销型项目

这类项目最看重的不是复杂后端，而是上线速度、全球访问速度、域名接入、基础安全和低维护成本。Pages 在这个点上确实很香。

---

## 什么时候该直接上 Workers

如果你的项目更像“应用”而不是“网站”，那你应该更认真看 Workers。

### 1. 你要做 API、代理层或边缘逻辑

这种场景几乎就是 Workers 主场。比如：

- 给前端做 BFF
- 统一接第三方 API
- 在边缘做鉴权和路由
- 做地理位置相关响应
- 做 A/B 实验逻辑

### 2. 你需要连接数据库或平台服务

如果项目很快就会接 D1、KV、R2、Queues、Durable Objects 这些能力，那么直接从 Workers 思维起步会更顺。

### 3. 你想把前端和后端统一到一个部署单元里

Workers Static Assets 文档里明确说了，静态资源和 Worker 代码可以作为一个“紧密集成的部署单元”一起发出去。对于一些全栈应用、SPA + API 项目，这种模式反而比拆成多个服务更干净。

### 4. 你对运行时细节和控制力更敏感

Pages 更强调“快上手”；Workers 更强调“你能真正掌控应用能力”。如果你已经知道自己要做的不只是托管页面，那往 Workers 走通常更长久。

---

## 如果做完整项目，Pages 和 Workers 怎么配合

Cloudflare 官方全栈参考架构其实已经把这件事讲得很清楚了：前端、动态请求、数据存储、对象存储、队列、AI 与可观测能力，都是可以在同一套平台上组合的。

最常见的组合思路一般有三种。

### 方案一：Pages + Pages Functions

适合：博客、文档站、营销站、小型内容产品。

特点是前端项目部署最省心，动态能力够用，复杂度最低。

### 方案二：Pages + Workers + D1 / R2

适合：需要网页前端，但后端逻辑开始变复杂的项目。

比如用户系统、内容管理、图片上传、在线编辑、评论系统，这时候前端继续走 Pages，后端逻辑走 Workers，再配 D1 和 R2，会是很自然的路线。

社区里那个基于 **Pages + Workers + D1 + R2** 的动态博客案例，就是非常典型的 Cloudflare 全家桶实践：前端页面由 Pages 托管，后端接口跑在 Workers 上，数据落 D1，图片放 R2。对于独立开发者来说，这套组合非常有吸引力，因为它把“低成本上线”和“功能完整度”卡在了一个很舒服的位置。

### 方案三：纯 Workers 全栈

适合：更强调统一运行时、统一配置和更强控制力的项目。

尤其是现在官方 Vite 插件已经支持把前端资源构建并部署到 Workers 运行时里，还支持 React Router v7、TanStack Start 等路线。对一些前后端本来就强耦合的产品，这种方案会越来越有竞争力。

![Cloudflare 注册页面截图](/posts-img/cloudflare-signup-shot.jpg)

---

## 2026 年看选型，一个现实判断标准

如果你问我现在怎么做最不容易后悔，我会给一个很务实的判断标准：

### 如果你现在最需要的是“快上线”

选 Pages。

### 如果你现在最需要的是“长期扩展能力”

选 Workers。

### 如果你既想快上线，又知道后面功能会变复杂

前端先上 Pages，动态能力逐步拆到 Workers，是一个非常稳的过渡路线。

这个判断背后的原因很简单：Cloudflare 现在的平台演进方向很明显，**Workers 是底层能力中心，Pages 是更友好的前端部署入口**。也就是说，Pages 很适合作为起点，但 Workers 更像长期演进的主战场。

---

## 上手建议：别一开始就把架构想太满

很多人研究 Pages 和 Workers 时，最容易犯的错误就是：项目还没开始，先想了一整套“未来五年的终极架构”。

其实没必要。

更推荐的方式是：

1. 如果是博客、官网、文档站，先用 Pages 起站。
2. 如果发现需要 API、表单、登录或数据库，再逐步引入 Functions 或 Workers。
3. 如果项目一开始就是产品型应用，比如 SaaS、小工具平台、服务接口，那就从 Workers 视角设计。

这种路线最大的好处，是不会为了“理论上更先进”的架构把自己先折腾死。技术选型是拿来交付的，不是拿来供神的。

---

## 总结

Cloudflare Pages 和 Workers 并不是谁替代谁的关系，而是两个层级不同、越来越互相靠拢的产品。

Pages 更适合把站点和前端项目快速发出去，特别适合博客、文档站、内容型网站和轻量全栈项目。Workers 更适合承载真正的业务逻辑、边缘计算、API 服务和平台能力，也是 Cloudflare Developer Platform 里更底层、更核心的运行时。

如果你只是想把网站先跑起来，Pages 会更舒服；如果你想围绕 Cloudflare 生态认真做应用，Workers 才是更值得长期理解的部分。最现实的做法通常不是二选一，而是按项目阶段组合使用：前期用 Pages 拉起交付速度，后期把更复杂的动态能力逐步沉到 Workers。

一句话收尾：**Pages 像前门，Workers 像发动机。你可以先从门进去，但最后多半还是要认识发动机长什么样。**

---

## 参考资料

- Cloudflare 官方产品页：Pages | 面向前端开发人员的全栈平台
- Cloudflare 官方产品页：Workers | Build and deploy serverless apps
- Cloudflare 官方文档：Cloudflare Pages Overview
- Cloudflare 官方文档：Cloudflare Workers Overview
- Cloudflare 官方文档：Workers Static Assets
- Cloudflare 官方文档：Cloudflare Workers Vite Plugin
- Cloudflare 官方参考架构：Fullstack applications
- Geeks Kai：《Cloudflare Pages 搭建博客 | 2026 最新版》
- Bruce AI 工程笔记：《Cloudflare Workers 完全指南：从入门到实战的边缘计算部署手册》
- 博客园 aopstudio：《零成本上线动态博客：用 Rin + Cloudflare 部署个人博客的完整指南》
