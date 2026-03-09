<script setup lang="ts">
import type { Post } from '../data/content'

defineProps<{
  post: Post
}>()
</script>

<template>
  <article class="glass-panel post-card rich-post-card">
    <div class="post-cover-label">{{ post.cover }}</div>
    <div class="post-meta">
      <span>{{ post.category }}</span>
      <span>{{ post.date }} · {{ post.readingTime }}</span>
    </div>
    <h3>{{ post.title }}</h3>
    <p>{{ post.summary }}</p>
    <div class="tag-row">
      <span v-for="tag in post.tags" :key="tag" class="tag-chip small">{{ tag }}</span>
    </div>
    <RouterLink :to="`/posts/${post.slug}`" class="post-link">阅读全文 →</RouterLink>
  </article>
</template>
