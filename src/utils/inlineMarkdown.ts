// Minimal, safe inline-markdown renderer for this blog.
// We intentionally support only a small subset:
// - links: [text](url)
// - images: ![alt](src)
// - inline code: `code`
// - bold: **text**
// - leading dash list item: "- xxx"
// Everything else is escaped to prevent HTML injection.

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(raw: string) {
  const url = raw.trim()
  // allow absolute http(s) and site-relative paths
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url
  return '#'
}

export function renderInlineMarkdown(raw: string) {
  const original = raw ?? ''

  // list item support (very lightweight)
  const isDashItem = original.trim().startsWith('- ')
  const text = isDashItem ? original.trim().slice(2).trim() : original

  // escape first, then add our limited tags
  let html = escapeHtml(text)

  // images: ![alt](src)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => {
    const safeSrc = escapeHtml(safeUrl(String(src)))
    const safeAlt = escapeHtml(String(alt ?? ''))
    return `<img class="md-img" src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`
  })

  // links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safeHref = escapeHtml(safeUrl(String(href)))
    const safeLabel = escapeHtml(String(label ?? ''))
    // Always open external links in a new tab.
    const target = safeHref.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a class="md-link" href="${safeHref}"${target}>${safeLabel}</a>`
  })

  // inline code: `code`
  html = html.replace(/`([^`]+)`/g, (_m, code) => `<code class="md-code">${escapeHtml(String(code))}</code>`)

  // bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, (_m, b) => `<strong>${escapeHtml(String(b))}</strong>`)

  if (isDashItem) {
    return `<div class="md-li"><span class="md-bullet">•</span><span class="md-li-text">${html}</span></div>`
  }

  return html
}
