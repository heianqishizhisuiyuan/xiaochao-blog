<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()

const qCategory = computed(() => (typeof route.query.category === 'string' ? route.query.category : ''))
const qTag = computed(() => (typeof route.query.tag === 'string' ? route.query.tag : ''))

const filteredPosts = computed(() => {
  const category = qCategory.value
  const tag = qTag.value

  return posts.filter((post) => {
    const byCategory = !category || post.category === category
    const byTag = !tag || post.tags.includes(tag)
    return byCategory && byTag
  })
})

</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="content-layout editorial-content-layout">
      <section>
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
