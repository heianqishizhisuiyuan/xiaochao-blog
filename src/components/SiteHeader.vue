<script setup lang="ts">
import { siteMeta } from '../data/content'
import { House, Document, Notebook, Calendar, User } from '@element-plus/icons-vue'
</script>

<template>
  <header class="topbar glass-panel editorial-topbar">
    <RouterLink to="/" class="brand editorial-brand">
      <div class="brand-mark">超</div>
      <div>
        <div class="brand-title">{{ siteMeta.name }}</div>
      </div>
    </RouterLink>

    <div class="topbar-right">
      <nav class="nav-links editorial-nav-links">
        <RouterLink to="/" class="nav-item">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </RouterLink>
        <RouterLink to="/posts" class="nav-item">
          <el-icon><Document /></el-icon>
          <span>文章</span>
        </RouterLink>
        <RouterLink to="/notes" class="nav-item">
          <el-icon><Notebook /></el-icon>
          <span>随记</span>
        </RouterLink>
        <RouterLink to="/archive" class="nav-item">
          <el-icon><Calendar /></el-icon>
          <span>归档</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-item">
          <el-icon><User /></el-icon>
          <span>关于</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
