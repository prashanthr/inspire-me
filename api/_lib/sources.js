'use strict'

// Comic sources. To add a comic, append an entry; to remove one, delete it
// (or set `disabled: true`).
//
//   gocomics: { name, slug, start: [year, month, day] }
//     - `name` is what ?sources=<name> filters on (letters, digits, - and _ only)
//     - `slug` is the path on https://www.gocomics.com/<slug>
//     - `start` is when the archive begins (month is 1-12). Dates are picked at
//       random between `start` and yesterday. If a strip ended, or a random date
//       has no strip, the API just retries with another one.
//   xkcd: handled separately via xkcd's official JSON API.

const gocomics = (name, slug, start, extra = {}) => ({
  name,
  type: 'gocomics',
  slug,
  start,
  ...extra
})

const sources = [
  { name: 'xkcd', type: 'xkcd' },
  gocomics('arloandjanis', 'arloandjanis', [1999, 1, 1]),
  gocomics('the-awkward-yeti', 'the-awkward-yeti', [2014, 10, 8]),
  gocomics('calvin', 'calvinandhobbes', [2012, 1, 1]),
  gocomics('beardo', 'beardo', [2011, 4, 1]),
  gocomics('breakofday', 'break-of-day', [2011, 9, 29]),
  gocomics('thedailydrawing', 'the-daily-drawing', [2015, 2, 19]),
  gocomics('liz-climo-cartoons', 'liz-climo-cartoons', [2018, 4, 26]),
  gocomics('garfield', 'garfield', [1978, 6, 19]),
  gocomics('lunarbaboon', 'lunarbaboon', [2015, 12, 2]),
  gocomics('brevity', 'brevity', [2005, 2, 3]),
  gocomics('fminus', 'fminus', [2005, 6, 10]),
  gocomics('poochcafe', 'poochcafe', [2003, 5, 27]),
  gocomics('peanuts', 'peanuts', [1950, 10, 2]),
  gocomics('closetohome', 'closetohome', [1992, 12, 7]),
  gocomics('wizardofid', 'wizardofid', [2002, 1, 1]),
  gocomics('darksideofthehorse', 'darksideofthehorse', [2010, 6, 25]),
  gocomics('pickles', 'pickles', [2003, 1, 1]),
  gocomics('herman', 'herman', [1997, 6, 2]),
  gocomics('reallifeadventures', 'reallifeadventures', [1998, 1, 1]),
  gocomics('offthemark', 'offthemark', [2002, 9, 2]),
  gocomics('duplex', 'duplex', [1996, 8, 12]),
  gocomics('wumo', 'wumo', [2013, 10, 13])
]

// Removed: dilbert (archive no longer available), devhumor and commitstrip
// (were already disabled).

module.exports = { sources: sources.filter((source) => !source.disabled) }
