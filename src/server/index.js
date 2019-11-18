import { setupRoutes }  from './routes'
const express = require('express')
const app = express()
const port = 9000

setupRoutes(app)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
