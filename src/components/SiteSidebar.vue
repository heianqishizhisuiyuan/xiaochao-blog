<script setup lang="ts">
import { categories, popularTags, recentPosts, statusNoteMap } from '../data/content'

const upcoming = statusNoteMap['upcoming-notes']
const reading = statusNoteMap['currently-reading']
const quick = statusNoteMap['quick-notes']
const watching = statusNoteMap['now-watching']
</script>

<template>
  <aside class="sidebar-stack">
    <section class="glass-panel sidebar-card">
      <div class="section-kicker">写在侧边</div>
      <h3>这里不是团队介绍页，就是一块慢慢写长的地方。</h3>
      <p>
        我会把最近在做的事、重新想明白的事，还有一些没必要包装得很漂亮的过程留在这里。
      </p>
    </section>

    <section class="glass-panel sidebar-card" v-if="upcoming">
      <div class="section-kicker">{{ upcoming.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in upcoming.items" :key="item">
          <strong>{{ item }}</strong>
          <span>还在路上，但已经记下来了。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="reading">
      <div class="section-kicker">{{ reading.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in reading.items" :key="item">
          <strong>{{ item }}</strong>
          <span>这些东西会慢慢影响后面的文章和页面气质。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="watching">
      <div class="section-kicker">{{ watching.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in watching.items" :key="item">
          <strong>{{ item }}</strong>
          <span>这部分是我最近持续回看、持续确认的地方。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card" v-if="quick">
      <div class="section-kicker">{{ quick.title }}</div>
      <ul class="sidebar-list">
        <li v-for="item in quick.items" :key="item">
          <strong>{{ item }}</strong>
          <span>先记下来，后面再慢慢长成文章。</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">最近常写</div>
      <ul class="sidebar-list">
        <li v-for="item in categories" :key="item.slug">
          <strong>{{ item.name }}</strong>
          <span>{{ item.desc }}</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">顺手记下的标签</div>
      <div class="tag-cloud">
        <span v-for="tag in popularTags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
      <RouterLink to="/notes" class="section-link sidebar-inline-link">去看全部随记 →</RouterLink>
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
