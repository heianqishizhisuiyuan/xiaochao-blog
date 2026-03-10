<script setup lang="ts">
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { useSeo } from '../composables/useSeo'
import { categories, featuredPosts, homeStatus, siteMeta } from '../data/content'

const homePrinciples = [
  '写清楚真实判断，而不是包装成项目成果。',
  '让首页先服务阅读，再服务展示。',
  '把持续更新感做出来，而不是只做一次好看的封面。'
]

useSeo({
  title: '首页',
  description: siteMeta.description,
  path: '/'
})
</script>

<template>
  <div class="page-shell aurora-bg">
    <SiteHeader />

    <main>
      <section class="hero-section editorial-hero">
        <div class="hero-copy editorial-hero-copy">
          <div class="hero-badge">个人写作现场 / 博客首页</div>
          <h1>{{ homeStatus.introTitle }}</h1>
          <p>{{ homeStatus.introDescription }}</p>

          <div class="hero-actions">
            <RouterLink to="/posts"><el-button type="primary" size="large" round>开始读文章</el-button></RouterLink>
            <RouterLink to="/notes"><el-button plain size="large" round>翻翻最近随记</el-button></RouterLink>
          </div>
        </div>

        <aside class="glass-panel hero-focus-card editorial-focus-card">
          <div class="section-kicker">现在主要在写</div>
          <ul class="focus-list compact-focus-list">
            <li v-for="item in homeStatus.nowDoing" :key="item">{{ item }}</li>
          </ul>
          <RouterLink to="/about" class="section-link hero-inline-link">了解这个站为什么这样做 →</RouterLink>
        </aside>
      </section>

      <section class="home-editorial-strip">
        <article class="glass-panel editorial-note-card">
          <div class="section-kicker">首页原则</div>
          <ul class="info-list editorial-list">
            <li v-for="item in homePrinciples" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="glass-panel editorial-note-card mellow-card">
          <div class="section-kicker">阅读入口</div>
          <p>
            如果你第一次来，建议先看推荐阅读；如果想知道我最近到底在忙什么，直接去随记。
            这个站不追求“信息一次说全”，更在意你能不能顺着它自然走进去。
          </p>
        </article>
      </section>

      <section class="section-head compact-section-head">
        <div>
          <div class="section-kicker">Writing Directions</div>
          <h2>最近这块博客主要围着三件事在长</h2>
        </div>
      </section>

      <section class="feature-grid reading-directions-grid editorial-direction-grid">
        <article v-for="item in categories" :key="item.slug" class="glass-panel feature-card direction-card editorial-direction-card">
          <div class="section-kicker">{{ item.name }}</div>
          <p>{{ item.desc }}</p>
        </article>
      </section>

      <section class="section-head">
        <div>
          <div class="section-kicker">Featured Posts</div>
          <h2>推荐从这里开始读</h2>
        </div>
        <RouterLink to="/posts" class="section-link">查看全部文章 →</RouterLink>
      </section>

      <section class="posts-grid refined-posts-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
