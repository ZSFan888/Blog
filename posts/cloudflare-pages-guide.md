---
id: cloudflare-pages-guide
title: Cloudflare Pages 部署静态博客完整指南
excerpt: 从零开始，手把手教你用 Cloudflare Pages 部署静态博客，包括域名绑定、环境变量配置和自动部署设置。
date: 2026-06-14
category: 教程
tags:
  - Cloudflare
  - 部署
  - 教程
coverImage: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop
---

# Cloudflare Pages 部署静态博客完整指南

Cloudflare Pages 是目前最适合部署静态博客的平台之一，免费、快速、稳定。

## 为什么选择 CF Pages

![Cloudflare 全球网络](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop)

Cloudflare 拥有全球 300+ 个数据中心，静态资源会被自动缓存到离用户最近的节点。

主要优势：

- ✅ 免费套餐：每月 500 次构建，带宽无上限
- ✅ 自动 HTTPS：绑定域名后自动签发 SSL 证书
- ✅ Git 集成：支持 GitHub / GitLab，推送即部署
- ✅ 预览部署：每个 PR 自动生成预览链接

## 部署步骤

### 第一步：准备仓库

确保你的项目满足：

```bash
# 本地能正常构建
npm run build

# 输出目录正确（通常是 dist 或 out）
ls dist/
```

### 第二步：连接 GitHub

在 CF Pages 控制台：

1. **Workers & Pages** → **Create** → **Pages**
2. **Connect to Git** → 授权 GitHub
3. 选择仓库 → **Begin setup**

### 第三步：构建配置

| 字段 | 值 |
|---|---|
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node 版本 | `20` |

### 第四步：环境变量

```
NODE_VERSION = 20
VITE_SITE_URL = https://your-domain.com
```

### 第五步：绑定自定义域名

![域名绑定界面](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop)

部署成功后：

1. 进入项目 → **Custom domains**
2. 点 **Set up a custom domain**
3. 输入你的域名
4. 按提示在 DNS 添加 CNAME 记录

Cloudflare 会自动签发证书，通常 5 分钟内生效。

## SPA 路由问题

如果是 React/Vue 等 SPA，刷新页面会 404。解决方法是在 `public/` 目录添加 `_redirects` 文件：

```
/*    /index.html   200
```

这告诉 CF Pages 所有路径都回退到 `index.html`，由前端路由接管。

## 总结

CF Pages 的整个部署流程非常顺畅，从连接仓库到上线不超过 5 分钟。配合 GitHub Actions 可以实现更复杂的构建流程，是目前静态博客部署的最优选择之一。
