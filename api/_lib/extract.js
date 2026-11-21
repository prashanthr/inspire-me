'use strict'

// Helpers for pulling a comic image URL out of a GoComics page.
// Kept free of network calls so they can be unit tested against fixtures.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const COMIC_ASSET_HOSTS = ['featureassets.gocomics.com', 'assets.amuniversal.com']

const pad = (n) => String(n).padStart(2, '0')

// GoComics page path segment, e.g. 2022/03/31
const formatPathDate = (date) =>
  `${date.getUTCFullYear()}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}`

// The way GoComics words the date in image alt text, e.g. "March 31, 2022"
const formatLongDate = (date) =>
  `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const parseAttributes = (tag) => {
  const attrs = {}
  const attrRegex = /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
  let match
  while ((match = attrRegex.exec(tag)) !== null) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[2] !== undefined ? match[2] : match[3])
  }
  return attrs
}

const isComicAsset = (url) => {
  try {
    const { hostname, protocol } = new URL(url)
    return protocol === 'https:' && COMIC_ASSET_HOSTS.includes(hostname)
  } catch (err) {
    return false
  }
}

const firstSrcsetUrl = (srcset) =>
  srcset ? srcset.split(',')[0].trim().split(/\s+/)[0] : null

// Candidate image URLs on an <img> tag, in order of preference
const imageUrlsFromAttrs = (attrs) =>
  [attrs.src, attrs['data-src'], firstSrcsetUrl(attrs.srcset)].filter(Boolean)

const extractMetaImage = (html) => {
  const metaRegex = /<meta\b[^>]*>/gi
  let match
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[0])
    const key = (attrs.property || attrs.name || '').toLowerCase()
    if ((key === 'og:image' || key === 'twitter:image') && isComicAsset(attrs.content)) {
      return attrs.content
    }
  }
  return null
}

/**
 * Find the strip image for `date` on a GoComics comic page.
 *
 * GoComics pages list several strips (the requested date plus related and
 * random ones), so we only accept an image whose alt text names the requested
 * date. That also protects us from pages that fall back to "today's" strip when
 * the requested date doesn't exist.
 *
 * Returns the image URL or null.
 */
const extractGoComicsImage = (html, date) => {
  const longDate = formatLongDate(date)
  const dateRegex = new RegExp(`(^|[^\\d])${longDate.replace(/ /g, '\\s+')}`)

  const imgRegex = /<img\b[^>]*>/gi
  let match
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[0])
    if (!attrs.alt || !dateRegex.test(attrs.alt)) {
      continue
    }
    const url = imageUrlsFromAttrs(attrs).find(isComicAsset)
    if (url) {
      return url
    }
  }

  // Older markup exposed the strip via social meta tags
  return extractMetaImage(html)
}

module.exports = {
  formatPathDate,
  formatLongDate,
  extractGoComicsImage,
  extractMetaImage,
  isComicAsset
}
