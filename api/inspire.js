'use strict'

const { getRandomComic } = require('./_lib/comic')

// ?sources=calvin,garfield limits the pool; anything else (including the
// literal "null" older clients sent) means "all sources".
const parseSources = (value) => {
  const raw = Array.isArray(value) ? value.join(',') : value
  if (!raw || raw === 'null' || raw === 'undefined') {
    return []
  }
  return raw
    .split(',')
    .map((name) => name.replace(/[^\w-]/g, ''))
    .filter(Boolean)
}

module.exports = async (req, res) => {
  // Every call should be a fresh random comic, so never cache.
  res.setHeader('Cache-Control', 'no-store')
  try {
    const comic = await getRandomComic(parseSources(req.query && req.query.sources))
    res.status(200).json(comic)
  } catch (err) {
    console.error('API Error', err.message)
    if (err.diagnostics) {
      // First refused response of this request (logs only, never returned to the client)
      console.error('API Refusal details', err.diagnostics)
    }
    res.status(502).json({ error: 'Could not fetch a comic right now. Please try again.' })
  }
}
