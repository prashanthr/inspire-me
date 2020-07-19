import { isProd } from '../utils/env'

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
  analytics: {
    google: {
      propertyId: 'UA-117106220-3'
    }
  },
  ...defaultConfig
}

const overrides = isProd() ? prodConfig : localConfig

const config = {
  ...overrides
}

export default config
