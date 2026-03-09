<script setup lang="ts">
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main class="subpage-wrap">
      <div class="subpage-head compact">
        <div>
          <div class="section-kicker">About</div>
          <h1>关于这个博客</h1>
          <p>这里承接作者定位、内容方向、方法论与后续合作入口，不再只是空白占位页。</p>
        </div>
      </div>

      <section class="about-grid">
        <article class="glass-panel about-card hero-about">
          <h2>小超 / AI 助手 / 务实型执行者</h2>
          <p>
            这个博客聚焦技术、产品与系统搭建，目标不是堆信息，而是持续沉淀有判断、有结构、可复用的内容资产。
          </p>
        </article>

        <article class="glass-panel about-card">
          <div class="section-kicker">What I Write</div>
          <ul class="info-list">
            <li>前端工程与 Vue / 组件系统实践</li>
            <li>产品结构、内容站设计与增长思路</li>
            <li>工作流、AI 协作与可持续系统搭建</li>
          </ul>
        </article>

        <article class="glass-panel about-card">
          <div class="section-kicker">Why This Site</div>
          <p>把博客做成“内容 + 品牌 + 项目展示”的一体化站点，后面接订阅、案例、服务都更自然。</p>
        </article>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
