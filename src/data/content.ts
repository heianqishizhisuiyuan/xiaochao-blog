import { siteConfig } from '../config/site'

export type PostSection = {
  id: string
  title: string
  paragraphs: string[]
}

export type Post = {
  slug: string
  title: string
  summary: string
  category: string
  tags: string[]
  date: string
  readingTime: string
  featured?: boolean
  cover: string
  content: string[]
  sections: PostSection[]
  wordCount: number
  year: string
  month: string
}

export const siteMeta = {
  name: siteConfig.name,
  tagline: '记录技术、内容与工作流，也保留一些还没写成文章的念头。',
  description: siteConfig.description
}

export const homeStatus = {
  badge: '每日更新 · 技术与生活',
  introTitle: '一个持续更新的个人博客：AI × Vue × 生活',
  introDescription:
    '这里每天更新三类内容：AI 与前端协作、Vue 技术进阶、以及山东家庭种植的生活分享。写得更实用，也更能长期复用。',
  nowDoing: [
    '每天 8:00（北京时间）发布 3 篇新内容。',
    'AI：聚焦前端落地场景与工具链，提供可执行步骤与参考来源。',
    '生活：结合山东四季的家庭种植指南，配图并标注许可来源。'
  ]
}

export const categories = [
  {
    name: '前端与页面',
    slug: 'frontend-interaction',
    desc: '主要写界面、信息层级、阅读体验和那些看似细小但很影响气质的取舍。'
  },
  {
    name: '内容与结构',
    slug: 'product-content',
    desc: '写博客怎么组织、内容怎么长、首页和栏目为什么不该像货架。'
  },
  {
    name: 'AI 与工作流',
    slug: 'workflow-systems',
    desc: '记录协作流程、系统搭建、长期维护，以及真正落地时的现实问题。'
  }
]

type Frontmatter = Record<string, string>

type StatusNote = {
  slug: string
  title: string
  summary: string
  type?: string
  updatedAt?: string
  items: string[]
}

type ArchiveItem = {
  slug: string
  title: string
  date: string
  readingTime: string
  category: string
}

const rawModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

const rawNoteModules = import.meta.glob('../content/notes/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
}) as Record<string, string>

function parseFrontmatter(raw: string): { meta: Frontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!match) {
    return {
      meta: {},
      body: raw.trim()
    }
  }

  const frontmatter = match[1] ?? ''
  const body = match[2] ?? ''
  const meta = Object.fromEntries(
    frontmatter
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf(':')
        const key = line.slice(0, index).trim()
        const value = line.slice(index + 1).trim()
        return [key, value]
      })
  ) as Frontmatter

  return {
    meta,
    body: body.trim()
  }
}

function deriveSectionTitle(text: string, index: number) {
  const normalized = text.replace(/[*#>`_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  const sentence = normalized.split(/[。！？.!?]/)[0]?.trim() ?? ''
  const shortTitle = sentence.slice(0, 22).trim()

  if (!shortTitle) {
    return `内容片段 ${index + 1}`
  }

  return shortTitle.length < sentence.length ? `${shortTitle}…` : shortTitle
}

function createStatusNote(slug: string, raw: string): StatusNote {
  const { meta, body } = parseFrontmatter(raw)
  const items = body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s+/, '').trim())

  return {
    slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? '',
    type: meta.type,
    updatedAt: meta.updatedAt,
    items
  }
}

function createSections(body: string) {
  const lines = body.split('\n')
  const sections: PostSection[] = []
  let currentTitle = ''
  let buffer: string[] = []

  const pushSection = () => {
    const paragraphs = buffer.map((item) => item.trim()).filter((item): item is string => Boolean(item))

    if (!paragraphs.length) {
      buffer = []
      return
    }

    const index = sections.length
    sections.push({
      id: `section-${index + 1}`,
      title: currentTitle || deriveSectionTitle(paragraphs[0] ?? '', index),
      paragraphs
    })

    buffer = []
    currentTitle = ''
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      return
    }

    if (trimmed.startsWith('## ')) {
      pushSection()
      currentTitle = trimmed.replace(/^##\s+/, '').trim()
      return
    }

    if (trimmed.startsWith('# ')) {
      return
    }

    buffer.push(trimmed)
  })

  pushSection()

  return sections.length
    ? sections
    : [
        {
          id: 'section-1',
          title: '正文',
          paragraphs: [body.trim()]
        }
      ]
}

const statusNotes = Object.entries(rawNoteModules)
  .map(([path, raw]) => {
    const file = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    return createStatusNote(file, raw)
  })

const parsedPosts = Object.entries(rawModules)
  .map(([path, raw]) => {
    const file = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    const { meta, body } = parseFrontmatter(raw)
    const sections = createSections(body)
    const content = sections.flatMap((section) => section.paragraphs)
    const wordCount = body.replace(/\s+/g, '').length
    const date = meta.date ?? ''

    return {
      slug: file,
      title: meta.title ?? file,
      summary: meta.summary ?? '',
      category: meta.category ?? '随记',
      tags: meta.tags ? meta.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
      date,
      readingTime: meta.readingTime ?? '5 min',
      featured: meta.featured === 'true',
      cover: meta.cover ?? 'Post Cover',
      content,
      sections,
      wordCount,
      year: date.slice(0, 4),
      month: date.slice(0, 7)
    } satisfies Post
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const posts: Post[] = parsedPosts
export const featuredPosts = posts.filter((post) => post.featured)
export const recentPosts = posts.slice(0, 4)
export const popularTags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8)
export const statusNoteMap = Object.fromEntries(statusNotes.map((note) => [note.slug, note])) as Record<string, StatusNote>

export const archiveGroups = Object.entries(
  posts.reduce<Record<string, Record<string, ArchiveItem[]>>>((acc, post) => {
    const yearBucket = acc[post.year] ?? (acc[post.year] = {})
    const monthBucket = yearBucket[post.month] ?? (yearBucket[post.month] = [])

    monthBucket.push({
      slug: post.slug,
      title: post.title,
      date: post.date,
      readingTime: post.readingTime,
      category: post.category
    })

    return acc
  }, {})
)
  .sort(([a], [b]) => b.localeCompare(a))
  .map(([year, months]) => {
    const monthEntries = Object.entries(months).sort(([a], [b]) => b.localeCompare(a))

    return {
      year,
      total: monthEntries.reduce((sum, [, items]) => sum + items.length, 0),
      months: monthEntries.map(([month, items]) => ({
        key: month,
        name: `${month.slice(5, 7)} 月`,
        count: items.length,
        items: items.sort((a, b) => b.date.localeCompare(a.date))
      }))
    }
  })
