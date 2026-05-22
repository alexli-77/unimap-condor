# UniMap Condor

UniMap Condor 是一个交互式大学情报地图。它把大学排名地图、开放研究数据、机构注册信息和社区搜索入口放在同一个界面里，帮助用户更快地比较学校。

项目名来自 condor（神鹰/秃鹰）：一种体型很大、能长距离飞行、视野很广的动物。

## 功能

- 基于 MapLibre 的交互地图，使用 OpenFreeMap 底图。
- 按排名来源、年份、专业筛选。
- Subject Strength 模式，用于查看标准化后的学科强项信号。
- 搜索大学、点击地图点位、查看右侧详情。
- 大学详情分为四个 tab：
  - Overview：城市、国家、建校年份、别名、ROR/Wikidata/Wikipedia 链接。
  - Rankings：排名、专业、来源说明、学科强项条形图。
  - Research：OpenAlex 的论文量、引用量、h-index、近期引用表现、研究主题。
  - Community：Reddit 和寄托天下/GTER 的真实搜索入口。
- 不依赖 Google Places API。Google Maps 只作为用户主动点击的外部跳转入口。

## 数据来源

当前排名数据来自目标演示站点公开暴露的 API，包含：

- QS World University Rankings
- Times Higher Education
- ShanghaiRanking
- CSRankings

开放数据增强来自：

- [OpenFreeMap](https://openfreemap.org/)：地图样式。
- [OpenStreetMap](https://www.openstreetmap.org/copyright)：地图数据。
- [OpenAlex](https://openalex.org/)：研究影响力指标。
- [ROR](https://ror.org/)：研究机构注册信息。
- Wikidata/Wikipedia：通过 OpenAlex/ROR 获取的外链。

排名数据权利属于原始数据提供方。公开上线或商业使用前，请确认对应数据源的授权和条款。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:5173/
```

构建：

```bash
npm run build
```

## 开发说明

Vite 开发服务器使用代理避免浏览器 CORS 问题：

- `/api` -> `https://disc-unimap.uibk.ac.at`
- `/openalex` -> `https://api.openalex.org`
- `/ror` -> `https://api.ror.org`

生产环境建议把这些代理迁移到自己的后端或边缘函数，不要把复杂的第三方 API 调用全部放在浏览器里。

## 社区入口说明

Community tab 不抓取 Reddit 或寄托/GTER 正文内容，只提供真实的外部搜索链接。这样可以保持浏览速度，也避免未经许可复制社区文本。

## 安全要求

禁止提交：

- 个人信息
- API key
- token
- 密码
- `.env` 文件
- 私有数据导出
- 未确认授权的第三方原始数据集

完整规则见 [SECURITY.md](./SECURITY.md)。

## License

MIT。见 [LICENSE](./LICENSE)。
