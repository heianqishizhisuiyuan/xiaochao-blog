<script setup lang="ts">
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { useSeo } from '../composables/useSeo'
import { archiveGroups } from '../data/content'

useSeo({
  title: '归档',
  description: '按时间查看博客归档，快速回顾最近更新的内容。',
  path: '/archive'
})

</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="subpage-wrap archive-wrap editorial-archive-wrap">

      <section v-for="year in archiveGroups" :key="year.year" class="glass-panel archive-year editorial-archive-year">
        <div class="archive-year-head timeline-head">
          <h2>{{ year.year }}</h2>
          <span>{{ year.total }} 篇</span>
        </div>

        <div v-for="month in year.months" :id="`archive-${month.key}`" :key="month.key" class="archive-month editorial-archive-month">
          <div class="archive-month-title">{{ month.name }} · {{ month.count }} 篇</div>
          <div class="archive-links">
            <RouterLink v-for="item in month.items" :key="item.slug" :to="`/posts/${item.slug}`" class="archive-item archive-card-link editorial-archive-item">
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
