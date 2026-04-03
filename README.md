# Travel Planner（纯前端 PWA）

这是一个“纯前端 + 离线可用”的旅行规划站点模板。核心渲染与交互在前端代码中实现；具体旅行内容以 **TypeScript 配置**形式加入，新增旅行通常只需要“新增配置文件 + 登记到 registry”，重新部署即可。

## 1) 部署到 GitHub Pages

使用仓库内的 **GitHub Actions** 自动执行 `npm run build` 并把 **`dist/`** 发布到 Pages（不要再用「从分支发布仓库根目录」，否则静态资源路径不对）。

1. 将本仓库推送到 GitHub，默认分支名为 **`main`**（若用其他分支名，请同步修改 `.github/workflows/deploy-github-pages.yml` 里的 `branches`）。
2. 打开仓库：**Settings → Pages**。
3. **Build and deployment** 里 **Source** 选 **GitHub Actions**（不要选 “Deploy from a branch”）。
4. 在 **Actions** 页签确认工作流 **Deploy GitHub Pages** 已成功跑完；站点地址一般为：`https://<用户名>.github.io/<仓库名>/`。

`vite.config.ts` 中已设置 `base: './'`，适配 `*.github.io/<仓库名>/` 子路径。项目使用 **hash 路由**，刷新不会出现 History 模式的 404。

与 Netlify 使用同一套构建：`npm run build`，产物目录 `dist/`。

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
