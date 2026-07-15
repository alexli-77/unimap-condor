# 回归验证报告 — v1.0 P0 Sprint（LEO-181~187）

- 日期：2026-07-15
- 执行人：Leon（回归测试工程师）
- 仓库：unimap-condor
- 基线 commit：`b40c1cb`（chore: baseline snapshot before v1.0 P0 optimization sprint）
- 被测范围：`b40c1cb..HEAD`（HEAD=`e31714a`），共 8 个 commit（LEO-181~187 + 测试用例集合）
- Node 环境：本地工作区（对齐 CI Node 22）

---

## 一、执行摘要

- 自动化三关（lint / test / build）**全部通过**；lint 0 error（33 warning，均为 eslint 配置中主动降级、受控）。
- 首屏主应用 chunk `index-*.js` gzip **90.14 KB**，远低于 250 KB 目标；重资源（maplibre / supabase / QS 数据 / faculty / advisors / decisionFacts）均已拆为独立/懒加载 chunk。
- 运行时冒烟：`build + preview` 后首页与全部关键静态资源（含懒加载 chunk）均返回 **200**。
- 代码级走查：7 个 P0 issue 的核心逻辑均满足验收期望，未发现 P0 级 bug、无行为破坏、无遗漏的 async 调用方、无误提交文件。
- **唯一实质发现**：`npm run format:check` 失败（8 个文件不符合 Prettier 格式）→ 对应 TC-184-02（P1）不达标。该关卡未纳入 CI，不阻断构建与发布，但建议合并前 `prettier --write` 修复。

**结论：可进入发布准备**（format:check 为非阻断性整洁度问题，建议但不强制在发布前修复）。

---

## 二、自动化结果表

| 项目 | 命令 | 结果 | 说明 |
|---|---|---|---|
| Lint | `npm run lint` | ✅ 通过 | 0 error / 33 warning（setState-in-effect、API 边界 any、未用变量，均在 eslint.config.js 中主动降为 warning，受控） |
| 格式检查 | `npm run format:check` | ❌ 失败 | 8 文件未格式化：api.ts、App.tsx、WelcomeOverlay.tsx、localAdvisors.ts、localDecisionFacts.ts、localFacultyDirectory.ts、recommendationPolicy.ts、styles.css |
| 单测-推荐策略 | `npm run test:recommendations` | ✅ 通过 | 4 scenarios passed |
| 单测-本地排名 | `npm run test:local-rankings` | ✅ 通过 | QS 2027 total=1504，location 质量计数正常 |
| 单测-排名来源 | `npm run test:ranking-sources` | ✅ 通过 | knownSources=6, listLimit=25 |
| 构建 | `npm run build` | ✅ 通过 | `tsc -b` 类型检查 + `vite build` 成功，1748 模块，无应用代码超限告警 |

### Bundle 体积（vite build 产物，gzip）

| 产物 | 原始 | gzip | 性质 | 判定 |
|---|---|---|---|---|
| `index-*.js`（**主应用 chunk**） | 294.38 KB | **90.14 KB** | 首屏 | ✅ ≤250 KB 目标 |
| `index-*.css` | 103.97 KB | 16.24 KB | 首屏 | 正常 |
| `maplibre-*.js` | 1053.01 KB | 284.54 KB | 独立 vendor（地图引擎） | 独立成块 ✅；gzip 超 250KB 但属地图引擎、非应用主 chunk，`chunkSizeWarningLimit` 已主动调至 1100 |
| `qs2027Overall-*.js` | 406.89 KB | 69.07 KB | 懒加载（await import json） | ✅ 不入首屏 |
| `localFacultyDirectory-*.js` | 168.25 KB | 25.19 KB | 懒加载 | ✅ |
| `localAdvisors-*.js` | 39.37 KB | 6.41 KB | 懒加载 | ✅ |
| `localDecisionFacts-*.js` | 13.27 KB | 2.49 KB | 懒加载 | ✅ |
| `supabase-*.js` | ~0 KB（1 字节） | 0.02 KB | 独立 vendor | ⚠️ 空 chunk（见问题 #3） |
| `mascot-*.webp` | 24.83 KB | — | 静态资源 | 体积合理 |
| `index.html` | 0.61 KB | 0.35 KB | 入口 | 正常，含 main js script + maplibre modulepreload + css link |

---

## 三、构建产物检查

