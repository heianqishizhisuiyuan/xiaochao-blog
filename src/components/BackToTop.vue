<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 600
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const show = computed(() => visible.value)

const goTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <button v-if="show" class="back-to-top" type="button" @click="goTop" aria-label="返回顶部">
    <el-icon><ArrowUp /></el-icon>
  </button>
</template>
