import { watchEffect } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { siteConfig } from '../config/site'

type SeoInput = {
  title?: MaybeRefOrGetter<string | undefined>
  description?: MaybeRefOrGetter<string | undefined>
  path?: MaybeRefOrGetter<string | undefined>
  type?: MaybeRefOrGetter<string | undefined>
}

function ensureMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

export function useSeo(input: SeoInput) {
  watchEffect(() => {
    const rawTitle = toValue(input.title)?.trim()
    const title = rawTitle ? `${rawTitle} | ${siteConfig.title}` : siteConfig.title
    const description = toValue(input.description)?.trim() || siteConfig.description
    const path = toValue(input.path) || '/'
    const type = toValue(input.type) || 'website'
    const url = new URL(path, siteConfig.url).toString()

    document.title = title

    ensureMeta('meta[name="description"]', { name: 'description', content: description })
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
  })
}
