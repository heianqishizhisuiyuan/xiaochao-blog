<script setup lang="ts">
import { siteMeta } from '../data/content'
</script>

<template>
  <header class="topbar glass-panel editorial-topbar">
    <RouterLink to="/" class="brand editorial-brand">
      <div class="brand-mark">超</div>
      <div>
        <div class="brand-title">{{ siteMeta.name }}</div>
        <div class="brand-sub">{{ siteMeta.tagline }}</div>
      </div>
    </RouterLink>
    <nav class="nav-links editorial-nav-links">
      <RouterLink to="/">首页</RouterLink>
      <RouterLink to="/posts">文章</RouterLink>
      <RouterLink to="/notes">随记</RouterLink>
      <RouterLink to="/archive">归档</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
    </nav>
  </header>
</template>
