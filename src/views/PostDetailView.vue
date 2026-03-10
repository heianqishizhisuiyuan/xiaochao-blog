<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { posts } from '../data/content'

const route = useRoute()

const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const currentIndex = computed(() => posts.findIndex((item) => item.slug === route.params.slug))
const previousPost = computed(() => {
  const index = currentIndex.value
  return index >= 0 ? posts[index + 1] ?? null : null
})
const nextPost = computed(() => {
  const index = currentIndex.value
  return index > 0 ? posts[index - 1] ?? null : null
})
const relatedPosts = computed(() => {
  if (!post.value) return []

  return posts
    .filter((item) => item.slug !== post.value?.slug)
    .map((item) => {
      const sameCategory = item.category === post.value?.category ? 2 : 0
      const sharedTags = item.tags.filter((tag) => post.value?.tags.includes(tag)).length
      return { item, score: sameCategory + sharedTags }
    })
    .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
    .slice(0, 3)
    .map(({ item }) => item)
})
const toc = computed(() => post.value?.sections ?? [])

useSeo({
  title: computed(() => post.value?.title ?? '文章不存在'),
  description: computed(() => post.value?.summary ?? '该文章不存在或已被移除。'),
  path: computed(() => `/posts/${String(route.params.slug ?? '')}`),
  type: 'article'
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main v-if="post" class="content-layout detail-layout editorial-content-layout">
      <article class="glass-panel article-shell editorial-article-shell">
        <div class="article-meta-top article-meta-grid editorial-article-meta-top">
          <div class="article-meta-primary">
            <span class="meta-chip">{{ post.category }}</span>
            <span class="meta-chip">{{ post.date }}</span>
          </div>
          <div class="article-meta-primary muted">
            <span>{{ post.readingTime }}</span>
            <span>{{ post.wordCount }} 字</span>
          </div>
        </div>

        <h1>{{ post.title }}</h1>
        <p class="article-summary editorial-article-summary">{{ post.summary }}</p>

        <div class="tag-row article-tags editorial-article-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag-chip small">{{ tag }}</span>
        </div>

        <section v-if="toc.length > 1" class="toc-box editorial-toc-box">
          <div class="section-kicker">目录</div>
          <div class="toc-list numbered-toc">
            <a v-for="(item, index) in toc" :key="item.id" :href="`#${item.id}`">
              <span class="toc-index">{{ index + 1 }}</span>
              <span>{{ item.title }}</span>
            </a>
          </div>
        </section>

        <div class="article-body editorial-article-body">
          <section v-for="section in post.sections" :id="section.id" :key="section.id" class="article-section">
            <h2>{{ section.title }}</h2>
            <p v-for="(paragraph, index) in section.paragraphs" :key="`${section.id}-${index}`">
              {{ paragraph }}
            </p>
          </section>
        </div>

        <section class="article-nav editorial-article-nav">
          <div class="section-kicker">继续阅读</div>
          <div class="article-nav-grid">
            <RouterLink v-if="previousPost" :to="`/posts/${previousPost.slug}`" class="article-nav-item editorial-article-nav-item">
              <span class="article-nav-label">上一篇</span>
              <strong>{{ previousPost.title }}</strong>
            </RouterLink>
            <div v-else class="article-nav-item is-empty editorial-article-nav-item">
              <span class="article-nav-label">上一篇</span>
              <strong>已经是最早的一篇</strong>
            </div>

            <RouterLink v-if="nextPost" :to="`/posts/${nextPost.slug}`" class="article-nav-item editorial-article-nav-item">
              <span class="article-nav-label">下一篇</span>
              <strong>{{ nextPost.title }}</strong>
            </RouterLink>
            <div v-else class="article-nav-item is-empty editorial-article-nav-item">
              <span class="article-nav-label">下一篇</span>
              <strong>已经是最新的一篇</strong>
            </div>
          </div>
        </section>

        <section class="article-related editorial-article-related">
          <div class="section-kicker">相关文章</div>
          <div class="related-list">
            <RouterLink v-for="item in relatedPosts" :key="item.slug" :to="`/posts/${item.slug}`" class="related-item editorial-related-item">
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.summary }}</p>
              </div>
              <span>{{ item.date }} · {{ item.readingTime }}</span>
            </RouterLink>
          </div>
        </section>
      </article>

      <SiteSidebar :toc="toc" />
    </main>

    <main v-else class="subpage-wrap">
      <div class="glass-panel placeholder-block editorial-empty-state">
        <div class="section-kicker">404</div>
        <h1>文章不存在</h1>
        <p>这篇内容可能还没整理出来，或者已经从当前文章流里移走了。</p>
        <RouterLink to="/posts" class="section-link">返回文章列表 →</RouterLink>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>
