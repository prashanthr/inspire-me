# inspire-me (Kinda Comical)

Objective: Spark daily inspiration/motivation with a random comic strip.

Hosted on Vercel at https://kinda-comical.vercel.app/.

- **Frontend:** Create React App (`src/`)
- **API:** Vercel serverless functions (`api/`)
  - `GET /api/inspire[?sources=calvin,garfield]` returns a random comic
  - `GET /api/health`

## Comic sources

Currently only **xkcd** is served, through its official JSON API. All GoComics
sources are disabled in `api/_lib/sources.js` (`disabled: true`): GoComics
updated its site and now answers server-side requests with a JavaScript
challenge (HTTP 403), so their strips can't be fetched. A `?sources=` name that
is disabled falls back to the enabled sources.

Edit `api/_lib/sources.js` to add or remove comics. GoComics strips (when
enabled) are fetched from `https://www.gocomics.com/<slug>/<yyyy>/<mm>/<dd>` and the strip
image is taken from the page's `<img>` whose alt text names that date. Missing
dates and failing sources are retried with another random pick.

## Development

```sh
yarn            # install
yarn start      # vercel dev: serves the app and /api together
yarn test       # unit tests for the API (node --test)
```
