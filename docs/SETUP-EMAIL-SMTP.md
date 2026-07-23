# 自建 SMTP 配置指南（LEO-239）

Supabase 内置的邮件服务**仅供测试**，限流严重（免费额度每小时只允许发几封验证邮件）。
真实用户量下，登录 magic link 会大面积收不到——等于登录不了。发布前必须换成生产级 SMTP。

本文以 **Resend** 为例（与 Supabase 官方集成、免费额度对小产品够用、配置最简单）。
也可换 SendGrid / Postmark / Amazon SES，SMTP 字段填法类似。

> 前置说明：以下步骤需要在 Resend 和 Supabase 后台操作，只有账号 owner 能做。
> Claude 无法替你注册账号或登录你的 dashboard，但配完后可以帮你重跑端到端验证。

---

## 步骤 1：注册 Resend 并拿 API Key

1. 打开 https://resend.com 注册（可用 GitHub/Google 登录）。
2. 登录后进 **API Keys → Create API Key**，权限选 `Sending access`，复制这串 key（只显示一次，形如 `re_xxx`）。

## 步骤 2：验证发信域名（关键，别跳过）

不验证域名的话只能用 Resend 的测试地址、且很容易进垃圾箱。

1. Resend → **Domains → Add Domain**，填你拥有的域名（如 `unimapcondor.com`；没有域名可先买一个，或临时用 Resend 提供的 onboarding 测试域名先跑通）。
2. Resend 会给出几条 DNS 记录（SPF 的 TXT、DKIM 的 CNAME/TXT，可能还有 MX）。
3. 到你的域名 DNS 服务商（Cloudflare / 阿里云 / GoDaddy 等）后台，把这些记录**原样添加**。
4. 回 Resend 点 **Verify**，全部变绿即完成（DNS 生效可能要几分钟到几小时）。

## 步骤 3：在 Supabase 填 SMTP

1. Supabase 项目 → **Project Settings → Auth →** 找到 **SMTP Settings**。
2. 打开 **Enable Custom SMTP**，按下表填：

   | 字段 | 值 |
   | --- | --- |
   | Host | `smtp.resend.com` |
   | Port | `465` |
   | Username | `resend` |
   | Password | 步骤 1 的 Resend API Key（`re_xxx`） |
   | Sender email | 用已验证域名的地址，如 `no-reply@你的域名` |
   | Sender name | `UniMap Condor` |

3. 点 **Save**。

> 提示：Supabase 还有一个「Rate limits」设置（Auth → Rate Limits）。换了自建 SMTP 后，可把 email 发送速率上调到你的套餐允许的水平（Resend 免费档大致每天 100 封 / 每月 3,000 封，按官网当前为准）。

## 步骤 4：（可选）自定邮件模板

Supabase → Authentication → **Email Templates**，把 "Magic Link" / "Confirm signup" 模板的措辞改成你的品牌语气。
保留模板里的 `{{ .ConfirmationURL }}` 变量不要删。

## 步骤 5：冒烟测试

1. 到生产站 https://unimap-condor.vercel.app 点 Sign in，输入邮箱发一封 magic link。
2. 确认：邮件**及时到达**、发件人是你的域名、**点链接能跳回生产站并登录成功**（不再跳 localhost）。
3. 连续发 2–3 封确认不再被限流。

---

## 完成后

告诉 Claude，即可重跑订阅端到端验收：
**登录 → 工作区云同步（换设备可续）→ 订阅（测试卡 4242 4242 4242 4242）→ Pro 解锁 → 取消降级。**

## 相关配置回顾（已完成）

- Auth **URL Configuration** 已修正：Site URL = `https://unimap-condor.vercel.app`；
  Redirect URLs 含 `https://unimap-condor.vercel.app/**` 和 `http://localhost:5173/**`。
  （此前默认 localhost:3000 导致 magic link 跳死页，已于 2026-07-16 修复。）
- 订阅前强制登录漏洞（LEO-238）已修复并部署。
