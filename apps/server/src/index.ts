import { createServer } from 'node:http'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { connectMongo, disconnectMongo } from './db/mongoose.js'

async function bootstrap() {
  try {
    await connectMongo()
    const app = createApp()
    const server = createServer(app)
    server.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`)
    })

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down...`)
      server.close(async () => {
        await disconnectMongo()
        process.exit(0)
      })
    }

    process.on('SIGINT', () => shutdown('SIGINT'))
    process.on('SIGTERM', () => shutdown('SIGTERM'))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

bootstrap()
