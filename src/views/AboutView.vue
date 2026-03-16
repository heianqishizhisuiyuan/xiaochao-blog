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

        <p>
          曾经我沉迷于代码，坚信技术至上：只要把工具磨得足够锋利，就能无往不利。
          后来慢慢发现，真正决定一段路能走多远的，并不只有技术，还有生活的节奏、情绪的韧性，以及对自我的理解。
        </p>

        <p>
          现在更在意的是平衡：把工作做得更扎实，也把日子过得更从容。
          写作、整理与复盘，对我来说不再是“输出成果”，而是让内心更充实、更清醒的方式——
          把看过的、做过的、想明白的事留下一点痕迹。
        </p>

        <p>
          这个博客会持续写三类内容：
        </p>
        <ul class="info-list editorial-list">
          <li><strong>AI相关</strong>：概念讲透、工具选型、工作流落地，以及真实工程里会踩的坑。</li>
          <li><strong>Vue相关</strong>：从场景出发的 Vue 3 + TypeScript 实战，尽量给到可运行、可复用的写法。</li>
          <li><strong>生活趣事</strong>：一些家养植物与日常记录，提醒自己把注意力放回“生活本身”。</li>
        </ul>

        <p>
          未来的路，且行且看，保持期待。
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
