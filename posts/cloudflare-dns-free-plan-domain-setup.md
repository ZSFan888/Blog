---
id: cloudflare-dns-free-plan-domain-setup
title: 域名接入 Cloudflare DNS FREE 计划教程：从添加站点到切换 NS 全流程
excerpt: 这篇文章从准备工作、添加域名、选择 Cloudflare Free 套餐、检查 DNS 记录、切换 Nameserver、验证生效，到 DNSSEC 与常见坑整理，带你完整走一遍域名接入 Cloudflare DNS 免费计划的流程。
date: 2026-03-21
updatedAt: 2026-03-21
category: 教程
tags:
  - Cloudflare
  - DNS
  - 域名解析
  - 免费计划
  - 网站运维
coverImage: /posts-img/cloudflare-dns-setup-shot.jpg
author: 跑路的duck
---

# 域名接入 Cloudflare DNS FREE 计划教程：从添加站点到切换 NS 全流程

## 教程介绍

如果你手上已经有一个域名，不管是放在阿里云、腾讯云、Namecheap、NameSilo，还是其他注册商，迟早大概率都会碰到一个问题：要不要把 DNS 托管切到 Cloudflare。

原因也不复杂。Cloudflare 免费计划给的东西，实在太容易让人动心：免费 DNS 托管、基础 CDN、免费 SSL、一定程度的安全防护、方便的 DNS 管理界面，再加上一堆后续还能慢慢折腾的功能。对个人站长、小项目、自建服务和很多技术博客来说，它基本已经算是“能白嫖的第一站”。

![Cloudflare 官方 DNS Setup 文档截图](/posts-img/cloudflare-dns-setup-shot.jpg)

这篇文章我会按真正实操的顺序，把“域名接入 Cloudflare DNS FREE 计划”这件事从头讲清楚，主要包括：

- 接入前要准备什么
- 怎么把域名加到 Cloudflare
- 怎么选免费计划
- DNS 记录要检查哪些
- 怎么去域名注册商改 NS
- 怎么确认已经切换成功
- 接入后最容易踩哪些坑

文章内容主要参考了 Cloudflare 官方 DNS 文档，以及几篇社区里的实战教程。我会尽量写成你边看边做、少踩坑的那种版本，而不是一堆概念堆在一起看完还是不会动手。

---

## 先说结论：Cloudflare FREE 计划能做什么

Cloudflare 官方文档明确提到，Primary setup，也就是常说的 Full setup，是最常见的接入方式，而且 **Free 和 Pro 计划都走这条路线**。这意味着，只要你有一个已经注册好的域名，Cloudflare 免费计划就足够完成权威 DNS 托管这件事。

对大多数个人用户来说，Free 计划最值钱的点通常有这些：

- 把域名的权威 DNS 交给 Cloudflare 托管
- 用更顺手的 DNS 面板管理 A、AAAA、CNAME、MX、TXT 等记录
- 对 Web 站点开启橙云代理，顺带获得基础 CDN 和一定的防护能力
- 后续继续折腾 SSL/TLS、缓存、规则、WAF、重定向等功能

但也要先说一句实话：**把域名接入 Cloudflare，不等于网站一定变快，也不等于什么都不用管了。** 它只是给你换了一个更强的 DNS 和边缘网络入口，后面的记录配置、回源设置、SSL 模式这些，依然得你自己配对。

---

## 接入前准备：这几件事先确认好

在正式操作之前，Cloudflare 官方文档里要求你先确认三件事：

### 1. 你已经有一个域名

这个域名必须是已经注册好的真实域名，比如 `example.com` 这种根域名，而不是只拿一个 `www.example.com` 子域名来加。Cloudflare 的 Full setup 针对的是整个 zone，也就是根域名级别。

### 2. 你已经注册好 Cloudflare 账号

这个没什么难度，注册完、验证邮箱即可。后面所有操作都在 Cloudflare Dashboard 里完成。

### 3. 如果域名当前开着 DNSSEC，先在注册商那里关掉

