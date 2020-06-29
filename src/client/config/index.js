const isProd = () => process.env.NODE_ENV.toLowerCase() === 'production'
const localPort = process.env.REACT_APP_SERVICE_PORT || 9000

const localConfig = {
  apiBaseUrl: `http://localhost:${localPort}`,
  servicePort: localPort
}

const prodConfig = {
  apiBaseUrl: 'https://comical.site'
}

const overrides = isProd() ? prodConfig : localConfig

const config = {
  ...overrides
}

export default config
