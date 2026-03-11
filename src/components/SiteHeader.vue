<script setup lang="ts">
import { siteMeta } from '../data/content'
import ThemeSwitchFloat from './ThemeSwitchFloat.vue'
import MobileNavDrawer from './MobileNavDrawer.vue'
import MobileFiltersDrawer from './MobileFiltersDrawer.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { House, Document, Notebook, Calendar, User, Menu, Filter } from '@element-plus/icons-vue'

const navOpen = ref(false)
const filtersOpen = ref(false)

const route = useRoute()
const isHome = computed(() => route.path === '/')
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
      <!-- Desktop nav (and home mobile nav) -->
      <nav class="nav-links editorial-nav-links" :class="{ 'desktop-only': !isHome }">
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
      <ThemeSwitchFloat class="nav-theme-switch" />

      <!-- Mobile actions (not on home; home only keeps the theme switch) -->
      <div v-if="!isHome" class="mobile-only mobile-top-actions">
        <button class="icon-action" type="button" @click="filtersOpen = true" aria-label="筛选与归档">
          <el-icon><Filter /></el-icon>
        </button>
        <button class="icon-action" type="button" @click="navOpen = true" aria-label="导航">
          <el-icon><Menu /></el-icon>
        </button>
      </div>

    </div>

    <!-- Mobile drawers -->
    <MobileNavDrawer v-model="navOpen" />
    <MobileFiltersDrawer v-model="filtersOpen" />
  </header>
</template>
