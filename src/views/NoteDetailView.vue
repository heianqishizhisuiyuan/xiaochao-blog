<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { statusNoteMap } from '../data/content'

const route = useRoute()
const note = computed(() => statusNoteMap[String(route.params.slug ?? '')])

useSeo({
  title: computed(() => note.value?.title ?? '随记不存在'),
  description: computed(() => note.value?.summary ?? '这条随记不存在或还没整理出来。'),
  path: computed(() => `/notes/${String(route.params.slug ?? '')}`)
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main v-if="note" class="content-layout detail-layout editorial-content-layout">
      <article class="glass-panel article-shell editorial-article-shell editorial-note-detail-shell">
        <div class="article-meta-top article-meta-grid editorial-article-meta-top">
          <div class="article-meta-primary">
            <span class="meta-chip">Notes</span>
            <span class="meta-chip">{{ note.type ?? 'status-note' }}</span>
          </div>
          <div class="article-meta-primary muted">
            <span v-if="note.updatedAt">{{ note.updatedAt }}</span>
          </div>
        </div>

        <h1>{{ note.title }}</h1>
        <p class="article-summary editorial-article-summary">{{ note.summary }}</p>

        <section class="toc-box editorial-toc-box">
          <div class="section-kicker">这条随记里有什么</div>
          <ul class="note-entry-list article-note-list">
            <li v-for="item in note.items" :key="item">{{ item }}</li>
          </ul>
        </section>
      </article>

      <SiteSidebar />
    </main>

    <main v-else class="subpage-wrap">
      <div class="glass-panel placeholder-block editorial-empty-state">
        <div class="section-kicker">404</div>
        <h1>随记不存在</h1>
        <p>这条 notes 可能还没整理出来，或者已经被合并进别的内容流。</p>
        <RouterLink to="/notes" class="section-link">返回随记列表 →</RouterLink>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>
