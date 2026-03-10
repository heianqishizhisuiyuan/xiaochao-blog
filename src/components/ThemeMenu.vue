<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useThemeStore } from '../stores/theme'
import { Brush, Moon, Sunny } from '@element-plus/icons-vue'

type Option = {
  key: 'cool' | 'warm' | 'dark'
  label: string
  icon: any
}

const options: Option[] = [
  { key: 'cool', label: '冷白', icon: Brush },
  { key: 'warm', label: '暖色', icon: Sunny },
  { key: 'dark', label: '夜读', icon: Moon }
]

const store = useThemeStore()

const open = ref(false)
const current = computed(() => options.find((o) => o.key === store.theme) ?? options[0]!)

const toggle = () => {
  open.value = !open.value
}

const close = () => {
  open.value = false
}

const pick = (key: Option['key']) => {
  store.setTheme(key)
  close()
}

const onDocClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('.theme-menu')) return
  close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <div class="theme-menu">
    <button class="theme-menu-btn" type="button" @click.stop="toggle" aria-label="主题">
      <el-icon><component :is="current.icon" /></el-icon>
      <span class="theme-menu-label">{{ current.label }}</span>
    </button>

    <div v-if="open" class="theme-menu-pop">
      <button
        v-for="opt in options"
        :key="opt.key"
        class="theme-menu-item"
        type="button"
        @click="pick(opt.key)"
      >
        <el-icon><component :is="opt.icon" /></el-icon>
        <span>{{ opt.label }}</span>
        <span v-if="opt.key === store.theme" class="theme-menu-check">当前</span>
      </button>
    </div>
  </div>
</template>
