# TC-P0-core — 本轮 7 个 P0 功能验收用例

> 对应 commit LEO-181~187。字段：ID / 前置条件 / 步骤 / 期望结果 / 优先级 / 类型 / 关联 issue。
> 优先级：P0（阻断发布）> P1（重要）> P2（次要）。类型：自动化 / 手动。

---

## LEO-181 Vercel API 反向代理（vercel.json rewrites）

### TC-181-01 生产环境 /api 代理转发
- 前置条件：已部署到 Vercel，`vercel.json` 生效。
- 步骤：访问线上站点，打开学校地图，观察网络面板对 `/api/...` 的请求。
- 期望结果：`/api/:path*` 被重写到 `https://disc-unimap.uibk.ac.at/api/:path*`，返回 200，无 CORS 报错。
- 优先级：P0
- 类型：手动
- 关联：LEO-181

### TC-181-02 OpenAlex 代理路径
- 前置条件：同上。
- 步骤：触发需要 OpenAlex 数据的操作（advisor/faculty 检索），观察 `/openalex/...` 请求。
- 期望结果：请求被重写到 `https://api.openalex.org/...`（去掉 `/openalex` 前缀），正常返回。
- 优先级：P1
- 类型：手动
- 关联：LEO-181

### TC-181-03 ROR 代理路径
- 前置条件：同上。
- 步骤：触发机构标准化请求，观察 `/ror/...`。
- 期望结果：重写到 `https://api.ror.org/...`，正常返回。
- 优先级：P1
- 类型：手动
- 关联：LEO-181

### TC-181-04 本地 dev 与线上代理一致
- 前置条件：本地 `npm run dev`。
- 步骤：对比 `vite.config.ts` server.proxy 与 `vercel.json` rewrites 的三个目标（api / openalex / ror）。
- 期望结果：三个上游目标与前缀改写规则在两处保持一致，行为一致。
- 优先级：P1
- 类型：手动
- 关联：LEO-181

### TC-181-05 vercel.json schema 合法
- 前置条件：仓库根目录。
- 步骤：校验 `vercel.json` 为合法 JSON 且含 `$schema` 与 3 条 rewrites。
- 期望结果：JSON 解析通过，rewrites 数组长度为 3，source/destination 齐全。
- 优先级：P2
- 类型：手动（可后续自动化）
- 关联：LEO-181

---

## LEO-182 首屏 bundle 懒加载（shrink first-load bundle）

### TC-182-01 大数据模块动态加载
- 前置条件：`npm run build`。
- 步骤：检查产物 chunk 拆分；`src/api.ts` 内 `localAdvisors`、`localFacultyDirectory`、`localDecisionFacts` 与 `src/localRankings.ts` 内 `qs2027Overall.json` 均使用 `await import(...)`。
- 期望结果：这些重资源不进入首屏主 chunk，仅在用到时按需加载。
- 优先级：P0
- 类型：手动
- 关联：LEO-182

### TC-182-02 maplibre / supabase 独立 vendor chunk
- 前置条件：`npm run build`。
- 步骤：查看 `dist/assets`，确认 `manualChunks` 生成独立的 maplibre、supabase chunk。
- 期望结果：maplibre、supabase 各自独立成块，首屏应用代码 chunk 不含其源码。
- 优先级：P1
- 类型：手动
- 关联：LEO-182

### TC-182-03 懒加载后 faculty tab 数据仍可用（回归）
- 前置条件：应用已加载，选中一所有 faculty 数据的学校。
- 步骤：切换到 faculty tab，等待 `localFacultyDirectory` 动态加载完成。
- 期望结果：懒加载完成后院系/教授目录正常渲染，分页可翻页，数据完整无缺失。
- 优先级：P0
- 类型：手动
- 关联：LEO-182

### TC-182-04 首屏加载体积回归基线
- 前置条件：`npm run build`。
- 步骤：记录首屏 JS gzip 体积，与优化前基线对比。
- 期望结果：首屏体积明显下降；构建无超过 `chunkSizeWarningLimit`(1100kB) 的应用代码告警。
- 优先级：P1
- 类型：手动
- 关联：LEO-182

### TC-182-05 慢网下懒加载有加载态
- 前置条件：DevTools 限速 Slow 3G。
- 步骤：切换到 faculty tab，观察加载过程。
- 期望结果：显示 `Loading faculty index` 等 InlineLoading 占位，不白屏、不报错。
- 优先级：P2
- 类型：手动
- 关联：LEO-182

---

## LEO-183 ErrorBoundary + 本地数据降级提示

### TC-183-01 组件抛错时 ErrorBoundary 兜底
- 前置条件：地图子树内制造一次渲染异常（注入测试错误）。
- 步骤：触发异常，观察界面。
- 期望结果：显示 "Something went wrong" 卡片、说明本地数据安全、提供 "Reload app" 按钮，不整页白屏。
- 优先级：P0
- 类型：手动
- 关联：LEO-183

