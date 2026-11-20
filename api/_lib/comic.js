'use strict'

const { sources } = require('./sources')
const { formatPathDate, extractGoComicsImage } = require('./extract')

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

const MAX_ATTEMPTS = 5
const ATTEMPT_TIMEOUT_MS = 4000
const TOTAL_BUDGET_MS = 9000

const sample = (list) => list[Math.floor(Math.random() * list.length)]

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Random UTC date between [y, m, d] (m is 1-12) and yesterday
const randomDate = ([y, m, d]) => {
  const start = Date.UTC(y, m - 1, d)
  const now = new Date()
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - 24 * 60 * 60 * 1000
  const day = new Date(start + Math.random() * (end - start))
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()))
}

const fetchWithTimeout = async (url, { timeoutMs, headers } = {}) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs || ATTEMPT_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': BROWSER_UA, 'accept-language': 'en-US,en;q=0.9', ...headers },
      redirect: 'follow',
      signal: controller.signal
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`)
    }
    return res
  } finally {
    clearTimeout(timer)
  }
}

const getGoComics = async (source, timeoutMs) => {
  const date = randomDate(source.start)
  const pageUrl = `https://www.gocomics.com/${source.slug}/${formatPathDate(date)}`
  const res = await fetchWithTimeout(pageUrl, { timeoutMs, headers: { accept: 'text/html' } })
  const imageUrl = extractGoComicsImage(await res.text(), date)
  if (!imageUrl) {
    throw new Error(`No strip image found at ${pageUrl}`)
  }
  return { pageUrl, imageUrl }
}

const getXkcd = async (source, timeoutMs) => {
  const latest = await (await fetchWithTimeout('https://xkcd.com/info.0.json', { timeoutMs })).json()
  let num = randomInt(1, latest.num)
  if (num === 404) {
    num = 405 // xkcd #404 is intentionally not found
  }
  const res = await fetchWithTimeout(`https://xkcd.com/${num}/info.0.json`, { timeoutMs })
  const comic = await res.json()
  return { pageUrl: `https://xkcd.com/${num}/`, imageUrl: comic.img }
}

const resolvers = { gocomics: getGoComics, xkcd: getXkcd }

const pickPool = (whitelist) => {
  const matching = sources.filter((source) => whitelist.includes(source.name))
  return matching.length > 0 ? matching : sources
}

/**
 * Get a random comic. Individual sources can fail (strip missing for that date,
 * page layout changed, upstream down), so keep trying other picks until one
 * works or we run out of attempts / time.
 */
const getRandomComic = async (whitelist = []) => {
  const pool = pickPool(whitelist)
  const deadline = Date.now() + TOTAL_BUDGET_MS
  const errors = []

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remaining = deadline - Date.now()
    if (remaining <= 500) {
      break
    }
    const source = sample(pool)
    try {
      const { pageUrl, imageUrl } = await resolvers[source.type](
        source,
        Math.min(ATTEMPT_TIMEOUT_MS, remaining)
      )
      return {
        source: { name: source.name, url: pageUrl, disableUnfurl: true, type: 'comic' },
        data: imageUrl
      }
    } catch (err) {
      errors.push(`${source.name}: ${err.message}`)
    }
  }

  const failure = new Error(`Could not fetch a comic: ${errors.join(' | ')}`)
  failure.attempts = errors
  throw failure
}

module.exports = { getRandomComic }
