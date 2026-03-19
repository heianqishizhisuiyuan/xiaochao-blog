---
title: "Vue 3 路由懒加载与预取：首屏更快、切页更顺的一套实战写法"
summary: "用 Vue Router 的动态导入做路由级代码分割，再加上简单的预取策略与 Vitest 单测，避免首屏变慢、切页卡顿和 chunk 乱飞。"
category: "Vue"
tags: ["Vue3","TypeScript","VueRouter","懒加载","代码分割","性能优化"]
readingTime: "9分钟"
date: "2026-03-19"
featured: false
---

## 场景与目标
你可能正处在下面一种状态：

- 页面越来越多，首屏 JS 体积越来越大
- 用户进入首页要等很久，但很多页面其实一开始根本用不到
- 切换到某些页面会“白一下”，体验不连贯

目标很明确：

- 首屏尽量小（路由级拆包）
- 切页尽量顺（对“即将访问”的路由做预取）
- 写法可维护（路由表清晰、chunk 命名可控）
- 可测试（至少能验证：路由组件确实是懒加载函数）

## 原理解释
路由懒加载的关键在于“动态导入”（`import()`）：

- 静态导入：打包时会把组件打进主包或较早加载的 chunk
- 动态导入：会生成独立 chunk，只有在第一次访问该路由时才会加载

Vue Router 原生支持把 `component` 写成一个返回 Promise 的函数，也就是：

- `component: () => import('...')`

这样构建工具（例如 Vite）就能做自动代码分割。

预取（prefetch）则是更进一步：

- 懒加载解决“首屏太大”
- 预取解决“切页要等”

你可以在用户“很可能要去”的时候提前把 chunk 拉下来：例如鼠标 hover 到菜单项、列表项进入视口、或登录后提前预取常用页面。

## 可编译的 TypeScript + Vue 3 代码示例
注意：本站不使用围栏代码块，下面用缩进代码，直接复制到项目里可编译。

### 1) 路由表：路由级懒加载 + chunk 命名
    // src/router/index.ts
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

    const HomePage = () => import('../views/HomePage.vue')

    // 通过 @vite-ignore 不是必须，这里不使用，保持可分析的静态路径
    const NotesPage = () => import('../views/NotesPage.vue')
    const AboutPage = () => import('../views/AboutPage.vue')

    const routes: RouteRecordRaw[] = [
      { path: '/', name: 'home', component: HomePage },
      { path: '/notes', name: 'notes', component: NotesPage },
      { path: '/about', name: 'about', component: AboutPage },
    ]

    export const router = createRouter({
      history: createWebHistory(),
      routes,
      scrollBehavior: () => ({ top: 0 }),
    })

    export default router

如果你希望更细地控制 chunk 分组，可以在 Vite 侧用 `manualChunks` 做打包策略（原理见官方文档），但第一步建议先“路由全懒加载”，收益最大。

### 2) 一个轻量预取工具：在 hover 或可见时预取
核心思路：把上面的懒加载函数（返回 `import()` 的函数）再“手动执行一次”，浏览器就会把对应 chunk 下载并缓存。

    // src/router/prefetch.ts
    type LazyImport<T = unknown> = () => Promise<T>

    export function prefetch(lazy: LazyImport): void {
      // 预取是“尽力而为”：失败不影响主流程
      void lazy().catch(() => {})
    }

配合菜单项 hover：

    // 在某个组件中
    import { prefetch } from '@/router/prefetch'

    const goNotes = () => router.push({ name: 'notes' })
    const prefetchNotes = () => prefetch(() => import('../views/NotesPage.vue'))

    // 模板（示意）：@mouseenter 时触发预取
    // <button @mouseenter="prefetchNotes" @click="goNotes">笔记</button>

更工程化的做法是：把路由懒加载函数导出成常量，避免在多个地方写重复 import 路径。

### 3) Vitest 思路：验证“确实是懒加载函数”
你的项目目前未安装 Vitest。下面代码是“可编译的示例写法”，当你未来加上 Vitest 后可直接用。

    // tests/router.lazyload.test.ts
    import { describe, it, expect } from 'vitest'
    import { router } from '@/router'

    describe('router lazy loading', () => {
      it('routes use lazy component functions', () => {
        const r = router.getRoutes()
        const notes = r.find(x => x.name === 'notes')
        expect(notes).toBeTruthy()
        // @ts-expect-error 这里我们只做运行时断言
        expect(typeof notes!.components?.default || typeof (notes as any)!.component).toBe('function')
      })
    })

如果你不想在单元测试里依赖真实 router，也可以用 Vue Test Utils 的“mock router”思路，把重点放在业务逻辑而不是路由本身。

## 最佳实践
- 路由组件尽量都用懒加载：默认策略就是“全部懒加载”，再按需要预取
- 预取要“克制”：
  - 只预取高概率页面（比如 hover 菜单项）
  - 只预取一次（可以用 Map 记忆）
- 为重要路由准备 loading 态：首访某路由时，即使预取，也可能遇到网络波动
- 保持 import 路径稳定：
  - 避免运行时拼字符串路径
  - 否则构建工具可能无法做正确的拆包

## 常见坑排查
- 首屏反而变慢
  - 你可能在入口处仍然静态导入了大组件或大依赖
  - 检查是否有“全局注册的大组件库/图标库”导致主包膨胀

- 切页会闪白
  - 没有 skeleton/loading
  - 或 chunk 太大：说明该页面引用了重依赖（比如图表库），需要进一步拆分

- chunk 太碎、请求太多
  - 路由多但每个页面很小：可以考虑把相关页面分到同一 chunk（Vite manualChunks）

- 预取导致流量浪费
  - 移动端尤其明显：预取要放在用户明确意图（hover/触发前）而不是“进入首页就全预取”

## 插件推荐与集成要点
- Pinia
  - 用 store 管理“是否已预取”的状态：避免同一页面反复预取
  - 如果 store 很大，也建议按模块懒加载 store（不必一次性初始化所有 store）

- Vue Router
  - 路由级懒加载的官方写法就是 `component: () => import('...')`
  - 可以在全局守卫里做“按条件预取”（比如登录后预取后台页面）

- Vitest（未来建议）
  - 适合做“路由表约束测试”：例如强制所有路由都使用懒加载函数
  - 同时配合 Vue Test Utils，可以测试“点击某按钮后 router.push 被调用”这类逻辑

## 参考来源
- [Lazy Loading Routes（Vue Router 官方文档）](https://router.vuejs.org/guide/advanced/lazy-loading.html)
- [Vue Router（官方站点）](https://router.vuejs.org/)
- [Pinia（官方站点）](https://pinia.vuejs.org/)
- [Getting Started（Vitest 官方文档）](https://vitest.dev/guide/)
- [Testing Vue Router（Vue Test Utils）](https://test-utils.vuejs.org/guide/advanced/vue-router)
