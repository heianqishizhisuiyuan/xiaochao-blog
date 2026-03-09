import { siteConfig } from '../config/site'

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
}

export const siteMeta = {
  name: siteConfig.name,
  tagline: 'Future-facing content & product journal',
  description: siteConfig.description
}

export const categories = [
  {
    name: 'Frontend',
    slug: 'frontend',
    desc: 'Vue、工程化、交互与体验设计。'
  },
  {
    name: 'Product',
    slug: 'product',
    desc: '产品结构、增长、内容型产品思考。'
  },
  {
    name: 'Systems',
    slug: 'systems',
    desc: '工作流、系统搭建与长期可维护性。'
  }
]

type Frontmatter = Record<string, string>

const rawModules = import.meta.glob('../content/posts/*.md', {
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

const parsedPosts = Object.entries(rawModules)
  .map(([path, raw]) => {
    const file = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
    const { meta, body } = parseFrontmatter(raw)

    return {
      slug: file,
      title: meta.title ?? file,
      summary: meta.summary ?? '',
      category: meta.category ?? 'Notes',
      tags: meta.tags ? meta.tags.split(',').map((item) => item.trim()).filter(Boolean) : [],
      date: meta.date ?? '',
      readingTime: meta.readingTime ?? '5 min',
      featured: meta.featured === 'true',
      cover: meta.cover ?? 'Post Cover',
      content: body.split(/\n\s*\n/).map((item) => item.replace(/\n/g, ' ').trim()).filter(Boolean)
    } satisfies Post
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export const posts: Post[] = parsedPosts
export const featuredPosts = posts.filter((post) => post.featured)
export const recentPosts = posts.slice(0, 4)
export const popularTags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8)

export const archiveGroups = Object.entries(
  posts.reduce<Record<string, { slug: string; title: string; date: string }[]>>((acc, post) => {
    const year = post.date.slice(0, 4)
    if (!acc[year]) acc[year] = []
    acc[year].push({ slug: post.slug, title: post.title, date: post.date })
    return acc
  }, {})
)
  .sort(([a], [b]) => b.localeCompare(a))
  .map(([year, items]) => ({
    year,
    months: [
      {
        name: 'All Posts',
        count: items.length,
        items
      }
    ]
  }))
