'use strict'

const test = require('node:test')
const assert = require('node:assert')

const gocomicsPage = (date) => `<img alt="x for ${date}" src="https://featureassets.gocomics.com/assets/abc">`
const longDateFor = (url) => {
  const [, y, m, d] = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})$/)
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[Number(m) - 1]} ${Number(d)}, ${y}`
}

const makeRes = () => {
  const res = { headers: {} }
  res.setHeader = (k, v) => { res.headers[k] = v }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (body) => { res.body = body; return res }
  return res
}

const sourcesPath = require.resolve('../../api/_lib/sources')

// GoComics sources are disabled in the real list. The tests that exercise the
// (kept) GoComics resolver swap in an enabled list so it stays covered for
// when GoComics is re-enabled.
const enabledGoComics = [
  { name: 'xkcd', type: 'xkcd' },
  { name: 'calvin', type: 'gocomics', slug: 'calvinandhobbes', start: [2012, 1, 1] },
  { name: 'peanuts', type: 'gocomics', slug: 'peanuts', start: [1950, 10, 2] },
  { name: 'garfield', type: 'gocomics', slug: 'garfield', start: [1978, 6, 19] }
]

const loadHandler = ({ goComicsEnabled = false } = {}) => {
  delete require.cache[require.resolve('../../api/inspire')]
  delete require.cache[require.resolve('../../api/_lib/comic')]
  delete require.cache[sourcesPath]
  if (goComicsEnabled) {
    require.cache[sourcesPath] = {
      id: sourcesPath,
      filename: sourcesPath,
      loaded: true,
      exports: { sources: enabledGoComics }
    }
  }
  return require('../../api/inspire')
}

const xkcdFetch = (urls = []) => async (url) => {
  urls.push(url)
  if (url === 'https://xkcd.com/info.0.json') return { ok: true, json: async () => ({ num: 3000 }) }
  if (/^https:\/\/xkcd\.com\/\d+\/info\.0\.json$/.test(url)) {
    return { ok: true, json: async () => ({ img: 'https://imgs.xkcd.com/comics/x.png' }) }
  }
  throw new Error(`unexpected fetch ${url}`)
}

test('only xkcd is enabled; every GoComics source is disabled', () => {
  delete require.cache[sourcesPath]
  const { sources } = require('../../api/_lib/sources')
  assert.deepStrictEqual(sources.map((source) => source.name), ['xkcd'])
})

test('serves xkcd from its official API, without touching GoComics', async () => {
  const urls = []
  global.fetch = xkcdFetch(urls)
  const res = makeRes()
  await loadHandler()({ query: {} }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.body.data, 'https://imgs.xkcd.com/comics/x.png')
  assert.strictEqual(res.body.source.name, 'xkcd')
  assert.match(res.body.source.url, /^https:\/\/xkcd\.com\/\d+\/$/)
  assert.ok(urls.length > 0 && urls.every((url) => url.startsWith('https://xkcd.com/')))
})

test('a disabled GoComics source in ?sources= falls back to xkcd, never GoComics', async () => {
  const urls = []
  global.fetch = xkcdFetch(urls)
  const res = makeRes()
  await loadHandler()({ query: { sources: 'calvin' } }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.body.source.name, 'xkcd')
  assert.ok(urls.every((url) => !url.includes('gocomics')))
})

test('returns the client response shape for a GoComics strip', async () => {
  global.fetch = async (url) => ({
    ok: true,
    text: async () => gocomicsPage(longDateFor(url))
  })
  const res = makeRes()
  await loadHandler({ goComicsEnabled: true })({ query: { sources: 'calvin' } }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.headers['Cache-Control'], 'no-store')
  assert.strictEqual(res.body.data, 'https://featureassets.gocomics.com/assets/abc')
  assert.strictEqual(res.body.source.name, 'calvin')
  assert.match(res.body.source.url, /^https:\/\/www\.gocomics\.com\/calvinandhobbes\/\d{4}\/\d{2}\/\d{2}$/)
})

test('retries other picks when a strip is missing', async () => {
  let calls = 0
  global.fetch = async (url) => {
    calls += 1
    if (calls < 3) {
      return { ok: false, status: 404 }
    }
    return { ok: true, text: async () => gocomicsPage(longDateFor(url)) }
  }
  const res = makeRes()
  await loadHandler({ goComicsEnabled: true })({ query: { sources: 'peanuts' } }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(calls, 3)
})

test('treats sources=null (old client) as all sources, and handles xkcd', async () => {
  global.fetch = async (url) => {
    if (url === 'https://xkcd.com/info.0.json') return { ok: true, json: async () => ({ num: 3000 }) }
    if (/xkcd\.com\/\d+\/info\.0\.json/.test(url)) return { ok: true, json: async () => ({ img: 'https://imgs.xkcd.com/comics/x.png' }) }
    return { ok: true, text: async () => gocomicsPage(longDateFor(url)) }
  }
  const res = makeRes()
  await loadHandler({ goComicsEnabled: true })({ query: { sources: 'null' } }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.ok(res.body.data)
})

test('returns 502 when every attempt fails', async () => {
  global.fetch = async () => ({ ok: false, status: 500 })
  const res = makeRes()
  await loadHandler({ goComicsEnabled: true })({ query: { sources: 'garfield' } }, res)
  assert.strictEqual(res.statusCode, 502)
  assert.ok(res.body.error)
})

test('logs who refused us on a 403, without leaking details to the client', async () => {
  global.fetch = async () => ({
    ok: false,
    status: 403,
    headers: new Headers([
      ['server', 'cloudflare'],
      ['cf-ray', 'abc123-IAD'],
      ['content-type', 'text/html'],
      ['authorization-echo', 'should-not-be-logged']
    ]),
    text: async () => '<html><script>var x=1</script><body><h1>Just a moment...</h1></body></html>'
  })
  const logged = []
  const original = console.error
  console.error = (...args) => logged.push(args.join(' '))
  const res = makeRes()
  try {
    await loadHandler({ goComicsEnabled: true })({ query: { sources: 'garfield' } }, res)
  } finally {
    console.error = original
  }
  assert.strictEqual(res.statusCode, 502)
  assert.ok(!JSON.stringify(res.body).includes('cloudflare'))
  const details = logged.find((line) => line.startsWith('API Refusal details'))
  assert.ok(details, 'refusal details are logged')
  assert.match(details, /server=cloudflare/)
  assert.match(details, /cf-ray=abc123-IAD/)
  assert.match(details, /Just a moment/)
  assert.ok(!details.includes('should-not-be-logged'))
  assert.ok(!details.includes('var x=1'))
})
