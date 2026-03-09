<script setup lang="ts">
import PostCard from '../components/PostCard.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteHeader from '../components/SiteHeader.vue'
import { useSeo } from '../composables/useSeo'
import { categories, featuredPosts, homeStatus, siteMeta, statusNoteMap } from '../data/content'

const reading = statusNoteMap['currently-reading']
const quick = statusNoteMap['quick-notes']
const upcoming = statusNoteMap['upcoming-notes']
const watching = statusNoteMap['now-watching']

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
      <section class="hero-section debranded-hero">
        <div class="hero-copy">
          <div class="hero-badge">{{ homeStatus.badge }}</div>
          <h1>{{ homeStatus.introTitle }}</h1>
          <p>{{ homeStatus.introDescription }}</p>
          <div class="hero-actions">
            <RouterLink to="/posts"><el-button type="primary" size="large" round>先看看最近写的</el-button></RouterLink>
            <RouterLink to="/about"><el-button plain size="large" round>顺手认识一下我</el-button></RouterLink>
          </div>
        </div>

        <div class="hero-visual glass-panel author-desk-panel">
          <div class="visual-glow"></div>

          <div class="visual-card visual-card-main status-card">
            <div class="visual-label">最近在忙</div>
            <ul class="status-list compact-status-list">
              <li v-for="item in homeStatus.nowDoing" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="visual-card note-card note-card-left" v-if="upcoming">
            <div class="visual-label">{{ upcoming.title }}</div>
            <ul class="status-list small-status-list">
              <li v-for="item in upcoming.items" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="visual-card note-card note-card-right" v-if="quick">
            <div class="visual-label">{{ quick.title }}</div>
            <p v-for="item in quick.items.slice(0, 2)" :key="item">{{ item }}</p>
          </div>
        </div>
      </section>

      <section class="home-status-grid">
        <article class="glass-panel status-block" v-if="reading">
          <div class="section-kicker">{{ reading.title }}</div>
          <ul class="status-list home-status-list">
            <li v-for="item in reading.items" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="glass-panel status-block" v-if="watching">
          <div class="section-kicker">{{ watching.title }}</div>
          <ul class="status-list home-status-list">
            <li v-for="item in watching.items" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="glass-panel status-block" v-if="quick">
          <div class="section-kicker">{{ quick.title }}</div>
          <ul class="status-list home-status-list">
            <li v-for="item in quick.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </section>

      <section class="section-head compact-section-head">
        <div>
          <div class="section-kicker">Reading Directions</div>
          <h2>最近常写的几个方向</h2>
        </div>
      </section>

      <section class="feature-grid reading-directions-grid">
        <article v-for="item in categories" :key="item.slug" class="glass-panel feature-card direction-card">
          <div class="feature-dot"></div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.desc }}</p>
        </article>
      </section>

      <section class="section-head">
        <div>
          <div class="section-kicker">Recent Notes</div>
          <h2>最近写的</h2>
        </div>
        <RouterLink to="/notes" class="section-link">去随记页逛逛 →</RouterLink>
      </section>

      <section class="posts-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
