const config = {
  // The API is served by the same Vercel app (see /api), so requests are
  // same-origin by default. Set REACT_APP_API_BASE_URL to point elsewhere.
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
  coffeeUrl: 'https://www.buymeacoffee.com/TGuwXOA',
  analytics: {
    google: {
      propertyId: 'UA-117106220-3'
    }
  }
}

export default config
