if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const connectionString = process.env.DATABASE_URL

import postgres from 'postgres'
import { LOGGER } from './logger'

LOGGER.debug(`Connecting to database: ${connectionString}`)

const queryClient = postgres(connectionString)

export { queryClient }
