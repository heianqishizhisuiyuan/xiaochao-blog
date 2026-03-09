<script setup lang="ts">
import { computed } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { useSeo } from '../composables/useSeo'
import { archiveGroups } from '../data/content'

useSeo({
  title: '归档',
  description: '按时间查看博客归档，快速回顾最近更新的内容。',
  path: '/archive'
})

const archiveStats = computed(() => {
  const years = archiveGroups.length
  const months = archiveGroups.reduce((sum, year) => sum + year.months.length, 0)
  const posts = archiveGroups.reduce((sum, year) => sum + year.total, 0)

  return { years, months, posts }
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="subpage-wrap archive-wrap">
      <div class="subpage-head compact archive-head">
        <div>
          <div class="section-kicker">Archive</div>
          <h1>归档</h1>
          <p>把时间线做清楚，站点才会显得持续生长，而不是几篇文章的临时摆放。</p>
        </div>

        <div class="archive-overview glass-panel">
          <div>
            <strong>{{ archiveStats.posts }}</strong>
            <span>总文章数</span>
          </div>
          <div>
            <strong>{{ archiveStats.months }}</strong>
            <span>活跃月份</span>
          </div>
          <div>
            <strong>{{ archiveStats.years }}</strong>
            <span>内容年份</span>
          </div>
        </div>
      </div>

      <section v-for="year in archiveGroups" :key="year.year" class="glass-panel archive-year timeline-year">
        <div class="archive-year-head timeline-head">
          <h2>{{ year.year }}</h2>
          <span>{{ year.total }} 篇</span>
        </div>

        <div v-for="month in year.months" :key="month.key" class="archive-month timeline-month">
          <div class="archive-month-title">{{ month.name }} · {{ month.count }} 篇</div>
          <div class="archive-links">
            <RouterLink v-for="item in month.items" :key="item.slug" :to="`/posts/${item.slug}`" class="archive-item archive-card-link">
              <div>
                <strong>{{ item.title }}</strong>
                <span>{{ item.category }} · {{ item.readingTime }}</span>
              </div>
              <time>{{ item.date }}</time>
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
