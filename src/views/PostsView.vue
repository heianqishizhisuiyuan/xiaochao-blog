<script setup lang="ts">
import { computed } from 'vue'
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { posts } from '../data/content'

useSeo({
  title: '文章',
  description: '按分类与关键词浏览最近文章，快速判断哪篇值得现在点开。',
  path: '/posts'
})

const filteredPosts = computed(() => posts)

const totalReadingMinutes = computed(() => {
  return filteredPosts.value.reduce((sum, post) => sum + Number.parseInt(post.readingTime, 10), 0)
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="content-layout editorial-content-layout">
      <section>
        <div class="subpage-head compact posts-head editorial-posts-head">
          <div>
            <div class="section-kicker">文章</div>
            <h1>最近写下来的文章</h1>
            <p>这页不想做成内容货架，更像一个清楚的入口：你可以很快知道这篇写什么、现在值不值得读，以及要花多长时间。</p>
          </div>
          <div class="posts-overview glass-panel editorial-overview-card">
            <div>
              <strong>{{ filteredPosts.length }}</strong>
              <span>当前可读文章</span>
            </div>
            <div>
              <strong>{{ totalReadingMinutes }}</strong>
              <span>大致阅读分钟</span>
            </div>
          </div>
        </div>


        <div v-if="filteredPosts.length" class="card-grid post-list-grid editorial-post-list-grid">
          <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
        </div>

        <div v-else class="glass-panel empty-state editorial-empty-state">
          <div class="section-kicker">暂无结果</div>
          <h3>这里暂时没有匹配内容</h3>
          <p>换个关键词试试，或者先回到“全部”，从最近的文章开始翻也行。</p>
        </div>
      </section>

      <SiteSidebar :collapseOnNarrow="true" />
    </main>

    <SiteFooter />
  </div>
</template>