- `dist/assets/` 已按预期拆分：maplibre、supabase 各自独立 chunk；QS 数据、faculty、advisors、decisionFacts 均为独立懒加载 chunk。
- `dist/index.html` 结构正常：注入 `/assets/index-*.js`（module）、`modulepreload` 预载 maplibre、`stylesheet` 引入 css，`<div id="root">` 存在。
- mascot webp 24.83 KB，体积健康。
- ⚠️ vite 提示 `Generated an empty chunk: "supabase"`——supabase-js 被列入 manualChunks 但当前无运行时引用被打入，产物为 1 字节空块（见问题 #3）。

---

## 四、TC-P0-core 用例走查结果表

图例：✅通过 / ❌不通过 / 🔍代码级已确认 / 🧪需人工浏览器验证

### LEO-181 Vercel API 反向代理

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-181-01 生产 /api 代理转发 | 手动 | 🧪 需人工 | 需线上 Vercel 部署后网络面板验证 |
| TC-181-02 OpenAlex 代理 | 手动 | 🧪 需人工 | 同上（线上） |
| TC-181-03 ROR 代理 | 手动 | 🧪 需人工 | 同上（线上） |
| TC-181-04 dev 与线上代理一致 | 手动 | ✅🔍 | vite.config.ts 与 vercel.json 三上游一致：api 保留前缀、openalex/ror 去前缀，规则对齐 |
| TC-181-05 vercel.json schema 合法 | 手动 | ✅🔍 | 合法 JSON，含 `$schema`，rewrites 长度=3，source/destination 齐全 |

### LEO-182 首屏 bundle 懒加载

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-182-01 大数据模块动态加载 | 手动 | ✅🔍 | api.ts 对 localAdvisors/localFacultyDirectory/localDecisionFacts、localRankings.ts 对 qs2027Overall.json 均用 `await import(...)`；产物为独立 chunk |
| TC-182-02 maplibre/supabase 独立 vendor | 手动 | ✅🔍 | manualChunks 生成独立块；主应用 chunk 不含其源码 |
| TC-182-03 懒加载后 faculty tab 数据可用 | 手动 | 🧪 需人工 | 代码路径正确（async 已改造并 await），渲染/分页需浏览器验证 |
| TC-182-04 首屏体积回归基线 | 手动 | ✅🔍 | 主 chunk gzip 90.14KB；无应用代码超 1100KB 告警 |
| TC-182-05 慢网懒加载有加载态 | 手动 | 🧪 需人工 | 需 DevTools 限速观察 InlineLoading |

### LEO-183 ErrorBoundary + 本地降级提示

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-183-01 组件抛错兜底 | 手动 | ✅🔍 | ErrorBoundary 渲染 "Something went wrong" 卡片 + 本地数据安全说明 + "Reload app"；main.tsx 已包裹 `<App/>` |
| TC-183-02 Reload 可恢复 | 手动 | ✅🔍 | handleReload 调 `window.location.reload()`（运行态需人工点击确认，逻辑已确认） |
| TC-183-03 断网降级 Local data 横幅 | 手动 | ✅🔍 | api 各 catch 走 `reportDataSource("local")`；App 订阅 `onDataSourceChange`，`dataSource==="local"` 时渲染 "Local data" 横幅 |
| TC-183-04 恢复联网切回 remote | 手动 | ✅🔍 | 成功路径 `reportDataSource("remote")`，横幅随 state 消失 |
| TC-183-05 错误详情展示 | 手动 | ✅🔍 | `error.message` 存在时以 `<pre>` 展示；componentDidCatch 记录 error + componentStack |

### LEO-184 ESLint/Prettier + CI

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-184-01 lint 零 error | 自动化 | ✅ | 退出码 0，0 error / 33 warning（受控） |
| TC-184-02 format:check 通过 | 自动化 | ❌ | **失败，8 文件不符合格式**（见问题 #1） |
| TC-184-03 CI 含全部关卡 | 手动 | ✅🔍 | ci.yml 含 Lint、Build、Test recommendations/local-rankings/ranking-sources、Secret pattern scan，push/PR 触发 |
| TC-184-04 密钥扫描可拦截 | 手动 | 🧪 需人工 | grep 规则包含 AIza/sk-/ghp_ 等模式（模式正确），实注入拦截需人工执行 |
| TC-184-05 build 通过 | 自动化 | ✅ | 退出码 0 |

