# 浏览器人工用例验证报告 — v1.0 P0（生产站点）

- 日期：2026-07-15
- 站点：https://unimap-condor.vercel.app（Vercel 生产部署）
- 执行方式：Claude in Chrome 浏览器自动化（真实 Chrome，桌面视口 1568×773）
- 范围：regression-2026-07-15-p0.md 第八节「需人工浏览器/线上验证清单」+ TC-P0-core.md 手动用例
- 前置：验证前执行 `localStorage.clear()` 并刷新，模拟纯新用户

---

## 一、结果总览

| 判定 | 数量 |
|---|---|
| ✅ 通过 | 20 |
| ❌ 失败 | 0 |
| ⛔ 未测 | 4 |

控制台无应用级报错（详见第四节）。**结论：不阻塞发布。**

---

## 二、逐条验证结果

### A. 新用户流程（LEO-185）

**A1. TC-185-01 新用户首访见 Welcome 引导 — ✅ 通过**
- 步骤：`localStorage.clear()` → 刷新。
- 实际：弹出 WelcomeOverlay，标题 "Turn a messy pile of schools into an executable shortlist in ~30 minutes."，含徽标 "North America CS master's shortlist workbench"、3 步引导（Set preferences / Explore & save / Compare & export shortlist）、双按钮（Start with North America CS template / Skip for now）与右上角关闭按钮。

**A2. TC-185-04 「Start with North America CS template」预填 — ✅ 通过**
- 步骤：点击模板按钮。
- 实际：Preference profile 表单打开并预填：Degree level=Master、Target countries="Canada, United States"、Subject areas="Computer Science, Software Engineering, AI, Machine Learning…"、Research keywords="machine learning, NLP, systems, HCI"、Employment=High、Research=Medium、Immigration=High、Flexibility 三项勾选、Notes 含模板说明。与验收要求 5 字段一致。

**A3. 保存 profile 后 toast 反馈 — ✅ 通过**
- 步骤：点击 Save profile。
- 实际：顶部出现绿色提示 "Fit analysis unlocked for 1504 schools."；localStorage 写入 `unimap.preferenceProfile` 与 `unimap.welcomeDismissed="true"`。

**A4. TC-185-03 dismiss 持久化，刷新不再弹 — ✅ 通过**
- 步骤：保存后刷新页面。
- 实际：引导未再出现，直接进入主界面。
- 备注（观察项，非缺陷）：点击模板按钮打开表单的瞬间 `welcomeDismissed` 仍为 null，在 Save profile（或 Skip）后才写入 "true"。若用户点模板后未保存直接强刷，引导会再次出现。与回归报告中「套用后关闭并标记 dismissed」的描述略有出入，但实际体验合理，不判失败。

**A5. TC-185-05 Guide 按钮可重开 — ✅ 通过**
- 步骤：点击左侧导航 Guide。
- 实际：WelcomeOverlay 重新打开，可再次套用模板或跳过；Skip for now 后 `welcomeDismissed` 保持 "true"。

**A6. TC-185-02 老用户（有 profile）刷新不被打扰 — ✅ 通过**
- 步骤：已有 preferenceProfile + welcomeDismissed 状态下多次刷新。
- 实际：均不弹引导。

**A7. TC-185-06 已填偏好后套用模板（边界）— ✅ 通过**
- 步骤：已保存档案状态下 Guide → Start with template。
- 实际：表单以模板值整体打开（符合"整体套用"设计语义），无崩溃、无脏数据，可继续编辑；点关闭放弃不影响已保存档案。

### B. 核心闭环（搜索 → 决策 → 保存 → 改状态 → 导出）

**B1. 搜索并打开加拿大样板校 — ✅ 通过**
- 步骤：Filter 面板搜索 "McGill" → 点击结果卡。
- 实际：结果显示 "McGill University / Montreal, Canada / Rank 30"；详情面板打开，含 Overview/Decision/Rankings/Research/Faculty/Recommend/Community 七个 tab，Overview 显示 City/Country/Established/Verified in ROR。

**B2. Decision tab 决策卡含 fit / concerns / next action — ✅ 通过**
- 实际：Preference interpretation 标记 "Profile-aware"；"Why it may fit" 5 条（Country matches: Canada / Subject match: CS master / Verified Master option / Funding facts available / Strong ranking signal #30）；Concerns 区显示 "No concern from connected facts."；Next action 区显示 "Fill the highest-impact missing fact before changing status."；另有 Verified facts=6、Open gaps=5、Programs、Funding & tuition、Missing info 列表。