### TC-183-02 Reload 按钮可恢复
- 前置条件：已进入 ErrorBoundary 兜底页。
- 步骤：点击 "Reload app"。
- 期望结果：调用 `window.location.reload()`，页面重载后恢复正常。
- 优先级：P1
- 类型：手动
- 关联：LEO-183

### TC-183-03 断网降级显示 "Local data" 横幅
- 前置条件：断开网络 / 拦截 `/api` 请求使其失败。
- 步骤：加载地图，触发数据请求失败走本地兜底。
- 期望结果：`onDataSourceChange` 上报 `local`，地图舞台出现 "Local data" 横幅（Layers3 图标），应用仍可用。
- 优先级：P0
- 类型：手动
- 关联：LEO-183

### TC-183-04 恢复联网切回 remote
- 前置条件：处于 local 降级态。
- 步骤：恢复网络并重新请求，返回真实数据。
- 期望结果：数据源切回 `remote`，"Local data" 横幅消失。
- 优先级：P1
- 类型：手动
- 关联：LEO-183

### TC-183-05 错误详情展示
- 前置条件：ErrorBoundary 捕获带 message 的错误。
- 步骤：查看兜底卡片。
- 期望结果：`error.message` 存在时以 `<pre>` 展示；同时 `componentDidCatch` 在 console 记录错误与组件栈。
- 优先级：P2
- 类型：手动
- 关联：LEO-183

---

## LEO-184 ESLint/Prettier 工具链 + CI 扩展

### TC-184-01 lint 零 error
- 前置条件：依赖已安装。
- 步骤：运行 `npm run lint`。
- 期望结果：ESLint 退出码 0，无 error（warning 可接受但需受控）。
- 优先级：P0
- 类型：自动化
- 关联：LEO-184

### TC-184-02 format:check 通过
- 前置条件：同上。
- 步骤：运行 `npm run format:check`。
- 期望结果：Prettier 校验 `src/**/*.{ts,tsx,css}` 全部符合格式，退出码 0。
- 优先级：P1
- 类型：自动化
- 关联：LEO-184

### TC-184-03 CI 流水线包含全部关卡
- 前置条件：查看 `.github/workflows/ci.yml`。
- 步骤：确认 job 步骤含 Lint、Build、Test recommendations、Test local rankings、Test ranking sources、Secret pattern scan。
- 期望结果：以上步骤齐全，push/PR 触发。
- 优先级：P0
- 类型：手动
- 关联：LEO-184

### TC-184-04 密钥扫描能拦截泄漏
- 前置条件：临时在源码引入形如 `AIza...` 的假密钥。
- 步骤：本地运行 CI 的 secret scan grep 规则。
- 期望结果：扫描命中并使步骤失败（返回非 0），提交前拦住密钥。清理测试污染。
- 优先级：P1
- 类型：手动
- 关联：LEO-184

### TC-184-05 build 通过
- 前置条件：依赖已安装。
- 步骤：运行 `npm run build`。
- 期望结果：`tsc -b` 类型检查通过 + `vite build` 产物生成，退出码 0。
- 优先级：P0
- 类型：自动化
- 关联：LEO-184

---

## LEO-185 首次引导 Welcome + 北美 CS 模板

### TC-185-01 新用户首访见引导
- 前置条件：清空 localStorage（无 `unimap.welcomeDismissed`，无偏好档案）。
- 步骤：首次打开应用。
- 期望结果：弹出 WelcomeOverlay，标题 "Turn a messy pile of schools into an executable shortlist..."，含 3 步引导与两个按钮。
- 优先级：P0
- 类型：手动
- 关联：LEO-185

### TC-185-02 老用户/已有偏好不见引导
- 前置条件：已存在偏好档案（`hasPreferenceProfile` 为真）或 `welcomeDismissed=true`。
- 步骤：打开应用。
- 期望结果：不展示 WelcomeOverlay，直接进入主界面。
- 优先级：P0
- 类型：手动
- 关联：LEO-185

### TC-185-03 dismissed 持久化
- 前置条件：新用户见到引导。
- 步骤：点击 "Skip for now"（或关闭按钮），刷新页面。
- 期望结果：`unimap.welcomeDismissed` 写入 `"true"`；刷新后不再弹出引导。
- 优先级：P0
- 类型：手动
- 关联：LEO-185

### TC-185-04 套用北美 CS 模板预填偏好
- 前置条件：新用户见到引导。
- 步骤：点击 "Start with North America CS template"。
- 期望结果：偏好表单预填 degreeLevel=Master、targetCountries="Canada, United States"、subjectAreas 含 CS/AI/ML、employmentPriority=high、immigrationPriority=high；引导关闭并标记 dismissed。
- 优先级：P0
- 类型：手动
- 关联：LEO-185

### TC-185-05 引导可从 Guide 入口重开
- 前置条件：已 dismiss 引导。
- 步骤：点击导航中的 Guide 按钮。
- 期望结果：重新打开 WelcomeOverlay，可再次套用模板或跳过。
- 优先级：P1
- 类型：手动
- 关联：LEO-185

