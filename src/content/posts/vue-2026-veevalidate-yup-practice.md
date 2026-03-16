---
title: Vue 3表单验证最佳实践：VeeValidate + Yup（Composition API 可复用方案）
summary: 用 VeeValidate + Yup 做表单验证，如何写得可复用、可维护、可排错？本文给出一套工程化结构与可运行的 TypeScript 示例，并附参考来源。
category: Vue相关
tags: Vue3,TypeScript,CompositionAPI,表单验证,VeeValidate,Yup,最佳实践
readingTime: 16
date: 2026-03-17
featured: true
---

# Vue 3表单验证最佳实践：VeeValidate + Yup（Composition API 可复用方案）

表单验证是 Vue 项目里最容易“越写越散”的地方：
- 规则散落在组件里
- 异步校验到处穿插
- 错误提示不统一
- 提交流程缺少可观测性（失败了不知道为什么）

这篇文章给你一套**可复用、可维护、可排错**的表单验证结构：基于 Vue 3 Composition API，使用 VeeValidate + Yup（schema 校验）。

---

## 1) 选择 VeeValidate + Yup 的理由（原理层）

- VeeValidate 负责：
  - 表单状态管理（values / errors / touched / meta）
  - 字段级校验触发（blur/submit/输入）
  - 与组件输入绑定

- Yup 负责：
  - 把规则写成 schema（集中、可读）
  - 支持组合与条件校验（when）
  - 更容易做单元测试

你最终得到的是：
- 规则在一个地方（schema）
- 状态由库管理（form state）
- 组件只负责展示（UI）

---

## 2) 工程化目录建议（从小到大可扩展）

推荐把表单按“领域”拆：

```
src/
  forms/
    login/
      schema.ts
      useLoginForm.ts
      LoginForm.vue
```

- `schema.ts`：只放 Yup schema（纯规则）
- `useLoginForm.ts`：只放表单行为（提交、loading、错误映射）
- `LoginForm.vue`：只放 UI

---

## 3) 可运行示例：登录表单（TypeScript + Composition API）

### 3.1 schema.ts

```ts
// src/forms/login/schema.ts
import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('请输入邮箱')
    .email('邮箱格式不正确'),
  password: yup
    .string()
    .required('请输入密码')
    .min(8, '密码至少 8 位')
})

export type LoginValues = yup.InferType<typeof loginSchema>
```

### 3.2 useLoginForm.ts

```ts
// src/forms/login/useLoginForm.ts
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { loginSchema, type LoginValues } from './schema'

async function fakeLoginApi(values: LoginValues) {
  // 用你真实的 API 替换这里
  await new Promise((r) => setTimeout(r, 500))
  if (values.email === 'blocked@example.com') {
    throw new Error('该账号已被禁用')
  }
}

export function useLoginForm() {
  const { handleSubmit, errors, meta, defineField, setFieldError, isSubmitting } = useForm<LoginValues>({
    validationSchema: toTypedSchema(loginSchema),
    initialValues: {
      email: '',
      password: ''
    }
  })

  const [email, emailAttrs] = defineField('email')
  const [password, passwordAttrs] = defineField('password')

  const onSubmit = handleSubmit(async (values) => {
    try {
      await fakeLoginApi(values)
    } catch (e: any) {
      // 统一把“服务端错误”落到表单错误里
      setFieldError('email', e?.message ?? '登录失败')
    }
  })

  return {
    email,
    emailAttrs,
    password,
    passwordAttrs,
    errors,
    meta,
    isSubmitting,
    onSubmit
  }
}
```

### 3.3 LoginForm.vue

```vue
<script setup lang="ts">
import { useLoginForm } from './useLoginForm'

const {
  email,
  emailAttrs,
  password,
  passwordAttrs,
  errors,
  isSubmitting,
  onSubmit
} = useLoginForm()
</script>

<template>
  <form class="glass-panel" @submit.prevent="onSubmit">
    <label>
      <div>邮箱</div>
      <input v-model="email" v-bind="emailAttrs" placeholder="name@example.com" />
      <div class="form-error" v-if="errors.email">{{ errors.email }}</div>
    </label>

    <label>
      <div>密码</div>
      <input v-model="password" v-bind="passwordAttrs" type="password" />
      <div class="form-error" v-if="errors.password">{{ errors.password }}</div>
    </label>

    <button class="primary" type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? '提交中…' : '登录' }}
    </button>
  </form>
</template>
```

---

## 4) 常见坑与排查（比写代码更重要）

1) **错误提示不出现**
- 看 `errors` 是否有值
- 看 input 是否正确 `v-model` 到 `defineField` 返回的 ref

2) **提交按钮一直 disabled**
- 使用 `isSubmitting` 时要确保 submit handler 没有挂起
- API 异常要 catch，否则 Promise 链中断

3) **异步校验乱序**
- 用户快速输入时，旧请求返回覆盖新请求
- 解决：做 requestId / abort（可用 fetch + AbortController）

---

## 5) 插件推荐与集成要点

- Pinia：表单草稿/多步表单（注意只存 values，不存 errors）
- Vue Router：离开页面前提示“未保存更改”（route leave guard）
- Vitest：对 schema 做单测（规则集中后非常好测）

---

## 结论

真正的“最佳实践”不是用哪个库，而是：
- 规则集中（schema）
- 行为集中（useXxxForm）
- UI 只负责展示

这样你在大型项目里表单越多越稳，而不是越多越乱。

---

## 参考来源
- [VeeValidate 官方文档](https://vee-validate.logaretm.com/)
- [VeeValidate + Yup（Typed schema）文档与示例（见 @vee-validate/yup）](https://vee-validate.logaretm.com/v4/guide/validation#yup)
- [Yup 官方仓库/文档](https://github.com/jquense/yup)
