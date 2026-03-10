<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { archiveGroups, categories, popularTags, recentPosts, statusNoteMap } from '../data/content'

type TocItem = { id: string; title: string }

const props = defineProps<{
  toc?: TocItem[]
  hideSearch?: boolean
}>()

const route = useRoute()
const router = useRouter()

const upcoming = statusNoteMap['upcoming-notes']
const reading = statusNoteMap['currently-reading']
const quick = statusNoteMap['quick-notes']

const sidebarSearch = ref('')

watch(
  () => route.query,
  (query) => {
    sidebarSearch.value = typeof query.q === 'string' ? query.q : ''
  },
  { immediate: true }
)

const submitSearch = () => {
  const q = sidebarSearch.value.trim()
  router.push({
    path: '/posts',
    query: {
      ...(q ? { q } : {})
    }
  })
}


const currentYear = computed(() => {
  const raw = typeof route.query.year === 'string' ? route.query.year : ''
  const years = archiveGroups.map((y) => y.year)
  if (raw && years.includes(raw)) return raw
  return years[0] ?? ''
})

const yearOptions = computed(() => archiveGroups.map((y) => y.year))

const activeYearGroup = computed(() => archiveGroups.find((y) => y.year === currentYear.value) ?? null)

const archiveLinks = computed(() =>
  (activeYearGroup.value?.months ?? []).map((month) => ({
    key: month.key,
    label: `${month.name}`,
    count: month.count,
    to: `/archive?year=${encodeURIComponent(currentYear.value)}#archive-${month.key}`
  }))
)

const gotoYear = (year: string) => {
  router.push({ path: route.path, query: { ...route.query, year } })
}

const prevYear = computed(() => {
  const years = yearOptions.value
  const index = years.findIndex((y) => y === currentYear.value)
  return index >= 0 ? years[index + 1] ?? '' : ''
})

const nextYear = computed(() => {
  const years = yearOptions.value
  const index = years.findIndex((y) => y === currentYear.value)
  return index > 0 ? years[index - 1] ?? '' : ''
})

const categoryLinks = computed(() =>
  categories.map((item) => ({
    label: item.name,
    desc: item.desc,
    to: `/posts?category=${encodeURIComponent(item.name)}`
  }))
)

const tagLinks = computed(() =>
  popularTags.map((tag) => ({
    label: tag,
    to: `/posts?tag=${encodeURIComponent(tag)}`
  }))
)

const commonTags = computed(() => tagLinks.value.slice(0, 12))

const routeFullPath = computed(() => route.fullPath)

const isActiveQuery = (to: string) => routeFullPath.value === to
</script>

<template>
  <aside class="sidebar-stack editorial-sidebar-stack sidebar-nav-layout">
    <section v-if="!props.hideSearch" class="glass-panel sidebar-card sidebar-search-card">
      <div class="section-kicker">搜索</div>
      <form class="sidebar-search" @submit.prevent="submitSearch">
        <input v-model="sidebarSearch" class="sidebar-search-input" placeholder="搜标题 / 摘要 / 标签…" />
        <button class="sidebar-search-btn" type="submit">Go</button>
      </form>
      <div class="sidebar-search-hint">按回车直接跳到文章列表筛选。</div>
    </section>

    <section v-if="props.toc && props.toc.length > 1" class="glass-panel sidebar-card sidebar-toc-card">
      <div class="section-kicker">本页目录</div>
      <div class="toc-list sidebar-toc">
        <a v-for="item in props.toc" :key="item.id" class="sidebar-toc-link" :href="`#${item.id}`">{{ item.title }}</a>
      </div>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">按日期找</div>
      <div class="sidebar-year-nav">
        <button class="filter-chip ghost" :disabled="!prevYear" @click="prevYear && gotoYear(prevYear)">← {{ prevYear || ' ' }}</button>
        <strong class="sidebar-year-title">{{ currentYear }}</strong>
        <button class="filter-chip ghost" :disabled="!nextYear" @click="nextYear && gotoYear(nextYear)">{{ nextYear || ' ' }} →</button>
      </div>
      <p class="sidebar-intro-copy">一年一屏，按月份快速跳转。</p>
      <ul class="sidebar-nav-list archive-nav-list">
        <li v-for="item in archiveLinks" :key="item.key">
          <RouterLink :to="item.to" class="sidebar-nav-link compact" :class="{ active: routeFullPath === item.to }">
            <span>{{ item.label }}</span>
            <span class="sidebar-nav-meta">{{ item.count }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">按分类找</div>
      <ul class="sidebar-topic-list">
        <li v-for="item in categoryLinks" :key="item.label">
          <RouterLink :to="item.to" class="sidebar-topic-link" :class="{ active: isActiveQuery(item.to) }">
            <strong>{{ item.label }}</strong>
            <span>{{ item.desc }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">常用标签</div>
      <p class="sidebar-intro-copy">直接点进去逛，不用先想关键词。</p>
      <div class="tag-cloud sidebar-tag-cloud">
        <RouterLink
          v-for="item in commonTags"
          :key="item.label"
          :to="item.to"
          class="tag-chip sidebar-tag-link"
          :class="{ active: isActiveQuery(item.to) }"
        >
          #{{ item.label }}
        </RouterLink>
      </div>
      <RouterLink to="/posts" class="section-link sidebar-inline-link">更多标签/筛选 →</RouterLink>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">标签（更多）</div>
      <div class="tag-cloud sidebar-tag-cloud">
        <RouterLink
          v-for="item in tagLinks"
          :key="item.label"
          :to="item.to"
          class="tag-chip sidebar-tag-link"
          :class="{ active: isActiveQuery(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">最近更新</div>
      <ul class="mini-posts">
        <li v-for="post in recentPosts" :key="post.slug">
          <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
          <span>{{ post.date }} · {{ post.readingTime }}</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="reading">
      <div class="section-kicker">{{ reading.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in reading.items" :key="item">
          <strong>{{ item }}</strong>
          <span>这些内容会慢慢渗进后面的页面和文章。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="upcoming">
      <div class="section-kicker">{{ upcoming.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in upcoming.items" :key="item">
          <strong>{{ item }}</strong>
          <span>先记下来，后面再长成完整文章。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="quick">
      <div class="section-kicker">{{ quick.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in quick.items" :key="item">
          <strong>{{ item }}</strong>
          <span>一些短线索，会保留它本来的粗糙感。</span>
        </li>
      </ul>
      <RouterLink to="/notes" class="section-link sidebar-inline-link">去看全部随记 →</RouterLink>
    </section>
  </aside>
</template>
