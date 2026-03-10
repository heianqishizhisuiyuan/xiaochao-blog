<script setup lang="ts">
import { ref, watch } from 'vue'
import MobileDrawer from './MobileDrawer.vue'
import { useThemeStore, type ThemeName } from '../stores/theme'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const themeStore = useThemeStore()

const open = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (open.value = v)
)
watch(open, (v) => emit('update:modelValue', v))

const pick = (t: ThemeName) => {
  themeStore.setTheme(t)
  open.value = false
}
</script>

<template>
  <MobileDrawer v-model="open" title="主题">
    <div class="mobile-theme-grid">
      <button class="mobile-theme-item" :class="{ active: themeStore.theme === 'cool' }" @click="pick('cool')">
        冷白
      </button>
      <button class="mobile-theme-item" :class="{ active: themeStore.theme === 'warm' }" @click="pick('warm')">
        暖色
      </button>
      <button class="mobile-theme-item" :class="{ active: themeStore.theme === 'dark' }" @click="pick('dark')">
        夜读
      </button>
    </div>
  </MobileDrawer>
</template>
