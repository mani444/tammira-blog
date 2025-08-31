import path from 'node:path'
import fs from 'node:fs'
import dotenv from 'dotenv'

// Attempt to load .env from server dir, then repo root as fallback
const serverEnvPath = path.resolve(process.cwd(), '.env')
const rootEnvPath = path.resolve(process.cwd(), '..', '..', '.env')

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath })
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath })
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/SampleBlogs',
}

export const isDev = env.nodeEnv !== 'production'