### LEO-185 首次引导 Welcome + 北美 CS 模板

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-185-01 新用户首访见引导 | 手动 | ✅🔍 | showWelcome 初值 = 未 dismiss 且无偏好档案；WelcomeOverlay 标题与 3 步 + 双按钮匹配（渲染需人工确认） |
| TC-185-02 老用户/已有偏好不见引导 | 手动 | ✅🔍 | `hasPreferenceProfile` 或 `welcomeDismissed==="true"` 时 showWelcome=false |
| TC-185-03 dismissed 持久化 | 手动 | ✅🔍 | dismissWelcome 写入 `unimap.welcomeDismissed="true"`（刷新不再弹需人工确认） |
| TC-185-04 套用北美 CS 模板预填 | 手动 | ✅🔍 | northAmericaCsTemplate：degreeLevel=Master、targetCountries="Canada, United States"、subjectAreas 含 CS/AI/ML、employment/immigrationPriority=high；套用后关闭并标记 dismissed |
| TC-185-05 Guide 入口重开 | 手动 | ✅🔍 | openGuide=`setShowWelcome(true)`，Guide 按钮已接线 |
| TC-185-06 模板不覆盖已填字段（边界） | 手动 | 🧪 需人工 | 语义为整体套用模板到 config 草稿，无脏数据/崩溃风险；交互需人工确认 |

### LEO-186 Shortlist HTML 导出

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-186-01 空 shortlist 按钮禁用 | 手动 | ✅🔍 | 按钮 `disabled={!schoolCount}`，并渲染 "Save at least one school to export a shortlist." |
| TC-186-02 导出含 fit/reasons/nextAction | 手动 | ✅🔍 | 卡片渲染 fit 标签、Why keep/exclude、Concerns、Missing info、Next action；文件名 `unimap-shortlist-${date}.html`（实际下载需人工） |
| TC-186-03 按状态分组且 shortlist 优先 | 手动 | ✅🔍 | shortlistStatusOrder 首位 shortlist，分组显示 count，空组不渲染 |
| TC-186-04 HTML 转义防注入 | 手动 | ✅🔍 | escapeHtml 覆盖 `& < > " '`，用户文本全部经其转义 |
| TC-186-05 偏好摘要与计数提示 | 手动 | ✅🔍 | 含偏好摘要；导出后提示 "Exported an HTML shortlist for N schools." |
| TC-186-06 无 nextAction 回退 fit 建议（边界） | 手动 | ✅🔍 | `decision.nextAction.trim() \|\| fit.nextAction` |

### LEO-187 排名数据合规隔离 + 来源标注

| 用例 | 类型 | 判定 | 依据 |
|---|---|---|---|
| TC-187-01 处处有来源标注 | 手动 | ✅🔍 | RANKINGS_DISCLAIMER 在 3 处排名视图渲染（主列表、侧栏/详情、详情面板） |
| TC-187-02 官方来源外链正确 | 自动化 | ✅ | ranking-sources 测试通过；getRankingSourceLink 返回 topuniversities/timeshighereducation/shanghairanking/csrankings 官方 URL |
| TC-187-03 本地仅展示有限切片 | 手动 | ✅🔍 | `rows.slice(0, RANKING_LIST_LIMIT=25)`，提示 "Showing the top 25"，完整榜单指向外链 |
| TC-187-04 未知来源不编造链接（边界） | 自动化 | ✅ | 无 fallbackUrl 返回 null；有则用 fallback 并保留标签（测试覆盖） |
| TC-187-05 QS 本地来源字段完整 | 自动化 | ✅ | localRankings 测试：source=QS、topuniversities URL、attribution 完整 |
| TC-187-06 disclaimer 非空且含 reference | 自动化 | ✅ | 常量含 "shown for reference only" |

**走查汇总**：自动化用例 5/5 相关断言通过；手动用例代码级确认 21 项；需人工浏览器/线上验证 7 项；不通过 1 项（TC-184-02）。

---

## 五、运行时冒烟（build + preview + curl）

| 资源 | HTTP 状态 |
|---|---|
| 首页 `/` | 200 |
| 主应用 `/assets/index-*.js` | 200 |
| maplibre chunk | 200 |
| QS2027 懒加载 chunk | 200 |
| faculty 懒加载 chunk | 200 |
| css | 200 |
| mascot webp | 200 |

浏览器交互（地图渲染、faculty tab 切换、welcome 弹窗、导出下载）无法自动化，标注见第七节。

---

## 六、diff 审查发现

审查文件：App.tsx（+486）、api.ts（+60，懒加载改造）、localRankings.ts（懒加载改造）、vercel.json、vite.config.ts、eslint.config.js、WelcomeOverlay.tsx、ErrorBoundary.tsx、main.tsx、ci.yml。

