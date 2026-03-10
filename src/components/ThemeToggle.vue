<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore, type ThemeName } from '../stores/theme'

const themeStore = useThemeStore()

const theme = computed(() => themeStore.theme)

const setTheme = (value: ThemeName) => themeStore.setTheme(value)
</script>

<template>
  <div class="theme-toggle" role="group" aria-label="Theme">
    <button class="theme-pill" :class="{ active: theme === 'cool' }" @click="setTheme('cool')">冷白</button>
    <button class="theme-pill" :class="{ active: theme === 'warm' }" @click="setTheme('warm')">暖色</button>
    <button class="theme-pill" :class="{ active: theme === 'dark' }" @click="setTheme('dark')">夜读</button>
  </div>
</template>
