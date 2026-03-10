<script setup lang="ts">
import { computed } from 'vue'
import { useReadingProgress } from '../composables/useReadingProgress'

const { progress } = useReadingProgress()
const width = computed(() => `${Math.round(progress.value * 100)}%`)
</script>

<template>
  <div class="reading-progress" aria-hidden="true">
    <div class="reading-progress-bar" :style="{ width }"></div>
  </div>
</template>
