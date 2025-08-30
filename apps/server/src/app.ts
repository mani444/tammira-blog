import express from 'express'
import cors from 'cors'
import { errorHandler, notFound } from './middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // 404 and error handling
  app.use(notFound)
  app.use(errorHandler)

  return app
}
