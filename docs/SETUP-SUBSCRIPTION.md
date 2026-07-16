# 账号云同步 + Lemon Squeezy 订阅配置指南（LEO-196）

本文档说明如何从零把 UniMap Condor 从「纯本地模式」升级为「账号 + 工作区云同步 + Pro 订阅」。

> 重要：所有外部依赖都走环境变量。**不配置任何变量时，应用保持现有纯本地行为**（数据存 localStorage，账号入口显示「Cloud sync not configured」，Pro 卡片显示「Coming soon」）。可以先跑起来，再逐步接入。

---

## 总览：数据流

1. 用户用邮箱 magic link 登录（Supabase Auth，无密码）。
2. 登录后，工作区（收藏 / 学校决策 / 偏好画像）在本地缓存基础上同步到 Supabase 三张表；首次登录会把本地数据与云端做**并集合并**（冲突以本地新改动为准）。
3. 用户点击订阅 → 跳转 Lemon Squeezy 结账页（带上邮箱和 Supabase user_id）。
4. Lemon Squeezy 通过 webhook 回调 Supabase Edge Function → 用 service_role 写入 `subscriptions` 表。
5. 前端登录后查询 `subscriptions`，`status ∈ {active, on_trial}` 且未过期 → 解锁 Pro 权益。

---

## 步骤 1：创建 Supabase 项目

1. 在 https://supabase.com 新建项目，记录 **Project URL** 和 **anon public key**（Project Settings → API）。
2. 同页记录 **service_role key**（仅用于服务端 / Edge Function，切勿放进前端）。

## 步骤 2：跑数据库 migrations

本仓库的 `supabase/migrations/` 已包含本任务新增的：

- `202607160002_user_workspace_and_subscriptions.sql`
  - `user_favorites` / `user_school_decisions` / `user_preference_profiles`：每用户一行/一项，`payload jsonb` 镜像客户端结构，便于并集合并。
  - `subscriptions`：`user_id` 主键，`ls_subscription_id` 唯一，`status` / `plan` / `current_period_end` / `raw`。
  - 全部启用 RLS。工作区三表策略 `auth.uid() = user_id`（增删改查）；`subscriptions` 仅本人可读，写入只允许 service_role。

推送：

```bash
# 首次需要关联项目
supabase link --project-ref <your-project-ref>

# 推送所有 migration
supabase db push
```

## 步骤 3：部署 Edge Function（Lemon Squeezy webhook）

函数位于 `supabase/functions/lemonsqueezy-webhook/index.ts`（Deno 运行时）。它会：
1. 校验 `X-Signature`（HMAC-SHA256，密钥 `LEMONSQUEEZY_WEBHOOK_SECRET`，常量时间比较）；
2. 处理 `subscription_created / updated / cancelled / expired / resumed`；
3. 从 `meta.custom_data.user_id` 关联用户；
4. 用 service_role upsert `subscriptions`。

部署与密钥：

```bash
# --no-verify-jwt 必须：Lemon Squeezy 不带 Supabase JWT，鉴权靠我们自己的 HMAC 校验
supabase functions deploy lemonsqueezy-webhook --no-verify-jwt

# 设置密钥（SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 在托管运行时会自动注入，
# 仅本地运行时才需手动 set）
supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=<从 LS 复制的签名密钥>
```

部署成功后拿到函数 URL：
`https://<project-ref>.functions.supabase.co/lemonsqueezy-webhook`

## 步骤 4：在 Lemon Squeezy 建 Store / Product

1. 创建 Store，新建一个 **Subscription** 产品，价格设为 **$6.99/mo**（与 `src/entitlements.ts` 中 `PRO_PRICE_LABEL` 保持一致）。
2. 记录该 variant 的 **Checkout URL**（形如 `https://<store>.lemonsqueezy.com/buy/<uuid>`）。
3. （可选）开启 Customer Portal，记录 portal URL 用于「Manage subscription」。

## 步骤 5：配置 Webhook

1. Lemon Squeezy → Settings → Webhooks → 新建。
2. Callback URL 填步骤 3 的 Edge Function URL。
3. Signing secret 自定义一串强随机值，**与步骤 3 的 `LEMONSQUEEZY_WEBHOOK_SECRET` 完全一致**。
4. 勾选订阅相关事件：`subscription_created` / `subscription_updated` / `subscription_cancelled` / `subscription_expired` / `subscription_resumed`。

## 步骤 6：配置环境变量

变量清单（完整注释见 `.env.example`）：

| 变量 | 位置 | 说明 |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | 前端 | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | 前端 | Supabase anon public key |
| `VITE_LEMONSQUEEZY_CHECKOUT_URL` | 前端 | Pro 结账 URL（缺失则订阅按钮保持 Coming soon） |
| `VITE_LEMONSQUEEZY_PORTAL_URL` | 前端（可选） | 客户门户，显示「Manage subscription」 |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Edge Function secret | webhook 签名密钥（**不加 VITE_ 前缀，不进前端**） |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function（托管自动注入） | 仅本地运行需手动设置 |

**两处都要配前端变量：**

1. 本地开发：项目根目录 `.env.local`
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_LEMONSQUEEZY_CHECKOUT_URL=https://xxx.lemonsqueezy.com/buy/xxxx
   VITE_LEMONSQUEEZY_PORTAL_URL=https://xxx.lemonsqueezy.com/billing
   ```
2. Vercel：Project → Settings → Environment Variables 添加同样的 4 个 `VITE_*` 变量（Production / Preview 按需勾选），重新部署生效。

> `LEMONSQUEEZY_WEBHOOK_SECRET` 只放在 Supabase secrets，**不要**放进 Vercel 或 `.env.local`（那会打进前端 bundle）。

## 步骤 7：Supabase Auth 配置

- Authentication → URL Configuration：把本地 `http://localhost:5173` 和 Vercel 域名加入 **Redirect URLs**（magic link 回跳需要）。
- Email 模板可用默认 Magic Link 模板。

---

## 验收 Checklist

- [ ] 不配置任何 env：应用正常启动；账号入口显示「Cloud sync not configured」；Pro 卡片显示「Coming soon」；收藏/决策/偏好照常存 localStorage。
- [ ] 配好 Supabase：点「Sign in」输入邮箱能收到 magic link，点击回跳后显示「Signed in as …」。
- [ ] 登录后新增/删除收藏、编辑决策、保存偏好 → 刷新页面数据仍在；换一台设备登录同账号能看到同样数据。
- [ ] 首次登录合并：本地先建几条收藏再登录（此前云端已有其它数据）→ 登录后两边并集，冲突项以本地新改动为准。
- [ ] 登出后回到本地模式，Pro 随之按 localStorage 后门（dev）判定。
- [ ] 配好 Lemon Squeezy：Pro 卡片订阅按钮可点 → 跳转结账页，URL 带 `checkout[email]` 与 `checkout[custom][user_id]`。
- [ ] 完成一笔测试订阅 → webhook 写入 `subscriptions` → 前端刷新后解锁 Pro（无限收藏、Compare 到 6、导出去水印）。
- [ ] 取消订阅：在 `current_period_end` 之前仍是 Pro，过期后回落 Free。
- [ ] `npm run lint` / `npm test` / `npm run build` 全绿。

---

## 本地调试 webhook（可选）

```bash
supabase functions serve lemonsqueezy-webhook --no-verify-jwt --env-file ./supabase/.env.local
# 用 Lemon Squeezy 的 "Send test" 或 curl 附上正确的 X-Signature 验证
```
