import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { archiveGroups } from '../data/content'

export type TimelineItem = {
  key: string
  label: string
  year: string
  monthLabel: string
  count: number
  to: string
}

export const buildTimeline = (activeYear: string) => {
  const group = archiveGroups.find((g) => g.year === activeYear) ?? archiveGroups[0]
  const year = group?.year ?? ''
  const items: TimelineItem[] = (group?.months ?? []).map((m) => ({
    key: m.key,
    label: `${year} · ${m.name}`,
    year,
    monthLabel: m.name,
    count: m.count,
    to: `/archive?year=${encodeURIComponent(year)}#archive-${m.key}`
  }))

  return { year, items }
}

export const pickDefaultIndex = (items: TimelineItem[]) => {
  // Prefer first month with content; fallback to first.
  const idx = items.findIndex((i) => i.count > 0)
  return idx >= 0 ? idx : 0
}

export const readYearFromRoute = (route: RouteLocationNormalizedLoaded) => {
  const raw = typeof route.query.year === 'string' ? route.query.year : ''
  const years = archiveGroups.map((y) => y.year)
  if (raw && years.includes(raw)) return raw
  return years[0] ?? ''
}
