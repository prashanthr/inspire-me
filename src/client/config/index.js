const isProd = process.env.NODE_ENV.toLowerCase() === 'production'
const localPort = process.env.SERVICE_PORT || 9000

const localConfig = {
  apiBaseUrl: `http://localhost:${localPort}`,
  servicePort: 9000
}

const prodConfig = {
  apiBaseUrl: 'http://comical.site'
}

const overrides = isProd ? prodConfig : localConfig

const config = {
  ...overrides
}

export default config
