<script setup lang="ts">
import { computed } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { posts, siteMeta, statusNoteMap } from '../data/content'

useSeo({
  title: '首页',
  description: siteMeta.description,
  path: '/'
})

const latestPosts = computed(() => posts.slice(0, 8))
const featuredPosts = computed(() => posts.filter((post) => post.featured).slice(0, 3))

const latestNotes = computed(() => {
  const notes = Object.values(statusNoteMap)
  return notes
    .slice()
    .sort((a, b) => String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? '')))
    .slice(0, 3)
})


</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="content-layout editorial-content-layout home-layout">
      <section>
        <header class="glass-panel home-intro-card">
          <div class="section-kicker">个人博客</div>
          <h1 class="home-title">{{ siteMeta.name }}</h1>
          <p class="home-lead">{{ siteMeta.tagline }}</p>
          <div class="home-entry-actions">
            <RouterLink to="/posts" class="section-link">去文章列表 →</RouterLink>
            <RouterLink to="/archive" class="section-link">按时间归档 →</RouterLink>
            <RouterLink to="/notes" class="section-link">最近随记 →</RouterLink>
          </div>
        </header>

        <section class="section-head compact-section-head">
          <div>
            <div class="section-kicker">最近</div>
            <h2>最近更新</h2>
          </div>
          <RouterLink to="/posts" class="section-link">查看全部 →</RouterLink>
        </section>

        <section class="glass-panel home-feed-card">
          <ul class="post-compact-list">
            <li v-for="post in latestPosts" :key="post.slug" class="post-compact-item">
              <RouterLink :to="`/posts/${post.slug}`" class="post-compact-link">
                <div class="post-compact-main">
                  <strong class="post-compact-title">{{ post.title }}</strong>
                  <p class="post-compact-summary">{{ post.summary }}</p>
                  <div class="post-compact-meta">
                    <span class="meta-chip">{{ post.date }}</span>
                    <span class="meta-chip">{{ post.category }}</span>
                    <span class="meta-chip">{{ post.readingTime }}</span>
                  </div>
                </div>
                <span class="post-compact-arrow">→</span>
              </RouterLink>
            </li>
          </ul>
        </section>

        <section v-if="featuredPosts.length" class="section-head">
          <div>
            <div class="section-kicker">Featured</div>
            <h2>推荐先读</h2>
          </div>
        </section>

        <section v-if="featuredPosts.length" class="home-featured-grid">
          <article v-for="post in featuredPosts" :key="post.slug" class="glass-panel featured-mini-card">
            <div class="section-kicker">{{ post.category }}</div>
            <h3 class="featured-mini-title">
              <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
            </h3>
            <p class="featured-mini-summary">{{ post.summary }}</p>
            <div class="featured-mini-meta">
              <span>{{ post.date }}</span>
              <span>·</span>
              <span>{{ post.readingTime }}</span>
            </div>
          </article>
        </section>

        <section v-if="latestNotes.length" class="section-head">
          <div>
            <div class="section-kicker">Notes</div>
            <h2>随手记（最近）</h2>
          </div>
          <RouterLink to="/notes" class="section-link">去随记页 →</RouterLink>
        </section>

        <section v-if="latestNotes.length" class="home-notes-grid">
          <article v-for="note in latestNotes" :key="note.slug" class="glass-panel note-mini-card">
            <div class="section-kicker">{{ note.title }}</div>
            <p class="note-mini-summary">{{ note.summary }}</p>
            <ul class="note-mini-list">
              <li v-for="item in note.items.slice(0, 4)" :key="item">{{ item }}</li>
            </ul>
            <RouterLink :to="`/notes/${note.slug}`" class="section-link">展开 →</RouterLink>
          </article>
        </section>
      </section>

      <SiteSidebar :hideSearch="true" />
    </main>

    <SiteFooter />
  </div>
</template>
