<script setup lang="ts">
import { useRoute } from 'vue-router'
import ReadingProgressBar from './components/ReadingProgressBar.vue'
import BackToTop from './components/BackToTop.vue'
import ThemeSwitchFloat from './components/ThemeSwitchFloat.vue'

const route = useRoute()
</script>

<template>
  <ReadingProgressBar />
  <ThemeSwitchFloat v-if="route.path === '/'" />
  <router-view />
  <BackToTop />
</template>