这是 Cloudflare 官方文档专门提醒的一步，而且很容易被忽略。因为等会儿你要改权威 NS，如果 DNSSEC 没先处理好，轻则解析异常，重则直接把自己站点搞到访问不通。

官方建议是：先在当前域名注册商那边关闭 DNSSEC，等 Cloudflare 接入完成、域名状态变成 Active 之后，再回头重新启用。

![Cloudflare 注册页面截图](/posts-img/cloudflare-signup-shot.jpg)

另外，建议你在接入前顺手记住下面这些信息：

- 当前网站服务器 IP
- 当前 `@` 根域名记录怎么配的
- 当前 `www` 子域名怎么配的
- 邮件相关记录有没有在用，比如 MX、SPF、DKIM、DMARC
- 当前注册商后台在哪改 NS

别嫌麻烦。很多人后面翻车，不是 Cloudflare 有问题，而是切过去之后才发现自己根本不知道原来的 DNS 记录长什么样。

---

## 第一步：把域名添加到 Cloudflare

Cloudflare 官方文档和社区文章这一步几乎是一样的流程。

### 操作步骤

1. 登录 Cloudflare 控制台
2. 点击 **Add a site** 或者 **添加网站**
3. 输入你的根域名，比如 `example.com`
4. 继续下一步

这时候 Cloudflare 会开始创建 zone。官方文档里甚至还给了 API 创建 zone 的方式，不过大多数人直接用后台就够了。

需要注意一点，Cloudflare 对域名层级有要求。普通用户能加的是一个有效顶级域名下面的 apex domain，也就是标准根域名。不是随便什么低层子域名都能单独当成完整 zone 来加。

![Cloudflare 控制台页面截图](/posts-img/cloudflare-dashboard-shot.jpg)

如果你输进去之后 Cloudflare 识别不了，先别急着骂。先检查：

- 域名是不是已经注册成功
- 是不是输成了带 `https://` 的地址
- 是不是输成了二级域名甚至更深层级

---

## 第二步：选择 Free 套餐

这一页没什么悬念，**直接选 Free** 就行。

社区教程里基本也都这么做。因为你的目标是把域名 DNS 接进 Cloudflare 免费计划，而不是一上来买 Pro 或 Business。对个人博客、普通网站、演示项目、轻量服务来说，Free 足够起步了。

这个步骤的重点不是“套餐怎么选”，而是别点快了直接跳过后面的 DNS 检查页。因为真正容易出问题的地方，不是选免费计划，而是下一步的记录审查。

---

## 第三步：检查 Cloudflare 自动扫描到的 DNS 记录

Cloudflare 在你把域名加进去之后，会自动扫描你现有的 DNS 记录。官方文档里也明确说了：它可以帮你 quick scan，但 **这个扫描结果不保证完整**，所以你必须自己检查。

这一步是整篇教程里最重要的地方之一。

### 重点检查哪些记录

#### 1. 根域名记录，也就是 `@`

通常这是你网站主入口，最常见的是 A、AAAA 或 CNAME。你要确认记录值是不是你当前服务器或者托管服务要求的地址。

#### 2. `www` 子域名

哪怕你平时只用裸域，也建议把 `www` 配上。很多用户会手动打 `www.`，你不配，访问体验就会很怪。

#### 3. 邮件记录

如果你域名有邮箱，一定要重点检查：

- MX
- SPF（TXT）
- DKIM（TXT）
- DMARC（TXT）

官方文档专门提到，如果这些记录没配对，邮件功能很容易出问题。很多人网站能开，邮箱却突然收不到，就是因为这一步偷懒了。

#### 4. 代理状态

和网站相关的 A / CNAME 记录，一般可以考虑开橙云代理；
邮件相关记录一定要保持 **DNS Only**，不要开代理。

Cloudflare 官方邮件记录示例里也写得很清楚，像 MX、mail 主机、SPF、DKIM、DMARC 这些记录，通常都应该保持 DNS Only。

