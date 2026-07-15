# tests/cases — 测试用例索引与维护约定

本目录为 unimap-condor 的**结构化测试用例文档**（人读、指导手工验收与自动化补齐）。
可执行自动化脚本位于 `tests/` 根目录（`*.test.ts` / `*.test.mjs`），通过 `package.json` 的 `test:*` 命令运行。

## 文档索引

| 文档 | 覆盖范围 | 用例数 |
| --- | --- | --- |
| [TC-P0-core.md](./TC-P0-core.md) | 本轮 7 个 P0 功能（LEO-181~187）验收 | 38 |
| [TC-existing.md](./TC-existing.md) | 存量核心功能（偏好/收藏状态流转/决策卡/推荐/Compare/地图） | 25 |
| [TC-P1-planned.md](./TC-P1-planned.md) | LEO-188~193 六个新任务的预写验收基准（待开发） | 20 |
| **合计** | | **83** |

## 用例统计

- **总用例数**：83
- **按文档**：P0 核心 38 / 存量 25 / P1 预写 20
- **按类型**：自动化 19（含 P1 待实现的规划自动化）/ 手动 64，自动化占比约 23%
- **当前已落地自动化脚本**：3 套 —
  - `test:recommendations`（推荐排序，`recommendationPolicy.test.ts`，4 场景）
  - `test:local-rankings`（QS 2027 本地数据，`localRankings.test.mjs`）
  - `test:ranking-sources`（排名来源合规，`rankingSources.test.ts`，LEO-187 新增）
- P1 文档内标注为"自动化"的用例属**规划自动化**，随 LEO-193 迁移 Vitest 后逐步实现。

## 运行自动化测试

```bash
npm run test:recommendations   # 推荐排序策略
npm run test:local-rankings    # QS 2027 本地排名数据
npm run test:ranking-sources   # 排名来源官方链接 + 合规标注（LEO-187）
npm test                       # 顺序跑上述三套
npm run lint                   # ESLint（0 error 要求）
```

CI（`.github/workflows/ci.yml`）在 push/PR 时执行：Lint → Build → 三套测试 → 密钥扫描。

## 用例字段约定

每条用例包含固定字段：

- **ID**：`TC-<模块>-<序号>`（P0 用 `TC-<issue号>-NN`，存量用 `TC-EX-<域>-NN`，P1 用 `TC-<issue号>-NN`）。
- **前置条件**：执行前需要的数据/环境状态。
- **步骤**：可复现的操作序列。
- **期望结果**：可判定的通过/失败标准。
- **优先级**：P0（阻断发布）/ P1（重要）/ P2（次要）。
- **类型**：自动化 / 手动。
- **关联 issue**：LEO-xxx 或 `existing`；未开发的标「待开发」。

## 维护约定

1. **新功能先补用例**：新拆解任务（issue）在开发前，先在对应文档补齐验收用例作为基准。
2. **能自动化就自动化**：纯逻辑模块（无 React 耦合）优先写可执行测试，加入 `package.json` 的 `test:*` 与 CI；与 App.tsx/组件耦合、无法独立导入的逻辑（如 `northAmericaCsTemplate`、`buildShortlistHtml`）暂标「手动」，**不为测试而重构 App.tsx**（重构见 LEO-192，测试框架见 LEO-193）。
3. **P1 用例随开发提升**：LEO-188~193 完成后，把 TC-P1-planned.md 中相应用例的「待开发」去除，回填真实断言，并将可自动化项迁入 Vitest。
4. **回归基线**：每次发布前，至少手工/自动跑一遍 TC-P0-core 与 TC-existing 中 P0 级用例。
5. **框架迁移**：本目录当前不引入新测试框架；Vitest 迁移统一在 LEO-193 完成，届时手工 tsc 脚本将被替换。
