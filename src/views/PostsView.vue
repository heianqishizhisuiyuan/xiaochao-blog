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
  description: '浏览博客文章、按分类筛选，并快速查找感兴趣的内容。',
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

    <main class="content-layout">
      <section>
        <div class="subpage-head compact posts-head">
          <div>
            <div class="section-kicker">Posts</div>
            <h1>文章列表</h1>
            <p>这里不想做成内容货架，更想让你快速判断：这篇现在值不值得点开，要花多少时间读完。</p>
          </div>
          <div class="posts-overview glass-panel">
            <div>
              <strong>{{ filteredPosts.length }}</strong>
              <span>当前结果</span>
            </div>
            <div>
              <strong>{{ totalReadingMinutes }}</strong>
              <span>大概需要的阅读分钟</span>
            </div>
          </div>
        </div>

        <section class="glass-panel filter-panel">
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

        <div v-if="filteredPosts.length" class="post-list-grid">
          <PostCard v-for="post in filteredPosts" :key="post.slug" :post="post" />
        </div>

        <div v-else class="glass-panel empty-state">
          <div class="section-kicker">No Results</div>
          <h3>这里暂时没有匹配内容</h3>
          <p>换个关键词试试，或者先回到“全部”，慢慢翻也行。</p>
        </div>
      </section>

      <SiteSidebar />
    </main>

    <SiteFooter />
  </div>
</template>
