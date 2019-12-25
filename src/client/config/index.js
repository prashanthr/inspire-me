const isProd = process.env.NODE_ENV.toLowerCase() === 'production'

const baseConfig = {
  servicePort: 9000
}

const localConfig = {
  apiBaseUrl: 'http://localhost'
}

const prodConfig = {
  apiBaseUrl: 'http://comical.site'
}

const overrides = isProd ? prodConfig : localConfig

const config = {
  ...baseConfig,
  ...overrides
}

export default config
