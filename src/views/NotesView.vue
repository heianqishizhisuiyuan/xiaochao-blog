<script setup lang="ts">
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import SiteSidebar from '../components/SiteSidebar.vue'
import { useSeo } from '../composables/useSeo'
import { statusNoteMap } from '../data/content'

const notes = Object.values(statusNoteMap)

useSeo({
  title: '随记',
  description: '查看最近在看、最近想写、随手记和最近在盯的状态型内容。',
  path: '/notes'
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="content-layout editorial-content-layout">
      <section>
        <div class="subpage-head compact posts-head editorial-posts-head">
          <div>
            <div class="section-kicker">Notes</div>
            <h1>最近顺手记下来的东西</h1>
            <p>这里放的不是完整文章，而是最近在看、在想、在盯、先记下来免得忘的线索。它们更短，也更接近真实的写作现场。</p>
          </div>
        </div>

        <div class="notes-grid editorial-notes-grid">
          <article v-for="note in notes" :key="note.slug" class="glass-panel note-entry-card editorial-note-card">
            <div class="section-kicker">{{ note.title }}</div>
            <p class="note-entry-summary">{{ note.summary }}</p>
            <ul class="note-entry-list">
              <li v-for="item in note.items" :key="item">{{ item }}</li>
            </ul>
            <div class="note-entry-footer">
              <div class="note-entry-meta" v-if="note.updatedAt">更新于 {{ note.updatedAt }}</div>
              <RouterLink :to="`/notes/${note.slug}`" class="section-link">展开这条 →</RouterLink>
            </div>
          </article>
        </div>
      </section>

      <SiteSidebar />
    </main>

    <SiteFooter />
  </div>
</template>