**B3. 保存学校并改状态到 shortlist — ✅ 通过**
- 步骤：点星标收藏 → 展开 Application workflow → 填 Why keep → Status 改为 Shortlist。
- 实际：星标点亮；Saved 面板分组从 "Interested 1" 实时变为 "Shortlist 1"；工作流徽标从 "Worth watching/Interested" 变为 "High intent/Shortlist"。状态选项齐全（Interested/Longlist/Shortlist/Applying/Rejected by me）。

**B4. TC-186-01 无保存学校时导出按钮禁用 — ✅ 通过**
- 步骤：收藏前检查 Saved 面板 "Shareable shortlist" 卡。
- 实际：按钮 `disabled=true`（JS 断言确认），呈灰色不可点，下方提示 "Save at least one school to export a shortlist."。

**B5. TC-186-02/05 「Export shortlist (HTML)」可点且有计数提示 — ✅ 通过**
- 步骤：收藏 McGill 后点击导出。
- 实际：按钮变为可用（深色）；点击后触发下载，界面提示 "Exported an HTML shortlist for 1 schools."，控制台无报错。（按本轮要求仅验证按钮状态与点击无报错；下载文件内容未逐项打开核对。）

### C. 排名合规（LEO-187）

**C1. TC-187-01 排名来源标注处处可见 — ✅ 通过**
- 实际：Filter 侧栏底部与学校详情 Rankings tab 均显示 "Source: QS World Univ. Rankings (QS Ltd.)" 与免责声明 "Rankings © respective publishers, shown for reference only."。Source 下拉含 QS / Shanghai Rankings / THE / CSRankings.org 四个来源。

**C2. TC-187-02 官方外链正确 — ✅ 通过**
- 实际：详情 Rankings tab 的 "QS World University Rankings" 外链 href 为 `https://www.topuniversities.com/world-university-rankings`（JS 读取确认），为官方完整榜单页。

**C3. TC-187-03 榜单限展 top25 + 已存学校 — ✅ 通过**
- 步骤：展开 Filter 面板 "Top school rankings"。
- 实际：列表为 QS 2027 前 25 名（MIT #1 起，至 TUM #25），额外附已保存的 McGill(#30) 与当前选中的 McMaster(=174)；底部文案 "Showing the top 25 plus your saved schools of 1504. View the complete ranking on the official…" 指向官方外链。

### D. 懒加载（LEO-182）

**D1. TC-182-03 Faculty tab 懒加载 + 渲染 + 分页 — ✅ 通过**
- 步骤：打开 McMaster 详情 → Faculty tab，同时监听网络。
- 实际：网络面板捕获独立 chunk `GET /assets/localFacultyDirectory-Cbn-RMIN.js → 200`（按需加载，非首屏）；渲染 "Department of Computing and Software（51 people listed）" 与 "Department of Electrical and Computer Engineering（47 people listed）"，展开后逐条列出教授（Dr. Alan Wassyng 等），带学科标签与 "Load more (30/51)" 分页，数据完整。
- 备注：McGill、Waterloo 无本地 faculty 数据，正确显示空态 "No faculty structure has been linked to this university yet."（数据覆盖范围问题，非缺陷；本地 faculty 数据现覆盖 UdeM/UC Davis/McMaster/UCLA/USC）。

**D2. TC-182-05 慢网下懒加载有加载态 — ⛔ 未测**
- 原因：当前浏览器自动化工具无 DevTools 网络限速能力。正常网速下切换无白屏、无报错。

### E. 降级提示（LEO-183）

**E1. TC-183-03 "Local data" 标识 — ✅ 通过**
- 实际：本站未配 Supabase，地图右上角常驻 "Local data" 徽标（Layers 图标 + 琥珀色底），全部功能（搜索/决策/收藏/导出/榜单）不受影响。

**E2. TC-183-04 恢复联网切回 remote — ⛔ 未测**
- 原因：本部署无 Supabase 配置，属常态 local，无法在生产上安全模拟"恢复 remote"切换。代码级已在回归报告确认。

**E3. TC-183-01/02/05 ErrorBoundary 兜底 / Reload / 错误详情 — ⛔ 未测（不可测）**
- 原因：生产站点无法安全注入渲染异常。代码级已在回归报告确认（main.tsx 已包裹）。

### F. 生产代理（LEO-181）

