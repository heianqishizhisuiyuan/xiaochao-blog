<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => emit('update:modelValue', false)

watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  },
  { immediate: true }
)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="mobile-drawer">
      <button class="mobile-drawer-backdrop" type="button" aria-label="关闭" @click="close" />
      <div class="mobile-drawer-panel" role="dialog" aria-modal="true">
        <header class="mobile-drawer-head">
          <div class="mobile-drawer-title">{{ title || '菜单' }}</div>
          <button class="mobile-drawer-close" type="button" @click="close" aria-label="关闭">×</button>
        </header>
        <div class="mobile-drawer-body">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>