![Cloudflare 教程博客截图](/posts-img/cloudflare-settings-blog-shot.jpg)

社区文章里还有一个特别接地气的提醒：如果你原来压根就没网站，只是先把域名买着备用，那在这个阶段你可以手动补两条最基础的记录：

- `@` 指向服务器 IP
- `www` 指向 `@` 或者同样指向服务器 IP

这样后面域名切过去之后，至少不会一打开就是 NXDOMAIN。

---

## 第四步：去域名注册商后台更换 Nameserver

这一步是最关键的，也是整个接入流程的真正分界线。

Cloudflare 会分配给你两条专属的权威 Nameserver。你需要把当前注册商那边原有的 NS 删掉，换成 Cloudflare 给你的这两条。

官方文档原话说得很直接：**如果 NS 名称没有完全照抄，DNS 就不会正确解析。**

### 操作步骤

1. 在 Cloudflare 后台复制它给你的两条 NS
2. 登录你的域名注册商后台
3. 找到域名管理或 Nameserver 设置位置
4. 删除原有 NS
5. 填入 Cloudflare 提供的两条 NS
6. 保存提交

这个动作做完之后，从原理上说，你就是把“谁来管理这个域名的权威 DNS”切给了 Cloudflare。

腾讯云开发者社区那篇文章里，也是同样的路线：添加域名、选免费套餐、复制 Cloudflare NS、去注册商后台替换原有 NS、回到 Cloudflare 检查是否激活。

### 关于等待时间

官方文档写的是：**最多等 24 小时**。

但社区文章普遍反馈实际通常快很多，有的人 5 分钟，有的人 20 分钟，有的人 1 到 4 小时。这个没有绝对值，取决于注册商刷新速度和各地缓存情况。

我的建议是：

- 改完 NS 后先别来回折腾
- 等一会儿再查
- 期间不要一会儿改回去、一会儿又切回来

这种来回横跳，最容易把自己搞进排障地狱。

---

## 第五步：怎么确认域名已经成功接入 Cloudflare

Cloudflare 官方文档给了几种非常实用的验证方式。

### 1. 看 Cloudflare 后台状态

当域名状态变成 **Active**，基本就说明 NS 切换已经成功了。

### 2. 看邮件通知

Cloudflare 会发邮件告诉你域名已经激活。

### 3. 用在线工具查 NS

最常用的就是：

- `https://www.whatsmydns.net/`

它能帮你从全球多个节点查看域名 NS 是否已经传播成 Cloudflare 的结果。

![WhatsMyDNS 查询页面截图](/posts-img/whatsmydns-shot.jpg)

### 4. 用命令行查

官方文档给了下面这些命令：

macOS / Linux：

```bash
whois yourdomain.com
dig ns yourdomain.com @1.1.1.1
dig ns yourdomain.com @8.8.8.8
dig yourdomain.com +trace
```

Windows：

```bash
nslookup -type=ns yourdomain.com 1.1.1.1
nslookup -type=ns yourdomain.com 8.8.8.8
```

如果查出来的 NS 已经是 Cloudflare 分配给你的那两条，说明接入基本就通了。

---

## 第六步：接入成功后，记得重新启用 DNSSEC

这一点非常容易被忘。

Cloudflare 官方文档最后专门提醒：改 NS 前如果你关掉了 DNSSEC，那么接入成功以后应该重新打开 DNSSEC，避免域名被伪造。

很多人做到 Active 就收工了，结果把这一步漏掉。短期看没事，但从完整性和安全性角度说，这一步最好补上。

---

## Cloudflare Free 计划下，接入后常见的基础设置

虽然这篇重点是讲“域名接入 Cloudflare DNS 免费计划”，但既然都切过来了，有几个基础设置还是值得顺手看一下。

### 1. 检查橙云和灰云

- 网站主站相关记录：按需考虑橙云
- 邮件相关记录：通常保持灰云，也就是 DNS Only

### 2. 看一下 SSL/TLS 模式

