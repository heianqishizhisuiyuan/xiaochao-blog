<script setup lang="ts">
import { siteMeta } from '../data/content'
</script>

<template>
  <footer class="site-footer editorial-site-footer">
    <div>
      <strong>{{ siteMeta.name }}</strong>
      <p>{{ siteMeta.tagline }}</p>
    </div>
    <div class="footer-links">
      <RouterLink to="/posts">文章</RouterLink>
      <RouterLink to="/notes">随记</RouterLink>
      <RouterLink to="/archive">归档</RouterLink>
      <RouterLink to="/about">关于</RouterLink>
    </div>
  </footer>
</template>
