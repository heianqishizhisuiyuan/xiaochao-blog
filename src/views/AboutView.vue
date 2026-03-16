<script setup lang="ts">
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { useSeo } from '../composables/useSeo'


useSeo({
  title: '关于',
  description: '关于页（占位）。',
  path: '/about'
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="subpage-wrap about-page-wrap">
      <section class="glass-panel about-card">
        <h1>关于</h1>
        <p>这页暂时留空。</p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
