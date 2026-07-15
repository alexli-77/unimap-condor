# TC-existing — 存量核心功能用例

> 覆盖 P0 优化前已有的核心闭环：偏好、收藏与状态流转、决策卡、推荐排序、Compare、地图筛选/搜索。
> 字段：ID / 前置条件 / 步骤 / 期望结果 / 优先级 / 类型 / 关联 issue。

---

## 1. Preference 偏好保存 / 读取

### TC-EX-PREF-01 偏好保存到 localStorage
- 前置条件：应用已加载。
- 步骤：填写偏好表单（学位、国家、学科、预算、优先级），保存。
- 期望结果：写入 `unimap.preferenceProfile`，`schemaVersion=1`、`updatedAt` 更新。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-PREF-02 刷新后偏好回读
- 前置条件：已保存偏好。
- 步骤：刷新页面。
- 期望结果：`loadPreferenceProfile` 读回并预填表单，字段与保存值一致。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-PREF-03 损坏数据归一化
- 前置条件：手动写入非法/缺字段的偏好 JSON。
- 步骤：加载应用。
- 期望结果：`normalizePreferenceProfile` 合并默认值，优先级非法值回退 medium，布尔字段有默认，不崩溃。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-PREF-04 偏好信号驱动 fit
- 前置条件：设置明确偏好（如 employmentPriority=high）。
- 步骤：查看学校 fit 评分与解释。
- 期望结果：`getPreferenceSignals` 产出对应信号，fit 的 matched/concerns 随偏好变化。
- 优先级：P1
- 类型：手动
- 关联：existing

---

## 2. Favorites 与状态流转（interested → shortlist）

### TC-EX-FAV-01 收藏学校
- 前置条件：地图选中一所学校。
- 步骤：点击 Star 收藏。
- 期望结果：写入 `unimap.favorites`，kind=school，含 universityId/坐标/名称，出现在 workspace。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-FAV-02 取消收藏
- 前置条件：已收藏该学校。
- 步骤：再次点击 Star。
- 期望结果：从 favorites 移除，workspace 同步消失。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-FAV-03 状态流转 interested → shortlist
- 前置条件：已收藏学校，默认状态 interested。
- 步骤：将状态切到 shortlist。
- 期望结果：`unimap.schoolDecisions` 更新 status=shortlist，`updatedAt` 刷新；workspace 分组随之移动。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-FAV-04 状态持久化与归一化
- 前置条件：设置多种状态后刷新；或注入非法 status。
- 步骤：加载应用。
- 期望结果：`normalizeSchoolDecisions` 回读，合法状态保留，非法回退 interested，reason 字段有默认空串。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-FAV-05 workspace 按状态 tab 分组
- 前置条件：不同状态的收藏学校若干。
- 步骤：在 workspace 切换状态 tab。
- 期望结果：各 tab 显示对应状态学校；当前 tab 无内容时自动回退到首个有内容分组（fallbackStatus）。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-FAV-06 收藏项归一化健壮性（边界）
- 前置条件：注入缺字段/坐标非数值的 favorites。
- 步骤：加载应用。
- 期望结果：`normalizeFavoriteItem` 丢弃非法项，不渲染坏卡片，不崩溃。
- 优先级：P2
- 类型：手动
- 关联：existing

---

## 3. 决策卡生成

### TC-EX-DEC-01 默认决策卡
- 前置条件：新收藏一所学校。
- 步骤：打开其决策卡。
- 期望结果：`getDefaultSchoolDecision` 生成 status=interested，keep/reject/nextAction 为空的初始卡。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-DEC-02 填写 keep/reject/nextAction 保存
- 前置条件：决策卡已打开。
- 步骤：填写保留理由、排除理由、下一步动作并保存。
- 期望结果：写入 schoolDecisions，刷新后回读一致。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-DEC-03 决策卡建议下一步动作
- 前置条件：某学校无手填 nextAction。
- 步骤：查看决策卡/导出。
- 期望结果：回退展示 fit 推荐的 nextAction，且随状态（如 shortlist 提示对比邻近候选）变化。
- 优先级：P2
- 类型：手动
- 关联：existing

