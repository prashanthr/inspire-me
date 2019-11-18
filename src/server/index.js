import { setupRoutes }  from './routes'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 9000

app.use(cors())
setupRoutes(app)

app.listen(port, () => console.log(`Inspire me app listening on port ${port}!`))
