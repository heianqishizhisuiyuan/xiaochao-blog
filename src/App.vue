<script setup lang="ts">
import ReadingProgressBar from './components/ReadingProgressBar.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<template>
  <ReadingProgressBar />
  <router-view />
  <BackToTop />
</template>