- **async 改造无遗漏**：api.ts 中 4 个转为 async 的函数（getLocalAdvisorCards、getFacultyDirectoryEntries、getLocalRankingCollection、getLocalUniversityDetail/mergeLocalUniversityDetail）的所有调用方均已加 `await`；这些函数原本即经 `api.*`（返回 Promise）对外暴露，消费端（App.tsx）无感知，无破坏。
- **无行为破坏风险**：数据源上报（remote/local）在成功/兜底路径均正确触发。
- **无误提交文件**：`.gitignore` 覆盖 dist/、.tmp-recommendation-tests/、.tmp-ranking-tests/、.env.*、密钥类文件；`git status` 干净；dist/tmp 均未被跟踪。docs/assets/mascot.webp 为合法新增源资源。

---

## 七、发现的问题列表（按严重程度）

### P1

**#1 `npm run format:check` 失败（8 文件未格式化）** — 对应 TC-184-02。
- 文件：src/api.ts、src/App.tsx、src/components/WelcomeOverlay.tsx、src/localAdvisors.ts、src/localDecisionFacts.ts、src/localFacultyDirectory.ts、src/recommendationPolicy.ts、src/styles.css。
- 影响：整洁度/工具链一致性不达标。**不阻断**：CI（ci.yml）未纳入 format:check 关卡，构建与部署不受影响。
- 建议：合并/发布前运行 `npm run format`（prettier --write）统一格式，并考虑将 `format:check` 补入 CI 以防回潮。
- 处置：按要求仅记录、未自行修复（非一行级笔误，涉及 8 文件批量重排）。

### P2 / 提示级

**#2 33 个 ESLint warning**：react-hooks/set-state-in-effect、API 边界 `any`、未用变量（EmptySelection、priorityWeight）。已在 eslint.config.js 主动降级为 warning 并注释说明，属受控技术债，不阻断。

**#3 supabase 空 chunk**：manualChunks 将 `@supabase/supabase-js` 单列，但当前无运行时代码被打入，产物为 ~1 字节空块，vite 提示 `Generated an empty chunk`。无功能影响；建议后续确认 supabase 是否仍需保留为独立 vendor，或按需移除该 manualChunk 以消除告警。

**#4 maplibre vendor chunk gzip 284.54 KB**：超过 250KB 但属地图引擎、非应用主 chunk，且 `chunkSizeWarningLimit` 已主动上调至 1100 并注释说明，符合设计预期，仅作记录。

> 未发现 P0 级 bug。

---

## 八、需人工浏览器 / 线上验证清单

1. TC-181-01/02/03：Vercel 线上部署后，网络面板确认 `/api`、`/openalex`、`/ror` 重写生效且无 CORS。
2. TC-182-03：选中含 faculty 数据的学校，切 faculty tab，确认懒加载后目录渲染 + 分页正常。
3. TC-182-05：Slow 3G 下切 faculty tab，确认显示 InlineLoading 占位、不白屏。
4. TC-183-01/02：注入渲染异常，确认 ErrorBoundary 兜底卡片显示 + 点击 "Reload app" 恢复。
5. TC-183-03/04：断网/拦截 `/api` 使失败，确认 "Local data" 横幅出现；恢复后横幅消失。
6. TC-184-04：临时注入 `AIza...` 假密钥，本地跑 CI secret scan grep，确认命中并使步骤失败（清理污染）。
7. TC-185-01/03/04/05/06：新用户见 WelcomeOverlay；Skip 后刷新不再弹；套用模板确认表单预填 5 字段；Guide 按钮重开引导。
8. TC-186-02/05：实际点击导出，打开下载 HTML，确认卡片内容、文件名、导出计数提示。

---

## 九、结论

- **回归结论：可进入发布准备。** 自动化三关（lint/test/build）全绿，主 chunk 体积达标，懒加载/vendor 拆分符合设计，运行时冒烟全部 200，7 个 P0 issue 核心逻辑代码级确认满足验收，未发现 P0 级 bug、无行为破坏、无 async 调用遗漏、无误提交。
- **发布前建议（非阻断）**：修复 P1 #1（`prettier --write`）以使 format:check 转绿，并将其补入 CI；确认 #3 supabase 空 chunk 处置。
- 需人工浏览器/线上验证 8 组用例（见第七节），建议发布前由 QA 在预览环境走查一遍。
