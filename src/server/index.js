import { setupRoutes }  from './routes'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'
import config from 'config'
import cronSchedule from 'node-schedule'
import healthCheck from './utils/health-check'

const app = express()
const port = config.port

app.use(cors())
app.use(express.static(path.join(__dirname, '/../../build')))
setupRoutes(app)

const server = async () => {
  let httpServer = http.Server(app)
  app.use(function (req, res) {
    res.sendFile(path.join(__dirname, '/../../build', 'index.html'))
  })
  httpServer.listen(port, () => {
    console.log(`Inspire me app listening on port ${port}!`)
     // cron health check
     const { endpoint, schedule, enabled } = config.healthCheck
     if (enabled) {
       console.info(`Health check is enabled for ${schedule}`)
       cronSchedule.scheduleJob(
         schedule,
         async () => { await healthCheck(endpoint) }
       )
     } else {
       console.warn('Health check is disabled')
     }
  })
}
server()
