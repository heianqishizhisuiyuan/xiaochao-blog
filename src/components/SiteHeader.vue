<script setup lang="ts">
import { siteMeta } from '../data/content'
import ThemeToggle from './ThemeToggle.vue'
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

    <div class="topbar-right">
      <nav class="nav-links editorial-nav-links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/posts">文章</RouterLink>
        <RouterLink to="/notes">随记</RouterLink>
        <RouterLink to="/archive">归档</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>
