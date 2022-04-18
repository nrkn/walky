import * as express from 'express'

const port = process.env.port || process.env.PORT || 8080

const app = express()

app.use(express.static('public'))

app.listen(port, async () => {
  console.log(`Listening: ${port}`)
})
