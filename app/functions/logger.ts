import { join } from 'node:path'
import winston from 'winston'

let loggerInstance: winston.Logger | null = null

const createWinstonLogger = (): winston.Logger => {
  return winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
          winston.format.align(),
          winston.format.printf(
            (info) =>
              `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
          )
        )
      }),
      new winston.transports.File({
        level: 'debug',
        filename: 'logs/app.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
      })
    ]
  })
}

export const LOGGER = (() => {
  if (!loggerInstance) {
    loggerInstance = createWinstonLogger()
  }
  return loggerInstance
})()
