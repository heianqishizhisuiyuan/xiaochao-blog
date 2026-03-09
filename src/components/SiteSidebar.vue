<script setup lang="ts">
import { categories, popularTags, recentPosts } from '../data/content'
</script>

<template>
  <aside class="sidebar-stack">
    <section class="glass-panel sidebar-card">
      <div class="section-kicker">Profile</div>
      <h3>小超的内容实验室</h3>
      <p>写技术、产品、系统搭建，也顺手把博客本身做成一个长期进化的作品站。</p>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">Categories</div>
      <ul class="sidebar-list">
        <li v-for="item in categories" :key="item.slug">
          <strong>{{ item.name }}</strong>
          <span>{{ item.desc }}</span>
        </li>
      </ul>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">Popular Tags</div>
      <div class="tag-cloud">
        <span v-for="tag in popularTags" :key="tag" class="tag-chip">{{ tag }}</span>
      </div>
    </section>

    <section class="glass-panel sidebar-card">
      <div class="section-kicker">Recent</div>
      <ul class="mini-posts">
        <li v-for="post in recentPosts" :key="post.slug">
          <RouterLink :to="`/posts/${post.slug}`">{{ post.title }}</RouterLink>
          <span>{{ post.date }}</span>
        </li>
      </ul>
    </section>
  </aside>
</template>