很多技术博客和社区文章都会提到：如果你的源站已经有证书，优先考虑 **Full (strict)**。如果源站没证书，别硬切，不然站点可能直接打不开。

### 3. 开启 HTTPS 相关选项

比如：

- Always Use HTTPS
- Automatic HTTPS Rewrites

这些都算是低风险、收益比较稳定的选项。

### 4. 确认缓存和加速别乱开

Cloudflare 免费计划里很多优化功能能带来收益，但也不是开越多越好。尤其是动态站点、后台系统、接口域名，别见到开关就全点亮，不然缓存错内容的时候你会想掀桌子。

---

## 最容易踩的坑，我给你提前列一下

### 1. 没检查 DNS 记录就直接切 NS

这是最常见的大坑。Cloudflare 扫描到的记录不一定完整，你如果不核对，最轻是网站打不开，重一点是邮件也跟着一起寄。

### 2. 忘了处理 DNSSEC

Cloudflare 官方文档反复提醒这个问题，不是没道理。切权威 NS 之前不处理 DNSSEC，非常容易出解析异常。

### 3. 把邮件记录也开了橙云

邮件记录要保持 DNS Only。这个规则别碰，碰了大概率出事。

### 4. 以为切过去后立刻全球生效

官方说最长 24 小时，不同节点传播时间不同。你本地能打开，不代表全世界都已经刷新；反过来，你本地没刷新，也不代表它没生效。

### 5. 以为开了 Cloudflare 就一定更快

这个真不绝对。国内访问国外源站、回源慢、缓存策略不对、SSL 模式乱配，照样可能慢得离谱。Cloudflare 不是魔法，它只是一个很强的工具。

---

## 一套适合新手的最小可用流程

如果你就是想把一个已有域名稳稳接进 Cloudflare Free 计划，我建议照这个顺序做：

### 第一步：准备好域名、Cloudflare 账号和当前 DNS 信息

别一边查一边改，容易乱。

### 第二步：添加站点并选择 Free 套餐

这一步没什么难度，关键是别跳过后面的 DNS 审查。

### 第三步：认真检查根域名、`www` 和邮箱记录

网站能不能开、邮箱会不会炸，基本就看你这一步认真不认真。

### 第四步：去注册商后台改 NS

照抄 Cloudflare 给你的两条 NS，不要手打错。

### 第五步：用后台状态、邮件、WhatsMyDNS 和命令行交叉验证

别只信一种方法，多看两眼更稳。

### 第六步：接入成功后再做 SSL、缓存和规则优化

别一开始就把所有功能全拧开，先保证域名和站点正常，再说优化。

---

## 我的建议：Cloudflare FREE 计划很值，但别把它当万能药

如果只从“域名 DNS 托管”这件事看，Cloudflare Free 计划确实非常值得用。尤其是个人站点、小项目、技术博客、自建服务，切过去之后，DNS 管理体验通常会比很多传统注册商后台舒服得多。

但还是那句老话：好工具不等于无脑开。真正决定你网站是否稳定、是否能正常访问、是否邮件不出问题的，依然是你对 DNS 记录、NS 切换、SSL 模式和后续基础设置有没有搞明白。

最推荐的方式其实很简单：

先把 DNS 托管稳稳接进去，再做验证，再看要不要继续开代理、开 HTTPS、开缓存、开规则。一步一步来，比上来全家桶梭哈靠谱得多。

---

## 参考资料

1. [Cloudflare 官方文档：Set up a primary zone (Full setup)](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
2. [Cloudflare 官方文档：验证 NS 变更与重新启用 DNSSEC](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/#verify-changes)
3. [域名接入 Cloudflare - 腾讯云开发者社区](https://cloud.tencent.com/developer/article/2518586)
4. [Cloudflare 教程：域名解析及免费 CDN 最佳设置（2025）](https://www.1deng.me/cloudflare-settings.html)
5. [将域名接入 Cloudflare 完整教程 - Yaoxi Blog](https://blog.yaoxi.wiki/posts/cloudflare-domain-setup/)
