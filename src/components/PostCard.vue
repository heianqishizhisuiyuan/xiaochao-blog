<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../data/content'

const props = defineProps<{
  post: Post
}>()

const readingMood = computed(() => {
  const minutes = Number.parseInt(props.post.readingTime, 10)

  if (minutes <= 5) return '适合现在快速读完'
  if (minutes <= 8) return '适合留十分钟慢慢看'
  return '更适合晚点安静读'
})
</script>

<template>
  <RouterLink :to="`/posts/${post.slug}`" class="card-link">
  <article class="glass-panel post-card editorial-post-card">
    <div class="post-note-row">
      <span class="post-note-chip">{{ readingMood }}</span>
      <span class="post-meta-inline">{{ post.wordCount }} 字 · {{ post.sections.length }} 节</span>
    </div>

    <div class="post-meta editorial-post-meta">
      <span class="meta-chip">{{ post.date }}</span>
      <span class="meta-chip">{{ post.category }}</span>
      <span class="meta-chip">{{ post.readingTime }}</span>
    </div>

    <h3>{{ post.title }}</h3>
    <p>{{ post.summary }}</p>

    <div class="post-card-footer editorial-post-footer">
      <div class="tag-row compact-tags">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag-chip small">{{ tag }}</span>
      </div>
      <div class="post-reading-hint">先看摘要，再决定是不是现在点开</div>
    </div>
  </article>
  </RouterLink>
</template>
