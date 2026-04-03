# Travel Planner（纯前端 PWA）

这是一个“纯前端 + 离线可用”的旅行规划站点模板。核心渲染与交互在前端代码中实现；具体旅行内容以 **TypeScript 配置**形式加入，新增旅行通常只需要“新增配置文件 + 登记到 registry”，重新部署即可。

## 1) 部署到 GitHub Pages

1. 把本目录（或你选定用于 Pages 的目录）推送到 GitHub 仓库的 `main` 分支。
2. 打开 GitHub：`Settings -> Pages`
3. `Source` 选择 `Deploy from a branch`
4. `Branch` 选择 `main`
5. `Folder` 选择 `/ (root)`
6. 等待几分钟获取地址：`https://你的用户名.github.io/仓库名/`

> 项目使用 hash 路由，避免 GitHub Pages 刷新 404 问题。

## 2) 本地开发与构建

```bash
cd travel-planner
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建产物位于 `dist/`。

## 3) 离线缓存（PWA / Service Worker）

- `public/sw.js`：核心离线策略。
- `src/main.tsx`：注册 Service Worker。

策略简述：

- `install` 阶段预缓存壳资源（`index.html`、`manifest.webmanifest`、图标等）
- `fetch` 阶段对同源 `GET` 采用 cache-first；第一次联网访问后会逐步缓存 JS/CSS/图片等资源，之后可离线打开已访问过的旅行页面

更新缓存：

- 修改 `public/sw.js` 里的 `CACHE_VERSION`
- 重新 `npm run build` 并重新部署（GitHub Pages 会拉取新的静态资源）

## 4) 新增旅行（重新部署，不做用户导入）

本阶段“旅行内容”完全由 TypeScript 配置驱动，不提供用户导入功能。

相关文件：

- `src/schema/trip.ts`：`TripConfig / TripDay / TripSection` 类型契约
- `src/trips/<tripId>.ts`：单旅行配置（数据）
- `src/trips/registry.ts`：旅行注册表（把新 trip 加入列表与映射）

新增步骤：

1. 复制 `src/trips/demo.ts` 新建 `src/trips/<tripId>.ts`
2. 编辑 `id / title / days / sections`
3. 在 `src/trips/registry.ts`：
   - 导入新 trip
   - 加入 `trips`（列表展示）
   - 加入 `tripConfigsById`（详情页渲染）
4. 重新构建并部署：`npm run build` -> 推送到 GitHub Pages

## 5) 本地数据

- section 备注：`localStorage` key `travel_planner_state_v1`
- 跳转关键词：`localStorage` key `travel_planner_keywords_v1`

可在 `#/my` 页面执行“清除本地备注数据”。
