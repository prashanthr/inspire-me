const isProd = () => process.env.NODE_ENV.toLowerCase() === 'production'
const localPort = process.env.REACT_APP_SERVICE_PORT || 9000

const defaultConfig = {
  coffeeUrl: 'https://www.buymeacoffee.com/TGuwXOA'
}

const localConfig = {
  apiBaseUrl: `http://localhost:${localPort}`,
  servicePort: localPort,
  ...defaultConfig
}

const prodConfig = {
  apiBaseUrl: 'https://comical.site',
  ...defaultConfig
}

const overrides = isProd() ? prodConfig : localConfig

const config = {
  ...overrides
}

export default config