**F1. TC-181-01 /api 代理 — ✅ 通过**
- 实际：`GET /api/sources/availabilities → 200`，返回 JSON（QS 等来源可用性，约 5KB），无 CORS 报错；响应已被应用写入 localStorage 缓存（`unimap.api/sources/availabilities`）。
- 备注：对不存在的路径（如 `/api/universities?limit=1`）上游返回 403，属上游行为，非代理缺陷。

**F2. TC-181-02 OpenAlex 代理 + Research tab 渲染 — ✅ 通过（附上游数据备注）**
- 实际：`GET /openalex/institutions?search=McGill → 200`，正确返回 "McGill University" 实体；详情 Research tab 正常渲染 Works/Citations/h-index/2yr mean citedness 指标卡与 topic 空态提示，无报错。
- 备注：当前 OpenAlex 对该机构返回 works_count=0 / cited_by_count=0 / topics 空。已用浏览器直连 `https://api.openalex.org` 对比验证：**源站返回同样为 0**，故为上游数据源当前状态，代理与前端渲染均正常，非本站缺陷。建议后续关注上游恢复情况或在前端对全 0 数据给出更友好提示（优化建议，非阻断）。

**F3. TC-181-03 ROR 代理 — ✅ 通过**
- 实际：`GET /ror/organizations?query=mcgill → 200`，首条结果 "McGill University"。

### G. 其它

**G1. TC-184-04 密钥扫描拦截 — ⛔ 未测**
- 原因：属本地 CI grep 验证，不在浏览器验证范围内，且要求不修改代码（注入假密钥违反约束）。grep 规则已在回归报告代码级确认。

---

## 三、通过项一览表

| # | 用例 | 判定 |
|---|---|---|
| 1 | TC-185-01 新用户见引导 | ✅ |
| 2 | TC-185-02 老用户不被打扰 | ✅ |
| 3 | TC-185-03 dismiss 持久化 | ✅（附观察备注） |
| 4 | TC-185-04 模板预填 5 字段 | ✅ |
| 5 | TC-185-05 Guide 重开 | ✅ |
| 6 | TC-185-06 已填偏好套模板（边界） | ✅ |
| 7 | 保存 profile toast 反馈 | ✅ |
| 8 | 搜索/打开 McGill 详情 | ✅ |
| 9 | Decision 决策卡 fit/concerns/next action | ✅ |
| 10 | 收藏 + 状态改 shortlist | ✅ |
| 11 | TC-186-01 空 shortlist 按钮禁用 | ✅ |
| 12 | TC-186-02/05 导出可点 + 计数提示 | ✅ |
| 13 | TC-187-01 来源标注 | ✅ |
| 14 | TC-187-02 官方外链 | ✅ |
| 15 | TC-187-03 top25+已存学校 | ✅ |
| 16 | TC-182-03 Faculty 懒加载 chunk + 渲染分页 | ✅ |
| 17 | TC-183-03 Local data 标识 | ✅ |
| 18 | TC-181-01 /api 代理 | ✅ |
| 19 | TC-181-02 OpenAlex 代理 + Research 渲染 | ✅（上游数据全 0，见备注） |
| 20 | TC-181-03 ROR 代理 | ✅ |

未测 4 项：TC-182-05（慢网加载态）、TC-183-01/02/05（ErrorBoundary，不可安全触发）、TC-183-04（remote 切回，本站无 Supabase）、TC-184-04（密钥扫描，非浏览器项）。

---

## 四、控制台错误摘要

多次全流程操作 + 整页刷新后 `read_console_messages(onlyErrors)`：

- **应用自身：0 个 error / exception。**
- 仅捕获 2 条来自用户浏览器扩展（Zotero，chrome-extension://…/zotero.js、inject.js）的 "Could not establish connection" 报错，与本站无关。

---

## 五、结论

- **20 通过 / 0 失败 / 4 未测，不阻塞发布。**
- 未测项均为环境限制（ErrorBoundary 不可安全触发、无网络限速、无 Supabase remote 态、密钥扫描属 CI 项），且已有代码级走查兜底。
- 两条非阻断备注供后续跟进：
  1. 点模板按钮瞬间未即时写 `welcomeDismissed`（保存/跳过后才写入），与回归报告描述略有出入，建议对齐文档或在打开表单时即标记。
  2. OpenAlex 上游当前对机构返回全 0 指标（源站直连同样为 0），前端可考虑对全 0 数据增加友好提示。