### TC-185-06 模板不覆盖已填字段的确认（边界）
- 前置条件：用户已手动填写部分偏好后打开引导。
- 步骤：点击套用模板。
- 期望结果：行为符合设计（模板整体套用为预期语义），不产生崩溃或脏数据；用户可再编辑。
- 优先级：P2
- 类型：手动
- 关联：LEO-185

---

## LEO-186 Shortlist HTML 导出

### TC-186-01 空 shortlist 导出按钮禁用
- 前置条件：无任何已收藏学校（schoolCount=0）。
- 步骤：进入 Shareable shortlist 卡片。
- 期望结果："Export shortlist (HTML)" 按钮 `disabled`，并提示 "Save at least one school to export a shortlist."。
- 优先级：P0
- 类型：手动
- 关联：LEO-186

### TC-186-02 导出 HTML 含 fit / reasons / nextAction
- 前置条件：至少 1 所收藏学校并设置状态与理由。
- 步骤：点击导出，打开下载的 HTML。
- 期望结果：每张学校卡片含 fit 等级标签、Why keep/Why exclude、Concerns、Missing info、Next action（存在则渲染），文件名形如 `unimap-shortlist-YYYY-MM-DD.html`。
- 优先级：P0
- 类型：手动
- 关联：LEO-186

### TC-186-03 按决策状态分组且 shortlist 优先
- 前置条件：收藏多所学校，分属 shortlist/interested/其它状态。
- 步骤：导出并查看分组顺序。
- 期望结果：按 `shortlistStatusOrder` 分组，shortlist 组排最前，每组显示数量 count；空状态组不渲染。
- 优先级：P1
- 类型：手动
- 关联：LEO-186

### TC-186-04 HTML 转义防注入
- 前置条件：在 keepReason/notes 中填入 `<script>` 或 `&<>"` 等字符。
- 步骤：导出并检查 HTML 源码。
- 期望结果：用户文本经 `escapeHtml` 转义，不产生可执行标签或破坏结构。
- 优先级：P0
- 类型：手动
- 关联：LEO-186

### TC-186-05 偏好摘要与导出计数提示
- 前置条件：已保存偏好档案与若干学校。
- 步骤：导出。
- 期望结果：HTML 含偏好信号摘要（无偏好时显示 "No preference profile saved yet."）；导出后应用提示 "Exported an HTML shortlist for N schools."。
- 优先级：P1
- 类型：手动
- 关联：LEO-186

### TC-186-06 无 nextAction 时回退到 fit 建议（边界）
- 前置条件：学校未手填 nextAction。
- 步骤：导出查看该卡片。
- 期望结果：Next action 回退使用 `fit.nextAction`，不出现空白行。
- 优先级：P2
- 类型：手动
- 关联：LEO-186

---

## LEO-187 排名数据合规隔离 + 来源标注

### TC-187-01 排名列表处处有来源标注
- 前置条件：加载任一排名（如 QS 2027 Overall）。
- 步骤：查看排名列表 / 详情 / 侧栏。
- 期望结果：每处排名视图均显示 `RANKINGS_DISCLAIMER`（"Rankings © respective publishers, shown for reference only."）与 source attribution。
- 优先级：P0
- 类型：手动
- 关联：LEO-187

### TC-187-02 官方来源外链正确
- 前置条件：展示 QS / THE / ARWU / CSRankings 任一来源。
- 步骤：点击官方来源链接。
- 期望结果：`getRankingSourceLink` 返回对应官方 https URL（topuniversities / timeshighereducation / shanghairanking / csrankings），链接可跳转到完整榜单。
- 优先级：P0
- 类型：自动化
- 关联：LEO-187

### TC-187-03 本地仅展示有限切片
- 前置条件：某排名源本地条目 > 25。
- 步骤：查看列表。
- 期望结果：本地仅展示前 `RANKING_LIST_LIMIT`(25) 条，并提示 "Showing the top 25"，完整榜单指向官方外链。
- 优先级：P0
- 类型：手动
- 关联：LEO-187

### TC-187-04 未知来源不编造链接（边界）
- 前置条件：来源名未匹配任何已知发布方。
- 步骤：调用/观察来源链接解析。
- 期望结果：无 fallbackUrl 时返回 null（不虚构链接）；有 fallbackUrl 时使用该 URL 并保留标签。
- 优先级：P1
- 类型：自动化
- 关联：LEO-187

### TC-187-05 QS 本地数据来源字段完整
- 前置条件：QS 2027 本地数据集。
- 步骤：检查 feature.properties 的 sourceName/sourceUrl/attribution。
- 期望结果：source=QS，url 指向 topuniversities 官方页，attribution="Source: QS World University Rankings 2027 (QS Ltd.)"。
- 优先级：P1
- 类型：自动化（见 rankingSources.test / localRankings.test）
- 关联：LEO-187

### TC-187-06 disclaimer 文案不为空且语义正确
- 前置条件：`src/rankingSources.ts`。
- 步骤：校验 `RANKINGS_DISCLAIMER` 非空且含 "reference"。
- 期望结果：断言通过。
- 优先级：P2
- 类型：自动化
- 关联：LEO-187
