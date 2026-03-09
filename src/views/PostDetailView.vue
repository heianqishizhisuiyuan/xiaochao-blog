<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { posts } from '../data/content'

const route = useRoute()

const post = computed(() => posts.find((item) => item.slug === route.params.slug))
const relatedPosts = computed(() => posts.filter((item) => item.slug !== route.params.slug).slice(0, 3))
const toc = computed(() => post.value?.content.map((_, index) => `内容段落 ${index + 1}`) ?? [])
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main v-if="post" class="content-layout detail-layout">
      <article class="glass-panel article-shell">
        <div class="article-meta-top">
          <span>{{ post.category }}</span>
          <span>{{ post.date }} · {{ post.readingTime }}</span>
        </div>
        <h1>{{ post.title }}</h1>
        <p class="article-summary">{{ post.summary }}</p>

        <div class="tag-row article-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag-chip small">{{ tag }}</span>
        </div>

        <section class="toc-box">
          <div class="section-kicker">TOC</div>
          <div class="toc-list">
            <a v-for="(item, index) in toc" :key="item" :href="`#section-${index + 1}`">{{ item }}</a>
          </div>
        </section>

        <div class="article-body">
          <section
            v-for="(paragraph, index) in post.content"
            :id="`section-${index + 1}`"
            :key="`${post.slug}-${index}`"
            class="article-section"
          >
            <h2>内容段落 {{ index + 1 }}</h2>
            <p>{{ paragraph }}</p>
          </section>
        </div>

        <section class="article-related">
          <div class="section-kicker">Continue Reading</div>
          <div class="related-list">
            <RouterLink v-for="item in relatedPosts" :key="item.slug" :to="`/posts/${item.slug}`" class="related-item">
              <strong>{{ item.title }}</strong>
              <span>{{ item.date }}</span>
            </RouterLink>
          </div>
        </section>
      </article>

      <SiteSidebar />
    </main>

    <main v-else class="subpage-wrap">
      <div class="glass-panel placeholder-block">
        <div class="section-kicker">404</div>
        <h1>文章不存在</h1>
        <p>详情页内容已经切到本地 Markdown 结构，后面可以继续接真实内容流。</p>
        <RouterLink to="/posts" class="section-link">返回文章列表 →</RouterLink>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>
