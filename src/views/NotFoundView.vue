<script setup lang="ts">
import { useSeo } from '../composables/useSeo'

useSeo({
  title: '页面不存在',
  description: '你访问的页面不存在，返回首页继续浏览。',
  path: '/404'
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <main class="subpage-wrap">
      <div class="glass-panel placeholder-block not-found-box">
        <div class="section-kicker">404</div>
        <h1>页面不存在</h1>
        <p>这个页面还没造出来，或者地址输错了。</p>
        <RouterLink to="/" class="section-link">返回首页 →</RouterLink>
      </div>
    </main>
  </div>
</template>
