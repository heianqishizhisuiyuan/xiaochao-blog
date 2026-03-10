<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { archiveGroups } from '../data/content'
import { buildTimeline, pickDefaultIndex, readYearFromRoute } from '../utils/archiveTimeline'

const props = defineProps<{ compact?: boolean }>()

const route = useRoute()
const router = useRouter()

const currentYear = ref(readYearFromRoute(route))

watch(
  () => route.query.year,
  () => {
    currentYear.value = readYearFromRoute(route)
  }
)

const years = computed(() => archiveGroups.map((g) => g.year))

const timeline = computed(() => buildTimeline(currentYear.value))

const shownItems = computed(() => {
  const items = timeline.value.items
  if (!props.compact) return items
  // show recent months with content first; if all empty, fall back to newest months.
  const withContent = items.filter((i) => i.count > 0)
  const pick = (withContent.length ? withContent : items).slice(0, 6)
  return pick
})

const activeIndex = ref(0)
watch(
  () => shownItems.value,
  (items) => {
    activeIndex.value = pickDefaultIndex(items)
  },
  { immediate: true }
)

const clampIndex = (i: number) => {
  const max = shownItems.value.length - 1
  return Math.max(0, Math.min(max, i))
}

const selectIndex = (i: number) => {
  activeIndex.value = clampIndex(i)
}

const gotoActive = () => {
  const item = shownItems.value[activeIndex.value]
  if (!item) return
  router.push(item.to)
}

const step = (delta: number) => {
  selectIndex(activeIndex.value + delta)
}

const onWheel = (evt: WheelEvent) => {
  evt.preventDefault()
  const dir = evt.deltaY > 0 ? 1 : -1
  step(dir)
}

const onKey = (evt: KeyboardEvent) => {
  if (evt.key === 'ArrowDown') {
    evt.preventDefault()
    step(1)
  }
  if (evt.key === 'ArrowUp') {
    evt.preventDefault()
    step(-1)
  }
  if (evt.key === 'Enter') {
    evt.preventDefault()
    gotoActive()
  }
}

const onYearChange = () => {
  router.push({ path: route.path, query: { ...route.query, year: currentYear.value } })
}
</script>

<template>
  <section class="glass-panel sidebar-card timeline-card" @wheel.passive="false" @wheel="onWheel">
    <div class="section-kicker kicker-with-icon">
      <el-icon><Calendar /></el-icon>
      <span>按日期找</span>
    </div>

    <div class="timeline-head">
      <select v-model="currentYear" class="timeline-year" @change="onYearChange">
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <div class="timeline-hint">滚轮选月份，回车跳转</div>
    </div>

    <div class="timeline-body" tabindex="0" @keydown="onKey">
      <button class="filter-chip ghost icon-btn" type="button" @click="step(-1)" aria-label="上一个月份">
        <el-icon><ArrowUp /></el-icon>
      </button>

      <div class="timeline-track">
        <button
          v-for="(item, idx) in shownItems"
          :key="item.key"
          class="timeline-item"
          :class="{ active: idx === activeIndex }"
          type="button"
          @click="selectIndex(idx); gotoActive()"
        >
          <span class="timeline-dot" aria-hidden="true"></span>
          <span class="timeline-label">{{ item.monthLabel }}</span>
          <span class="timeline-count">{{ item.count }}</span>
        </button>
      </div>

      <button class="filter-chip ghost icon-btn" type="button" @click="step(1)" aria-label="下一个月份">
        <el-icon><ArrowDown /></el-icon>
      </button>
    </div>

    <div class="timeline-footer">
      <button class="filter-chip" type="button" @click="gotoActive">跳转到选中月份</button>
    </div>
  </section>
</template>
