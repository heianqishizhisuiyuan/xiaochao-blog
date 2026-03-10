<script setup lang="ts">
import { popularTags, recentPosts, statusNoteMap } from '../data/content'

const upcoming = statusNoteMap['upcoming-notes']
const reading = statusNoteMap['currently-reading']
const quick = statusNoteMap['quick-notes']
</script>

<template>
  <aside class="sidebar-stack editorial-sidebar-stack">
    <section class="glass-panel sidebar-card sidebar-intro-card">
      <div class="section-kicker">侧边栏</div>
      <h3>这里放的是阅读辅助，不是另一套首页。</h3>
      <p>
        所以我把它收得更克制：几条最近在记的线索、一些标签，还有最新更新，方便你判断接下来往哪看。
      </p>
    </section>

    <section class="glass-panel sidebar-card" v-if="reading">
      <div class="section-kicker">{{ reading.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in reading.items" :key="item">
          <strong>{{ item }}</strong>
          <span>这些内容会慢慢渗进后面的页面和文章。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="upcoming">
      <div class="section-kicker">{{ upcoming.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in upcoming.items" :key="item">
          <strong>{{ item }}</strong>
          <span>先记下来，后面再长成完整文章。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="quick">
      <div class="section-kicker">{{ quick.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in quick.items" :key="item">
          <strong>{{ item }}</strong>
          <span>一些短线索，会保留它本来的粗糙感。</span>
        </li>
      </ul>
      <RouterLink to="/notes" class="section-link sidebar-inline-link">去看全部随记 →</RouterLink>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">标签入口</div>
      <div class="tag-cloud">
        <span v-for="tag in popularTags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">最新更新</div>
      <ul class="mini-posts">
        <li v-for="post in recentPosts" :key="post.slug">
          <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
          <span>{{ post.date }} · {{ post.readingTime }}</span>
        </li>
      </ul>
    </section>
  </aside>
</template>
