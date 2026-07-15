# TC-P1-planned — LEO-188~193 预写验收用例框架

> 这些任务尚未开发，用例作为**将来开发的验收基准**。字段：ID / 前置条件 / 步骤 / 期望结果 / 优先级 / 类型 / 关联 issue。
> 状态标注为「待开发」，开发完成后应从此文档提升为正式用例并回填实际断言。

---

## LEO-188 [P1] Compare 升级为决策对比表（规模 M）

> 目标：对比维度改为 fit 等级、资助、学费 vs 预算、missing 数、决策状态、下一步动作；排名仅作一行参考；支持从 Saved 一键加入对比，≥3 校并排。

### TC-188-01 对比表包含决策维度
- 前置条件：加入 2~3 所已保存学校到对比。
- 步骤：打开决策对比表。
- 期望结果：并排展示 fit 等级、资助、学费 vs 预算、missing 数、决策状态、下一步动作各行；排名仅作一行参考。
- 优先级：P1
- 类型：手动
- 关联：LEO-188（待开发）

### TC-188-02 从 Saved 一键加入对比
- 前置条件：workspace 有已保存学校。
- 步骤：在 Saved 列表点击"加入对比"。
- 期望结果：该校进入对比表，无需重复搜索。
- 优先级：P1
- 类型：手动
- 关联：LEO-188（待开发）

### TC-188-03 至少支持 3 校并排
- 前置条件：加入 3 所学校。
- 步骤：查看对比表。
- 期望结果：3 校并排展示完整；超出免费额度时给出后续付费解锁提示（不崩溃）。
- 优先级：P1
- 类型：手动
- 关联：LEO-188（待开发）

### TC-188-04 缺失数据的降级展示（边界）
- 前置条件：对比中含非样板校（缺就业/移民数据）。
- 步骤：查看对应单元格。
- 期望结果：缺失维度显示明确占位/降级文案，不显示空白或 undefined。
- 优先级：P2
- 类型：手动
- 关联：LEO-188（待开发）

---

## LEO-189 [P1] 北美数据样板：美国 Top CS 10-12 校决策数据（规模 L）

> 目标：补美国 Top CS ≥10 所决策卡（programs/tuition/funding/deadlines/requirements/faculty/就业/移民），走 draft→verified 审核流，来源可追踪。

### TC-189-01 ≥10 所美国学校决策卡字段填满
- 前置条件：数据样板已导入 verified。
- 步骤：逐一打开美国样板校决策卡。
- 期望结果：≥10 所学校 programs/tuition/funding/deadlines/requirements 字段完整、来源可查。
- 优先级：P1
- 类型：手动
- 关联：LEO-189（待开发）

### TC-189-02 就业/移民两栏不再 "not connected"
- 前置条件：同上。
- 步骤：查看就业（OPT/H1B/薪资）与移民（STEM OPT/H1B 抽签）栏。
- 期望结果：两栏显示结构化真实数据 + 来源，不再是 "not connected"。
- 优先级：P1
- 类型：手动
- 关联：LEO-189（待开发）

### TC-189-03 来源可追踪（draft→verified）
- 前置条件：intake 审核流产物。
- 步骤：检查每条事实的 source/verified 标记。
- 期望结果：每条决策事实可追溯到来源，且状态为 verified。
- 优先级：P1
- 类型：自动化（可对 localDecisionFacts / intake 产物做字段完整性校验）
- 关联：LEO-189（待开发）

---

## LEO-190 [P1] 加拿大样板就业/移民实数据补齐（规模 M）

> 目标：为加拿大 4 校补 co-op/毕业去向/薪资/PGWP/省提名结构化事实，并让推荐引擎消费这些字段。

### TC-190-01 4 校就业/移民两栏有真实数据
- 前置条件：加拿大 McGill/UBC/UofT/Waterloo 数据补齐。
- 步骤：打开 4 校决策卡就业/移民栏。
- 期望结果：co-op、毕业去向、薪资、PGWP、省提名有真实数据 + 来源。
- 优先级：P1
- 类型：手动
- 关联：LEO-190（待开发）

### TC-190-02 推荐 matched/concerns 出现就业移民信号
- 前置条件：偏好 employmentPriority/immigrationPriority=high。
- 步骤：查看这些学校推荐解释。
- 期望结果：matched reasons / concerns 中出现就业/移民相关信号，不再一律输出 "not connected yet"。
- 优先级：P1
- 类型：自动化（新增 recommendationScenarios 就业/移民场景）
- 关联：LEO-190（待开发）

