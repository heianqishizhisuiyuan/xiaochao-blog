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
  badge: '长期写作 / 慢更新 / 去企业化',
  introTitle: '把这里重做成更像个人博客的样子：安静一点，专业一点，也更像真实作者在场。',
  introDescription:
    '这里主要写技术、产品、AI 协作和内容系统，也会留下一些正在成形的判断。它不打算做成企业官网式的展示面，而是一块能长期生长、能反复回来的写作空间。',
  nowDoing: [
    '继续把页面语言从“展示项目”往“服务阅读”上收。',
    '补内容、补结构，同时清理不必要的品牌感和包装感。',
    '把博客里能复用的内容流程写成稳定模型，方便长期维护。'
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
