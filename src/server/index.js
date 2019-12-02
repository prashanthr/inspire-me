import { setupRoutes }  from './routes'
import express from 'express'
import http from 'http'
import path from 'path'
import cors from 'cors'

const app = express()
const port = 9000

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
  })
}
server()
