<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type ThemeName } from '../stores/theme'

const themeStore = useThemeStore()

const theme = computed(() => themeStore.theme)

const setTheme = (value: ThemeName) => themeStore.setTheme(value)
</script>

<template>
  <div class="theme-switch" role="group" aria-label="主题">
    <button class="theme-seg" :class="{ active: theme === 'cool' }" @click="setTheme('cool')">冷白</button>
    <button class="theme-seg" :class="{ active: theme === 'warm' }" @click="setTheme('warm')">暖色</button>
    <button class="theme-seg" :class="{ active: theme === 'dark' }" @click="setTheme('dark')">夜读</button>
    <span class="theme-indicator" :data-theme="theme" aria-hidden="true"></span>
  </div>
</template>
