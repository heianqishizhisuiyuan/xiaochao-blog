<script setup lang="ts">
import { computed, ref } from 'vue'
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { categories, posts } from '../data/content'

useSeo({
  title: '文章',
  description: '按分类与关键词浏览最近文章，快速判断哪篇值得现在点开。',
  path: '/posts'
})

const keyword = ref('')
const activeCategory = ref('All')

const filteredPosts = computed(() => {
  return posts.filter((post) => {
    const byCategory = activeCategory.value === 'All' || post.category === activeCategory.value
    const q = keyword.value.trim().toLowerCase()
    const searchable = [post.title, post.summary, post.category, ...post.tags].join(' ').toLowerCase()
    const byKeyword = !q || searchable.includes(q)
    return byCategory && byKeyword
  })
})

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
            <div class="section-kicker">Posts</div>
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

        <section class="glass-panel filter-panel editorial-filter-panel">
          <div class="section-kicker">筛选一下</div>
          <p class="filter-intro">如果你已经知道自己想看什么，可以直接搜标题、摘要或标签；如果没有，就先按分类慢慢翻。</p>
          <el-input v-model="keyword" placeholder="搜索标题、摘要、标签..." clearable size="large" />
          <div class="tag-row filter-row">
            <button
              class="filter-chip"
              :class="{ active: activeCategory === 'All' }"
              @click="activeCategory = 'All'"
            >
              全部
            </button>
            <button
              v-for="item in categories"
              :key="item.slug"
              class="filter-chip"
              :class="{ active: activeCategory === item.name }"
              @click="activeCategory = item.name"
            >
              {{ item.name }}
            </button>
          </div>
        </section>

        <div v-if="filteredPosts.length" class="post-list-grid editorial-post-list-grid">
          <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
        </div>

        <div v-else class="glass-panel empty-state editorial-empty-state">
          <div class="section-kicker">No Results</div>
          <h3>这里暂时没有匹配内容</h3>
          <p>换个关键词试试，或者先回到“全部”，从最近的文章开始翻也行。</p>
        </div>
      </section>

      <SiteSidebar />
    </main>

    <SiteFooter />
  </div>
</template>
