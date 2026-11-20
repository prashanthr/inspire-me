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

const loadHandler = () => {
  delete require.cache[require.resolve('../../api/inspire')]
  delete require.cache[require.resolve('../../api/_lib/comic')]
  return require('../../api/inspire')
}

test('returns the client response shape for a GoComics strip', async () => {
  global.fetch = async (url) => ({
    ok: true,
    text: async () => gocomicsPage(longDateFor(url))
  })
  const res = makeRes()
  await loadHandler()({ query: { sources: 'calvin' } }, res)
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
  await loadHandler()({ query: { sources: 'peanuts' } }, res)
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
  await loadHandler()({ query: { sources: 'null' } }, res)
  assert.strictEqual(res.statusCode, 200)
  assert.ok(res.body.data)
})

test('returns 502 when every attempt fails', async () => {
  global.fetch = async () => ({ ok: false, status: 500 })
  const res = makeRes()
  await loadHandler()({ query: { sources: 'garfield' } }, res)
  assert.strictEqual(res.statusCode, 502)
  assert.ok(res.body.error)
})
