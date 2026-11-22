const INLINE_LINK = /\[([^\]\n]+)\]\((\/(?!\/)[^)\s]*)\)/g

/**
 * Split copy into text and same-site links.
 * Markdown form: [label](/path)
 * @param {string} text
 * @returns {Array<string | { label: string, href: string }>}
 */
export function parseCadResourceInline(text) {
  if (typeof text !== 'string' || text.length === 0) return [text ?? '']
  if (!text.includes('](')) return [text]

  const parts = []
  let last = 0
  for (const match of text.matchAll(INLINE_LINK)) {
    const start = match.index ?? 0
    if (start > last) parts.push(text.slice(last, start))
    parts.push({ label: match[1], href: match[2] })
    last = start + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length ? parts : [text]
}
