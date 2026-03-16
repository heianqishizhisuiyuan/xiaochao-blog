---
title: Vue 3请求管理别再手写：用@vueuse/core的useFetch做出“可维护”的数据层
summary: useFetch 不只是发请求。本文从场景出发，讲清它的响应式模型、取消请求、错误处理、缓存与与 Pinia/Router 的组合方式，并附可运行的 TypeScript 示例与参考来源。
category: Vue相关
tags: Vue3,TypeScript,VueUse,useFetch,请求管理,Pinia,最佳实践
readingTime: 15
date: 2026-03-17
featured: true
---

# Vue 3请求管理别再手写：用@vueuse/core的useFetch做出“可维护”的数据层

在很多 Vue 项目里，“发请求”往往被写成：
- 组件里 `onMounted -> fetch -> setState`
- 失败了 `ElMessage.error`
- 再加个 loading

短期能跑，长期一定会变成：
- loading 到处散
- 取消请求没人管（切路由还在更新状态）
- 错误处理不统一
- 缓存/重试/并发全部靠手写

本文用一个非常常见的真实场景来讲：**文章列表页**（分页、搜索、切换路由时取消请求、错误统一处理）。

---

## 1) useFetch 的核心价值是什么（原理层）

`@vueuse/core` 的 `useFetch` 不是“更短的 fetch”，而是把请求包装成：
- 响应式状态（data/error/isFetching）
- 组合式 API（可在 composable 中复用）
- 支持 abort（取消请求）

它更像“请求状态机”，而不是一次性 Promise。

---

## 2) 一个可运行的 TypeScript 示例：文章列表（带取消/错误/分页）

### 2.1 定义类型

```ts
type Post = {
  slug: string
  title: string
  summary: string
  date: string
  readingTime: string
}

type PageResult<T> = {
  items: T[]
  total: number
}
```

### 2.2 写一个 composable：usePostList

```ts
import { computed, ref, watchEffect } from 'vue'
import { useFetch } from '@vueuse/core'

export function usePostList() {
  const page = ref(1)
  const pageSize = ref(10)
  const q = ref('')

  const url = computed(() => {
    const params = new URLSearchParams({
      page: String(page.value),
      pageSize: String(pageSize.value),
      q: q.value
    })
    return `/api/posts?${params.toString()}`
  })

  const {
    data,
    error,
    isFetching,
    abort,
    execute
  } = useFetch(url, { immediate: false })
    .get()
    .json<PageResult<Post>>()

  // 当参数变化时：取消旧请求并发起新请求（避免乱序覆盖）
  watchEffect(() => {
    abort()
    execute()
  })

  const items = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)

  return {
    page,
    pageSize,
    q,
    items,
    total,
    isFetching,
    error
  }
}
```

这段代码的关键点：
- `url` 是 computed：参数变化自动变化
- `watchEffect` 里先 `abort()`：保证不会被旧请求回写
- `immediate:false`：你能精确控制什么时候执行

---

## 3) 常见坑与排查

1) **重复请求太多**
- watchEffect 会在依赖变化时触发
- 解决：对 `q` 做防抖（debounce）

2) **切换路由仍在更新状态**
- 如果 composable 仍在作用域里，旧请求可能回写
- 解决：在组件卸载时 abort（VueUse 通常会自动清理，但你要确认作用域）

3) **错误提示散落**
- 解决：把 error 统一交给一个错误处理器（比如 toast + 日志）

---

## 4) 插件/生态组合建议

- Pinia：把 list 状态（page/q）提升到 store（跨页面记住筛选）
- Vue Router：把 page/q 写到 query（可分享链接）
- Vitest：对“URL 生成/参数变化逻辑”做单测（纯函数部分最好测）

---

## 结论

请求管理如果只靠组件里手写，迟早会乱。
把它抽成 composable，并用 `useFetch` 这种“状态化请求”，能显著提升一致性与可维护性。

---

## 参考来源
- [VueUse 官方文档（@vueuse/core）](https://vueuse.org/)
- [useFetch 文档](https://vueuse.org/core/useFetch/)
