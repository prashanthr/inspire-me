import HealthService from './services/health'
import InspireService from './services/inspire'

const setupRoutes = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/health', async (req, res, next) => {
    res.status(200).send(HealthService.healthCheck())
  })

  app.get('/api/inspire', async (req, res, next) => {
    try {
      const sources = req.query && req.query.sources ? req.query.sources : null
      const inspiration = await InspireService.inspire({ 
        innerSources: sources 
      })
      res.send(JSON.stringify(inspiration))
    } catch (err) {
      console.error('API Error', err)
      res.sendStatus(500)
    }
  })
}

export { setupRoutes }
