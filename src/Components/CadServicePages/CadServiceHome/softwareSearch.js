const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')

const tokenize = (value) => normalize(value).split(/[\s\-_/]+/).filter(Boolean)

const getAcronyms = (label) => {
  const acronyms = new Set()
  const tokens = tokenize(label)

  if (tokens.length) {
    acronyms.add(tokens.map((token) => token[0]).join(''))
  }

  const camelParts = String(label || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s\-_/]+/)
    .filter(Boolean)

  if (camelParts.length > 1) {
    acronyms.add(camelParts.map((part) => part[0]).join(''))
  }

  return [...acronyms].map((acronym) => acronym.toLowerCase())
}

const fuzzyMatch = (text, query) => {
  let queryIndex = 0
  for (let i = 0; i < text.length && queryIndex < query.length; i += 1) {
    if (text[i] === query[queryIndex]) queryIndex += 1
  }
  return queryIndex === query.length
}

const scoreSoftwareLabel = (label, query) => {
  const normalizedLabel = normalize(label)
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return 0

  if (normalizedLabel === normalizedQuery) return 1000
  if (normalizedLabel.startsWith(normalizedQuery)) return 900

  const labelTokens = tokenize(label)
  const queryTokens = tokenize(query)

  if (queryTokens.length > 1) {
    const allTokensPrefix = queryTokens.every((queryToken) =>
      labelTokens.some((labelToken) => labelToken.startsWith(queryToken))
    )
    if (allTokensPrefix) return 850

    const allTokensIncluded = queryTokens.every((queryToken) => normalizedLabel.includes(queryToken))
    if (allTokensIncluded) return 750
  }

  if (labelTokens.some((labelToken) => labelToken.startsWith(normalizedQuery))) return 800
  if (normalizedLabel.includes(normalizedQuery)) return 700

  const acronymMatches = getAcronyms(label).some((acronym) =>
    acronym.startsWith(normalizedQuery.replace(/\s/g, ''))
  )
  if (acronymMatches) return 650

  if (fuzzyMatch(normalizedLabel.replace(/\s/g, ''), normalizedQuery.replace(/\s/g, ''))) {
    return 400 + Math.max(0, 120 - normalizedLabel.length)
  }

  return -1
}

export function searchSoftwareOptions(options, query, limit = 25) {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return options.slice(0, limit)
  }

  return options
    .map((option) => ({
      option,
      score: scoreSoftwareLabel(option.label, normalizedQuery),
    }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.option.label.localeCompare(b.option.label)
    })
    .slice(0, limit)
    .map(({ option }) => option)
}
