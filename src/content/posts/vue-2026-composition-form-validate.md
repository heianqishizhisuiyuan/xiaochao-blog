---
title: Vue 3中Composition API在表单验证场景的进阶应用
summary: 从最小可用到可维护：如何在真实业务里组织校验规则、异步校验与可复用的表单逻辑。
category: Vue相关
tags: Vue3,CompositionAPI,TypeScript,表单验证,ElementPlus,最佳实践
readingTime: 12
date: 2026-03-16
featured: true
---

# Vue 3中Composition API在表单验证场景的进阶应用

表单验证是 Vue 项目里最容易“越写越乱”的模块：规则分散、错误提示不一致、异步校验到处穿插、提交状态和 loading 互相打架。

这篇文章的目标很明确：**把表单验证当成一个可复用的“模块能力”来写**，而不是每个页面临时拼起来。

## 1. 场景定位：从基础到进阶

- **基础**：必填、长度、格式（同步校验）
- **中级**：联动校验、跨字段校验（例如：密码与确认密码）
- **高级**：异步校验（例如：用户名是否已存在）、节流、提交前最终校验

## 2. 推荐结构：useForm + schema + submit

我们用一个可维护结构：

- `useFormState()`：管理值、错误、dirty、提交状态
- `validators.ts`：规则函数（纯函数，可测试）
- `useSubmit()`：提交流程（校验 → 调 API → 统一错误处理）

### 2.1 定义类型与状态（TypeScript）

```ts
import { reactive, computed } from 'vue'

type LoginForm = {
  email: string
  password: string
}

type FormErrors<T> = Partial<Record<keyof T, string>>

type FormState<T> = {
  values: T
  errors: FormErrors<T>
  submitting: boolean
}

export function useFormState<T extends Record<string, any>>(initial: T) {
  const state = reactive<FormState<T>>({
    values: { ...initial },
    errors: {},
    submitting: false
  })

  const hasError = computed(() => Object.keys(state.errors).length > 0)

  return { state, hasError }
}
```

### 2.2 规则函数：保持纯净、可测试

```ts
export const required = (msg = '必填') => (v: string) => (v?.trim() ? '' : msg)
export const minLen = (n: number, msg?: string) => (v: string) => (v.length >= n ? '' : (msg ?? `至少 ${n} 个字符`))
export const email = (msg = '邮箱格式不正确') => (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? '' : msg)
```

### 2.3 统一运行校验

```ts
type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

export function runValidate<T>(values: T, validator: Validator<T>) {
  const errors = validator(values)
  return {
    ok: Object.values(errors).every((e) => !e),
    errors
  }
}
```

## 3. 插件推荐：别重复造轮子

- **Pinia**：把跨页面的表单草稿保存起来（比如多步表单）
- **Vue Router**：离开页面前提示“有未保存变更”
- **Vitest**：对 validator 做单测（纯函数很好测）

示例：Vitest 测 validator：

```ts
import { describe, it, expect } from 'vitest'
import { required } from './validators'

describe('required', () => {
  it('should return error on empty', () => {
    expect(required()('')).toBe('必填')
  })
})
```

## 4. 最佳实践：性能与坑

- 不要每次输入都跑全量校验：对单字段做局部校验
- 异步校验要做“最后一次生效”控制（避免请求乱序覆盖）
- 错误展示要统一：组件层只关心 `errorMessage`，不要分散字符串

## 结论

Composition API 的优势是：你可以把“表单验证”真正抽成模块，并且保持类型安全。

下一步建议：把你项目里最复杂的一个表单抽出来做示范，然后逐步迁移其它页面，收益会非常明显。
