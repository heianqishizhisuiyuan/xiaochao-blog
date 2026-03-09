<script setup lang="ts">
import { computed, ref } from 'vue'
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { categories, posts } from '../data/content'

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
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="content-layout">
      <section>
        <div class="subpage-head compact">
          <div>
            <div class="section-kicker">Posts</div>
            <h1>文章列表</h1>
            <p>这一页已经从占位页升级为可浏览、可搜索、可按分类筛选的博客内容流骨架。</p>
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
          <h3>没有匹配内容</h3>
          <p>可以试试换个关键词，或者切回“全部”分类。</p>
        </div>
      </section>

      <SiteSidebar />
    </main>

    <SiteFooter />
  </div>
</template>
