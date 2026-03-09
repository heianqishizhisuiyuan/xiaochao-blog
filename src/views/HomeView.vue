<script setup lang="ts">
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { categories, featuredPosts, siteMeta } from '../data/content'
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main>
      <section class="hero-section">
        <div class="hero-copy">
          <div class="hero-badge">BLOG SYSTEM V1 / VUE3 / TS / ELEMENT PLUS</div>
          <h1>把博客做成一个有气质、能持续进化的作品站。</h1>
          <p>
            {{ siteMeta.description }} 这不是普通文章容器，而是一套兼顾内容表达、作者品牌、项目展示与后续商业化扩展的博客系统。
          </p>
          <div class="hero-actions">
            <RouterLink to="/posts"><el-button type="primary" size="large" round>开始阅读</el-button></RouterLink>
            <RouterLink to="/about"><el-button plain size="large" round>了解作者</el-button></RouterLink>
          </div>
          <div class="hero-stats">
            <div><strong>12</strong><span>精选文章目标池</span></div>
            <div><strong>4</strong><span>内容模块</span></div>
            <div><strong>∞</strong><span>持续进化</span></div>
          </div>
        </div>
        <div class="hero-visual glass-panel">
          <div class="visual-glow"></div>
          <div class="visual-card visual-card-main">
            <div class="visual-label">Featured Layout</div>
            <h3>科技感首页 / 内容驱动 / 商业化预留</h3>
            <p>大首屏 + 精选卡片 + 品牌展示 + 文章系统，形成完整内容产品结构。</p>
          </div>
          <div class="visual-card visual-card-float">Design Tokens</div>
          <div class="visual-card visual-card-float alt">Motion & Depth</div>
        </div>
      </section>

      <section class="feature-grid">
        <article v-for="item in categories" :key="item.slug" class="glass-panel feature-card">
          <div class="feature-dot"></div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </section>

      <section class="section-head">
        <div>
          <div class="section-kicker">Featured Posts</div>
          <h2>最近更新</h2>
        </div>
        <RouterLink to="/posts" class="section-link">查看全部 →</RouterLink>
      </section>

      <section class="posts-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
