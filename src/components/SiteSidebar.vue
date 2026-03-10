<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { archiveGroups, categories, popularTags, recentPosts, statusNoteMap } from '../data/content'

const route = useRoute()

const upcoming = statusNoteMap['upcoming-notes']
const reading = statusNoteMap['currently-reading']
const quick = statusNoteMap['quick-notes']

const primaryNav = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/posts' },
  { label: '随记', to: '/notes' },
  { label: '归档', to: '/archive' },
  { label: '关于', to: '/about' }
]

const archiveLinks = computed(() =>
  archiveGroups.flatMap((year) =>
    year.months.map((month) => ({
      key: month.key,
      label: `${year.year} · ${month.name}`,
      count: month.count,
      to: `/archive#archive-${month.key}`
    }))
  )
)

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

const routePath = computed(() => route.path)
const routeFullPath = computed(() => route.fullPath)

const isActive = (to: string) => routePath.value === to
const isActiveQuery = (to: string) => routeFullPath.value === to
</script>

<template>
  <aside class="sidebar-stack editorial-sidebar-stack sidebar-nav-layout">
    <section class="glass-panel sidebar-card sidebar-nav-card">
      <div class="section-kicker">快速导航</div>
      <ul class="sidebar-nav-list">
        <li v-for="item in primaryNav" :key="item.to">
          <RouterLink :to="item.to" class="sidebar-nav-link" :class="{ active: isActive(item.to) }">
            <span>{{ item.label }}</span>
            <span class="sidebar-nav-arrow">→</span>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">按日期找</div>
      <p class="sidebar-intro-copy">如果你记得大概是什么时候写的，可以直接从月份跳进去找。</p>
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
      <div class="section-kicker">按标签找</div>
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
