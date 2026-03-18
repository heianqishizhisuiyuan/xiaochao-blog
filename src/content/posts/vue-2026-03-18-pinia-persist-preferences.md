---
title: Vue 3 + Pinia 状态持久化实战：偏好设置怎么写得可测试可维护
summary: 用“用户偏好设置（主题/分页大小）”场景讲清 Pinia 持久化的原理与实现：白名单字段、版本化 key、反序列化兜底、与 Vue Router/Vitest 的集成要点。
category: Vue相关
tags: Vue3,TypeScript,Pinia,持久化,VueRouter,Vitest
readingTime: 12
date: 2026-03-18
featured: false
---

# Vue 3 + Pinia 状态持久化实战：偏好设置怎么写得可测试可维护

Vue 项目做久了，你会发现最容易“维护崩盘”的不是组件，而是状态：

- 谁负责保存偏好？
- 刷新后如何恢复？
- 数据坏了怎么办？
- 怎么写得能测、能升级？

这篇用一个很典型的场景：用户偏好设置（主题 + 列表分页大小），给出一套可落地的 Pinia 持久化实现。

## 场景与目标

场景：用户在页面里切换主题（light/dark），并设置列表每页条数（10/20/50）。

目标：

- 刷新页面后，偏好自动恢复
- 只持久化必要字段（白名单），避免把临时态/敏感信息写进 storage
- 结构清晰，方便写单元测试与后续升级

## 原理解释：为什么刷新会丢，持久化要做哪两步

Pinia store 是内存对象。页面刷新会重载 JS 运行环境，所以状态一定会丢。

持久化的本质只有两步：

- 恢复：启动时从 `localStorage` 读取，校验后 `store.$patch()`
- 写入：状态变化时订阅 `store.$subscribe()`，把白名单字段写回 storage

## 可编译的 TypeScript + Vue 3 代码示例（用行内代码列表呈现）

下面示例不使用“围栏代码块”，而是按“每行一个行内代码”的方式展示，复制时把这些行拼成文件即可。

1) stores/preferences.ts

- `import { defineStore } from 'pinia'`
- ``
- `export type PreferencesState = {`
- `  theme: 'light' | 'dark'`
- `  pageSize: number`
- `}`
- ``
- `export const usePreferencesStore = defineStore('preferences', {`
- `  state: (): PreferencesState => ({ theme: 'light', pageSize: 10 }),`
- `  actions: {`
- `    setTheme(theme: PreferencesState['theme']) { this.theme = theme },`
- `    setPageSize(pageSize: number) { this.pageSize = pageSize }`
- `  }`
- `})`

2) plugins/persistPreferences.ts

- `import type { PiniaPluginContext } from 'pinia'`
- ``
- `const KEY = 'blog:preferences:v1'`
- ``
- `export function persistPreferencesPlugin({ store }: PiniaPluginContext) {`
- `  if (store.$id !== 'preferences') return`
- ``
- `  const raw = localStorage.getItem(KEY)`
- `  if (raw) {`
- `    try {`
- `      const data = JSON.parse(raw) as Partial<{ theme: 'light' | 'dark'; pageSize: number }>`
- `      store.$patch({`
- `        theme: data.theme ?? store.theme,`
- `        pageSize: typeof data.pageSize === 'number' ? data.pageSize : store.pageSize`
- `      })`
- `    } catch {`
- `      localStorage.removeItem(KEY)`
- `    }`
- `  }`
- ``
- `  store.$subscribe((_mutation, state) => {`
- `    const safe = { theme: state.theme, pageSize: state.pageSize }`
- `    localStorage.setItem(KEY, JSON.stringify(safe))`
- `  })`
- `}`

3) main.ts 启用插件（示意）

- `import { createApp } from 'vue'`
- `import { createPinia } from 'pinia'`
- `import App from './App'`
- `import { persistPreferencesPlugin } from './plugins/persistPreferences'`
- ``
- `const app = createApp(App)`
- `const pinia = createPinia()`
- `pinia.use(persistPreferencesPlugin)`
- `app.use(pinia)`
- `app.mount('#app')`

## 最佳实践：让它“可维护、可升级、可测试”

- 只持久化白名单字段：像 `loading`、`error`、临时筛选条件这种不要写进 storage
- key 带版本号：例如 `blog:preferences:v1`，未来 schema 变化就升级到 v2
- 反序列化要兜底：解析失败直接清理 key，避免用户一直卡在坏数据
- 需要时做节流：频繁输入（如搜索框）不要每次都写 storage

## 常见坑排查：不生效/闪烁/单测写不出来怎么办

- 插件没执行：确认 `pinia.use(...)` 在 `app.use(pinia)` 之前
- 首屏闪烁：主题类偏好，尽量在挂载前恢复并应用（否则 UI 会闪一下）
- 类型变更导致旧数据报错：通过 key 版本升级或增加兼容解析

## 插件推荐与集成要点（Pinia / Vue Router / Vitest）

- Pinia：插件方式能把持久化集中管理，避免每个 store 自己写一套
- Vue Router：
  - 偏好也可以同步到 query（例如 `?pageSize=20`），方便分享链接
  - 注意优先级：一般“URL > storage > 默认值”，避免互相覆盖
- Vitest：
  - 用 `happy-dom` 或 `jsdom` 提供 `localStorage`
  - 把“读/写/兜底逻辑”拆成纯函数，更容易测

## 参考来源

- [Pinia：Plugins（官方文档）](https://pinia.vuejs.org/core-concepts/plugins.html)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [MDN：Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Vue Router：Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