### TC-190-03 字段缺失时的回退（边界）
- 前置条件：某校部分就业/移民字段暂缺。
- 步骤：查看推荐与决策卡。
- 期望结果：仅缺失字段降级提示，已有字段正常消费，不整栏塌陷。
- 优先级：P2
- 类型：手动
- 关联：LEO-190（待开发）

---

## LEO-191 [P1] 非样板校诚实降级提示 + 学校需求收集入口（规模 S）

> 目标：非样板校显示诚实提示，加"想看这所学校？告诉我们"需求收集入口。

### TC-191-01 非样板校诚实降级提示
- 前置条件：选中一所样板外学校。
- 步骤：打开决策卡 / faculty tab。
- 期望结果：不再出现空 tab，显示"该校暂无深度决策数据，当前专注北美 CS 样板"类说明。
- 优先级：P1
- 类型：手动
- 关联：LEO-191（待开发）

### TC-191-02 学校需求收集入口可用
- 前置条件：处于非样板校提示界面。
- 步骤：点击"想看这所学校？告诉我们"并提交。
- 期望结果：需求被记录（本地记录或表单），有成功反馈。
- 优先级：P1
- 类型：手动
- 关联：LEO-191（待开发）

### TC-191-03 样板校不受影响（回归）
- 前置条件：选中北美 CS 样板校。
- 步骤：查看各 tab。
- 期望结果：样板校仍展示完整决策数据，不误触降级提示。
- 优先级：P1
- 类型：手动
- 关联：LEO-191（待开发）

---

## LEO-192 [P1] 拆分 App.tsx + WorkspaceProvider 状态收敛（规模 L）

> 目标：抽 detail 面板与 RankingMap 到 components/；抽 hooks（useFavorites/useSchoolDecisions/usePreferenceProfile/useRankingData）；WorkspaceProvider Context 收敛工作区状态。App.tsx ≤800 行且无回归。

### TC-192-01 App.tsx ≤ 800 行
- 前置条件：重构完成。
- 步骤：统计 `src/App.tsx` 行数。
- 期望结果：≤ 800 行；detail 面板/RankingMap/hooks 已抽到独立文件。
- 优先级：P1
- 类型：自动化（行数断言 + 目录结构检查）
- 关联：LEO-192（待开发）

### TC-192-02 工作区状态统一从 useWorkspace() 读取
- 前置条件：WorkspaceProvider 落地。
- 步骤：检查 favorites/decisions/preference 的读取路径。
- 期望结果：均经 `useWorkspace()`，无深层 prop drilling。
- 优先级：P1
- 类型：手动（结合静态检查）
- 关联：LEO-192（待开发）

### TC-192-03 行为无回归（全量回归）
- 前置条件：重构完成。
- 步骤：执行 TC-P0-core + TC-existing 全量回归 + `npm test`。
- 期望结果：收藏/状态流转/偏好/导出/推荐/地图行为与重构前一致，测试全绿。
- 优先级：P0
- 类型：自动化 + 手动
- 关联：LEO-192（待开发）

---

## LEO-193 [P1] 迁移 Vitest + 补 api 回退路径与工作流测试（规模 M）

> 目标：引入 Vitest + @testing-library/react + jsdom；迁移现有 2 个测试并删手工 tsc 脚本；补 api 回退、recommendationPolicy 边界、localStorage 序列化。

### TC-193-01 vitest run 全绿并入 CI
- 前置条件：Vitest 配置完成。
- 步骤：运行 `vitest run` 并检查 CI。
- 期望结果：全部用例通过，`vitest run` 步骤已入 ci.yml。
- 优先级：P0
- 类型：自动化
- 关联：LEO-193（待开发）

### TC-193-02 现有测试迁移无损
- 前置条件：迁移完成。
- 步骤：确认 recommendationPolicy、localRankings、rankingSources 三套断言迁到 Vitest，删除手工 tsc 脚本。
- 期望结果：断言等价迁移，覆盖不下降。
- 优先级：P1
- 类型：自动化
- 关联：LEO-193（待开发）

### TC-193-03 api 回退路径有覆盖
- 前置条件：mock Supabase client 失败。
- 步骤：运行 api 回退用例。
- 期望结果："Supabase 失败→本地回退"被覆盖，`onDataSourceChange` 上报 local，返回本地兜底数据。
- 优先级：P0
- 类型：自动化
- 关联：LEO-193（待开发）

### TC-193-04 localStorage 序列化往返
- 前置条件：jsdom 环境。
- 步骤：对 favorites/decisions/preference 做 save→load 往返及损坏数据归一化用例。
- 期望结果：往返一致；损坏数据被归一化不抛错。
- 优先级：P1
- 类型：自动化
- 关联：LEO-193（待开发）
