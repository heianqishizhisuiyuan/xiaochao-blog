<script setup lang="ts">
import { siteMeta } from '../data/content'
import ThemeMenu from './ThemeMenu.vue'
import MobileNavDrawer from './MobileNavDrawer.vue'
import MobileThemeDrawer from './MobileThemeDrawer.vue'
import MobileFiltersDrawer from './MobileFiltersDrawer.vue'
import { ref } from 'vue'
import { House, Document, Notebook, Calendar, User, Menu, Filter, Brush } from '@element-plus/icons-vue'

const navOpen = ref(false)
const themeOpen = ref(false)
const filtersOpen = ref(false)
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
      <!-- Desktop nav -->
      <nav class="nav-links editorial-nav-links desktop-only">
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

      <!-- Mobile actions -->
      <div class="mobile-only mobile-top-actions">
        <button class="icon-action" type="button" @click="filtersOpen = true" aria-label="筛选与归档">
          <el-icon><Filter /></el-icon>
        </button>
        <button class="icon-action" type="button" @click="themeOpen = true" aria-label="主题">
          <el-icon><Brush /></el-icon>
        </button>
        <button class="icon-action" type="button" @click="navOpen = true" aria-label="导航">
          <el-icon><Menu /></el-icon>
        </button>
      </div>

      <!-- Desktop theme -->
      <div class="desktop-only"><ThemeMenu /></div>
    </div>

    <!-- Mobile drawers -->
    <MobileNavDrawer v-model="navOpen" />
    <MobileThemeDrawer v-model="themeOpen" />
    <MobileFiltersDrawer v-model="filtersOpen" />
  </header>
</template>
