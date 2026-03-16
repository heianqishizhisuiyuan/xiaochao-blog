// Minimal, safe inline-markdown renderer for this blog.
// We intentionally support only a small subset:
// - links: [text](url)
// - images: ![alt](src)
// - inline code: `code`
// - bold: **text**
// - leading dash list item: "- xxx"
// Everything else is escaped to prevent HTML injection.
//
// NOTE: We implement a tiny parser (instead of simple regex) for links/images
// so URLs containing parentheses "(...)" still work.

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

function parseBracket(text: string, start: number, open: string, close: string) {
  if (text[start] !== open) return null
  const end = text.indexOf(close, start + 1)
  if (end === -1) return null
  return { value: text.slice(start + 1, end), end }
}

function parseParensBalanced(text: string, start: number) {
  if (text[start] !== '(') return null
  let depth = 0
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (ch === '(') depth++
    else if (ch === ')') {
      depth--
      if (depth === 0) {
        return { value: text.slice(start + 1, i), end: i }
      }
    }
  }
  return null
}

function renderLinksAndImages(input: string) {
  let out = ''
  let i = 0

  while (i < input.length) {
    // image: ![alt](src)
    if (input.startsWith('![', i)) {
      const altPart = parseBracket(input, i + 1, '[', ']')
      if (altPart && input[altPart.end + 1] === '(') {
        const urlPart = parseParensBalanced(input, altPart.end + 1)
        if (urlPart) {
          const alt = altPart.value
          const src = urlPart.value
          const safeSrc = escapeHtml(safeUrl(String(src)))
          const safeAlt = escapeHtml(String(alt ?? ''))
          out += `<img class="md-img" src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`
          i = urlPart.end + 1
          continue
        }
      }
    }

    // link: [label](href)
    if (input[i] === '[') {
      const labelPart = parseBracket(input, i, '[', ']')
      if (labelPart && input[labelPart.end + 1] === '(') {
        const urlPart = parseParensBalanced(input, labelPart.end + 1)
        if (urlPart) {
          const label = labelPart.value
          const href = urlPart.value
          const safeHref = escapeHtml(safeUrl(String(href)))
          const safeLabel = escapeHtml(String(label ?? ''))
          const target = safeHref.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''
          out += `<a class="md-link" href="${safeHref}"${target}>${safeLabel}</a>`
          i = urlPart.end + 1
          continue
        }
      }
    }

    out += escapeHtml(input[i] ?? '')
    i++
  }

  return out
}

export function renderInlineMarkdown(raw: string) {
  const original = raw ?? ''

  // list item support (very lightweight)
  const isDashItem = original.trim().startsWith('- ')
  const text = isDashItem ? original.trim().slice(2).trim() : original

  // render links/images + escape everything else
  let html = renderLinksAndImages(text)

  // inline code: `code`
  html = html.replace(/`([^`]+)`/g, (_m, code) => `<code class="md-code">${escapeHtml(String(code))}</code>`)

  // bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, (_m, b) => `<strong>${escapeHtml(String(b))}</strong>`)

  if (isDashItem) {
    return `<div class="md-li"><span class="md-bullet">•</span><span class="md-li-text">${html}</span></div>`
  }

  return html
}
