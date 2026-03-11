<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()

const elRef = ref<HTMLElement | null>(null)

const margin = 14

const isDark = computed(() => themeStore.theme === 'dark')

const posLeft = ref(0)
const posTop = ref(0)

const corner = ref<'tr' | 'bl'>(isDark.value ? 'bl' : 'tr')

const computeTarget = (target: 'tr' | 'bl', width: number, height: number) => {
  if (target === 'tr') {
    return {
      left: Math.max(margin, window.innerWidth - margin - width),
      top: margin
    }
  }
  return {
    left: margin,
    top: Math.max(margin, window.innerHeight - margin - height)
  }
}

const lockToCorner = (target: 'tr' | 'bl') => {
  const el = elRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const t = computeTarget(target, rect.width, rect.height)
  posLeft.value = t.left
  posTop.value = t.top
}

const onResize = () => {
  lockToCorner(corner.value)
}

onMounted(() => {
  // initial position
  nextTick(() => lockToCorner(corner.value))
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

const toggle = async () => {
  const el = elRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const from = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }

  const targetCorner: 'tr' | 'bl' = corner.value === 'tr' ? 'bl' : 'tr'
  const to = computeTarget(targetCorner, from.width, from.height)

  // Lock element at current place, then animate by transform.
  posLeft.value = from.left
  posTop.value = from.top

  // Switch theme immediately for visual feedback while moving.
  themeStore.setTheme(targetCorner === 'bl' ? 'dark' : 'cool')

  await nextTick()

  const dx = to.left - from.left
  const dy = to.top - from.top

  el.style.transition = 'transform 520ms cubic-bezier(.2,.8,.2,1)'
  el.style.transform = `translate(${dx}px, ${dy}px)`

  const finish = () => {
    el.style.transition = ''
    el.style.transform = ''
    posLeft.value = to.left
    posTop.value = to.top
    corner.value = targetCorner
  }

  el.addEventListener('transitionend', finish, { once: true })

  // safety: in case transitionend doesn't fire
  window.setTimeout(() => {
    if (corner.value !== targetCorner) finish()
  }, 650)
}
</script>

<template>
  <div ref="elRef" class="theme-float" :style="{ left: `${posLeft}px`, top: `${posTop}px` }">
    <label class="theme-switch" aria-label="夜读模式">
      <input class="theme-switch-input" type="checkbox" :checked="isDark" @change="toggle" />
      <span class="theme-switch-track" aria-hidden="true">
        <span class="theme-switch-thumb" />
      </span>
      <span class="theme-switch-text">夜读</span>
    </label>
  </div>
</template>
