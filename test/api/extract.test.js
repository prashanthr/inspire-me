'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { extractGoComicsImage, formatLongDate, formatPathDate } = require('../../api/_lib/extract')

const date = new Date(Date.UTC(2022, 2, 31))

// Mirrors what GoComics renders: the requested strip plus unrelated strips,
// each with alt text that names its own date.
const page = `
<html><head><title>GoComics</title></head><body>
<img alt="undefined for November 20, 2026" src="https://featureassets.gocomics.com/assets/today?optimizer=image&amp;width=2800&amp;quality=85">
<img alt="Arlo and Janis, May 2, 1994" src="https://featureassets.gocomics.com/assets/old?optimizer=image&amp;width=2800&amp;quality=85">
<img alt="undefined for March 31, 2022" src="https://featureassets.gocomics.com/assets/target?optimizer=image&amp;width=2800&amp;quality=85">
<img alt="undefined for August 7, 2023" src="https://featureassets.gocomics.com/assets/other?optimizer=image&amp;width=2800&amp;quality=85">
<img alt="March 31, 2022" src="https://example.com/ad.png">
</body></html>`

test('formats dates the way GoComics does', () => {
  assert.strictEqual(formatPathDate(date), '2022/03/31')
  assert.strictEqual(formatLongDate(date), 'March 31, 2022')
})

test('picks the image whose alt names the requested date', () => {
  assert.strictEqual(
    extractGoComicsImage(page, date),
    'https://featureassets.gocomics.com/assets/target?optimizer=image&width=2800&quality=85'
  )
})

test('does not confuse November 2 with November 20', () => {
  const nov2 = new Date(Date.UTC(2026, 10, 2))
  assert.strictEqual(extractGoComicsImage(page, nov2), null)
})

test('returns null when the date is not on the page', () => {
  assert.strictEqual(extractGoComicsImage(page, new Date(Date.UTC(2001, 0, 1))), null)
})

test('ignores images from other hosts even if the alt matches', () => {
  const html = '<img alt="March 31, 2022" src="https://example.com/ad.png">'
  assert.strictEqual(extractGoComicsImage(html, date), null)
})

test('supports lazy-loaded data-src and srcset', () => {
  const lazy = '<img alt="Strip for March 31, 2022" data-src="https://featureassets.gocomics.com/assets/lazy">'
  assert.strictEqual(extractGoComicsImage(lazy, date), 'https://featureassets.gocomics.com/assets/lazy')
  const set = '<img alt="March 31, 2022" srcset="https://featureassets.gocomics.com/assets/set 2x, https://featureassets.gocomics.com/assets/set1 1x">'
  assert.strictEqual(extractGoComicsImage(set, date), 'https://featureassets.gocomics.com/assets/set')
})

test('falls back to og:image when the page has it', () => {
  const html = '<meta property="og:image" content="https://featureassets.gocomics.com/assets/og">'
  assert.strictEqual(extractGoComicsImage(html, date), 'https://featureassets.gocomics.com/assets/og')
})
