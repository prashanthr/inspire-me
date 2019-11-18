import HealthService from './services/health'
import InspireService from './services/inspire'

const setupRoutes = (app) => {
  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/health', async (req, res, next) => {
    res.status(200).send(HealthService.healthCheck())
  })

  app.get('/inspire', async (req, res, next) => {
    try {
      const inspiration = await InspireService.inspire()
      res.send(JSON.stringify(inspiration))
    } catch (err) {
      res.sendStatus(500)
    }
  })
}

export { setupRoutes }
