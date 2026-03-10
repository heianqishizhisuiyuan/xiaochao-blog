<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MobileDrawer from './MobileDrawer.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const route = useRoute()

const open = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (open.value = v)
)
watch(open, (v) => emit('update:modelValue', v))

watch(
  () => route.fullPath,
  () => {
    // auto close on navigation
    open.value = false
  }
)
</script>

<template>
  <MobileDrawer v-model="open" title="导航">
    <nav class="mobile-nav">
      <RouterLink to="/" class="mobile-nav-item">首页</RouterLink>
      <RouterLink to="/posts" class="mobile-nav-item">文章</RouterLink>
      <RouterLink to="/notes" class="mobile-nav-item">随记</RouterLink>
      <RouterLink to="/archive" class="mobile-nav-item">归档</RouterLink>
      <RouterLink to="/about" class="mobile-nav-item">关于</RouterLink>
    </nav>
  </MobileDrawer>
</template>
