<script setup lang="ts">
const featuredPosts = [
  { title: '做一个有品牌感的博客首页', tag: 'Design System', desc: '用首屏叙事、卡片层次和动效，把博客从模板站拉成作品站。', date: '2026-03-08' },
  { title: 'Vue3 + Element Plus 如何做出高级感', tag: 'Frontend', desc: '不是堆组件，而是重做栅格、色板、间距和信息密度。', date: '2026-03-07' },
  { title: '从内容页到商业化页面的演进', tag: 'Product', desc: '博客不是只放文章，后面会自然长出订阅、项目页、服务页。', date: '2026-03-06' }
]

const featureCards = [
  { title: '内容品牌化', desc: '首页不只展示文章，还展示作者、项目、能力与产品感。' },
  { title: '炫酷但克制', desc: '用渐变、光晕、毛玻璃和卡片悬浮做高级感，不做廉价特效。' },
  { title: '可扩展架构', desc: '先静态博客，后续平滑接文章管理、订阅、评论和会员能力。' }
]
</script>

<template>
  <div class="page-shell aurora-bg">
    <header class="topbar glass-panel">
      <div class="brand">
        <div class="brand-mark">X</div>
        <div>
          <div class="brand-title">XiaoChao Blog</div>
          <div class="brand-sub">Future-facing content & product journal</div>
        </div>
      </div>
      <nav class="nav-links">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/posts">文章</RouterLink>
        <RouterLink to="/archive">归档</RouterLink>
        <RouterLink to="/about">关于</RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero-section">
        <div class="hero-copy">
          <div class="hero-badge">BLOG SYSTEM V1 / VUE3 / TS / ELEMENT PLUS</div>
          <h1>把博客做成一个有气质、能持续进化的作品站。</h1>
          <p>
            这不是一个普通的文章容器，而是一套兼顾内容表达、作者品牌、项目展示与后续商业化扩展的博客系统。
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" round>开始阅读</el-button>
            <el-button plain size="large" round>查看项目</el-button>
          </div>
          <div class="hero-stats">
            <div><strong>12</strong><span>精选文章</span></div>
            <div><strong>4</strong><span>主题栏目</span></div>
            <div><strong>∞</strong><span>持续更新</span></div>
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
        <article v-for="item in featureCards" :key="item.title" class="glass-panel feature-card">
          <div class="feature-dot"></div>
          <h3>{{ item.title }}</h3>
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
        <article v-for="post in featuredPosts" :key="post.title" class="glass-panel post-card">
          <div class="post-meta">
            <span>{{ post.tag }}</span>
            <span>{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.desc }}</p>
          <a href="#">阅读全文</a>
        </article>
      </section>
    </main>
  </div>
</template>
