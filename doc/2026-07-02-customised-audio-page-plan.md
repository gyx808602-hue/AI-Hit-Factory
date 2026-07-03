# 2026-07-02 音色管理页面实施计划

## 目标

- 新增独立音色管理页面。
- 新增音色管理路由，并接入动态菜单映射。
- 新建与编辑都采用弹窗形式。
- 不修改现有 `customised-audios` 请求地址与请求前缀规则。
- 不影响当前其他业务路由。

## 实施范围

### 1. 页面层

- 新增 `src/pages/CustomisedAudiosPage.tsx`
- 参考现有 `DigitalHumansPage.tsx` 的列表页结构：
  - 页面标题与描述
  - 搜索与状态筛选
  - 列表卡片
  - 分页
  - 新建弹窗
  - 编辑弹窗
  - 刷新、删除操作

### 2. 数据层

- 扩展 `src/features/digital-human/audio/hooks.ts`
- 在现有分页查询基础上新增：
  - 详情查询 hook
  - 创建 mutation
  - 删除 mutation
  - 刷新 mutation
- 继续复用 `src/api/aigc/customised-audios/index.ts` 现有接口，不改路径。

### 3. 路由层

- 修改 `src/app/router/routeTypes.ts`
- 修改 `src/app/router/routeRegistry.tsx`
- 修改 `src/app/router/dynamicRoutes.ts`
- 新增新的音色管理路由 key 与动态组件映射。

### 4. 测试层

- 页面测试：
  - 列表渲染
  - 搜索参数传递
  - 新建弹窗打开与提交
  - 编辑弹窗打开与回填
  - 刷新与删除按钮行为
- 路由测试：
  - 新路由注册正确
  - 动态组件映射正确
- hooks 测试：
  - query key
  - 详情查询
  - 创建后失效列表
  - 刷新后更新缓存

## 风险说明

- 当前未发现更新音色接口，因此本次重点保证“编辑弹窗形态、回填与入口”落地。
- 若后续补充更新接口，可直接在现有编辑弹窗基础上接入 mutation，无需重做页面结构。

## 验证命令

- `npm test -- src/pages/CustomisedAudiosPage.test.tsx`
- `npm test -- src/features/digital-human/audio/hooks.test.ts`
- `npm test -- src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
- `npm run typecheck`