---

## 4. 推荐排序（recommendationPolicy）

### TC-EX-REC-01 学校/院系/导师排序 top 命中
- 前置条件：`tests/fixtures/recommendationScenarios.ts` 场景集。
- 步骤：运行 `npm run test:recommendations`。
- 期望结果：每个场景 topSchool/topDepartment/topAdvisor 与期望一致，全部通过。
- 优先级：P0
- 类型：自动化
- 关联：existing

### TC-EX-REC-02 评分结果可解释
- 前置条件：同上。
- 步骤：检查 scoreSchool/scoreDepartment/scoreAdvisor 返回。
- 期望结果：matched/concerns/missing 至少一项非空，且 nextAction 非空。
- 优先级：P0
- 类型：自动化
- 关联：existing

### TC-EX-REC-03 解释包含关键匹配词
- 前置条件：含 `schoolMatchedIncludes`/`advisorMatchedIncludes` 的场景。
- 步骤：运行推荐测试。
- 期望结果：top 结果解释包含期望关键词（大小写不敏感）。
- 优先级：P1
- 类型：自动化
- 关联：existing

### TC-EX-REC-04 偏好变化影响排序（边界）
- 前置条件：构造相反偏好。
- 步骤：对同一批学校用不同偏好评分。
- 期望结果：排序结果随偏好显著变化，concerns/missing 相应增减。
- 优先级：P1
- 类型：手动
- 关联：existing

---

## 5. Compare 对比

### TC-EX-CMP-01 加入对比
- 前置条件：地图/列表中有多所学校。
- 步骤：将 2~3 所学校加入 Compare。
- 期望结果：对比视图并排展示各校关键指标（排名、fit、地点等）。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-CMP-02 移除与清空对比
- 前置条件：对比中已有学校。
- 步骤：移除单个 / 清空全部。
- 期望结果：对应列消失 / 对比清空，状态一致。
- 优先级：P2
- 类型：手动
- 关联：existing

### TC-EX-CMP-03 shortlist 状态引导对比
- 前置条件：学校状态为 shortlist。
- 步骤：查看决策建议。
- 期望结果：提示 "Compare this school against two nearby shortlist candidates."。
- 优先级：P2
- 类型：手动
- 关联：existing

---

## 6. 地图筛选 / 搜索

### TC-EX-MAP-01 排名源 / 年份 / 学科筛选
- 前置条件：地图已加载可用排名源。
- 步骤：切换 source / year / subject（如 QS 2027 Overall）。
- 期望结果：地图点位与列表随筛选更新，来源标注同步刷新。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-MAP-02 学校搜索定位
- 前置条件：地图已加载。
- 步骤：搜索某大学名。
- 期望结果：命中结果，地图定位/高亮到该校，可打开详情。
- 优先级：P0
- 类型：手动
- 关联：existing

### TC-EX-MAP-03 点位坐标有效性
- 前置条件：QS 2027 本地数据。
- 步骤：运行 `npm run test:local-rankings`。
- 期望结果：每条记录 coordinates 为 [lng,lat] 且非 [0,0]；locationQuality 分布符合基线。
- 优先级：P0
- 类型：自动化
- 关联：existing

### TC-EX-MAP-04 空结果 / 无匹配（边界）
- 前置条件：搜索不存在的名称或过严筛选。
- 步骤：执行搜索/筛选。
- 期望结果：显示空态提示，不崩溃，可清除条件恢复。
- 优先级：P1
- 类型：手动
- 关联：existing

### TC-EX-MAP-05 详情面板 tab 切换
- 前置条件：打开某校详情。
- 步骤：在 rankings / faculty 等 tab 间切换。
- 期望结果：各 tab 数据正确加载（faculty 走懒加载），来源标注齐全。
- 优先级：P1
- 类型：手动
- 关联：existing
