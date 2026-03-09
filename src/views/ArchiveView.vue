<script setup lang="ts">
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { archiveGroups } from '../data/content'
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="subpage-wrap">
      <div class="subpage-head compact">
        <div>
          <div class="section-kicker">Archive</div>
          <h1>归档</h1>
          <p>按时间维度回看内容，让站点呈现出持续更新的轨迹感。</p>
        </div>
      </div>

      <section v-for="year in archiveGroups" :key="year.year" class="glass-panel archive-year">
        <div class="archive-year-head">
          <h2>{{ year.year }}</h2>
        </div>

        <div v-for="month in year.months" :key="month.name" class="archive-month">
          <div class="archive-month-title">{{ month.name }} · {{ month.count }} 篇</div>
          <div class="archive-links">
            <RouterLink v-for="item in month.items" :key="item.slug" :to="`/posts/${item.slug}`" class="archive-item">
              <span>{{ item.title }}</span>
              <time>{{ item.date }}</time>
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
