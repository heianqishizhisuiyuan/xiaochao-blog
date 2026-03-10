<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MobileDrawer from './MobileDrawer.vue'
import ArchiveTimeline from './ArchiveTimeline.vue'
import { categories, popularTags } from '../data/content'

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
    // close on navigation
    open.value = false
  }
)
</script>

<template>
  <MobileDrawer v-model="open" title="筛选与归档">
    <div class="mobile-filter-section">
      <div class="mobile-filter-title">按日期</div>
      <ArchiveTimeline />
    </div>

    <div class="mobile-filter-section">
      <div class="mobile-filter-title">分类</div>
      <div class="mobile-chip-row">
        <RouterLink v-for="c in categories" :key="c.slug" class="tag-chip" :to="`/posts?category=${encodeURIComponent(c.name)}`">
          {{ c.name }}
        </RouterLink>
      </div>
    </div>

    <div class="mobile-filter-section">
      <div class="mobile-filter-title">常用标签</div>
      <div class="mobile-chip-row">
        <RouterLink v-for="t in popularTags.slice(0, 16)" :key="t" class="tag-chip" :to="`/posts?tag=${encodeURIComponent(t)}`">
          #{{ t }}
        </RouterLink>
      </div>
    </div>
  </MobileDrawer>
</template>
