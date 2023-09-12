import { Server as HttpServer } from 'http'
import express from 'express'
import cors from 'cors'
import debug from 'debug'

import { applyRoutes } from './router'
import { Log } from '../utils'
import { getTalonOneUtils } from '../services/TalonOne'
import {
  CartReference,
  CustomerReference,
  OrderReference
} from '@commercetools/platform-sdk'
import { createAccessLoggerMiddleware } from '@commercetools-backend/loggers'
import { logger } from '../services/utils/logger'
import { getProject } from '../services/commercetools/client/create.client'

const d = debug('App:Network:Server')
const PORT = (process.env.PORT as string) || 8080

declare global {
  namespace Express {
    interface Request {
      talonOneUtils: ReturnType<typeof getTalonOneUtils>
    }
  }
}

class Server implements Log {
  #app: express.Application
  #server: HttpServer | undefined

  constructor() {
    this.#app = express()
  }

  async #config() {
    await getProject()
    this.#app.use(cors())
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({ extended: false }))
    this.#app.use(createAccessLoggerMiddleware())

    this.#app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
        res.header('Access-Control-Allow-Origin', '*')
        res.header(
          'Access-Control-Allow-Headers',
          'Authorization, Content-Type'
        )

        const action = req.body.resource as
          | CartReference
          | OrderReference
          | CustomerReference
        if (action.typeId === 'customer')
          // TODO: Handle customer events
          return res.status(200).json({ actions: [] })

        const currencyCode = action.obj?.totalPrice?.currencyCode

        if (!currencyCode) {
          logger.warn('The request does not contain a currency code.')

          return res.status(200).json({ actions: [] })
        }

        const talonOneUtils = getTalonOneUtils(currencyCode)
        if (!talonOneUtils) {
          logger.warn(
            `There is no TalonOne API_KEY or API_URL for the [${currencyCode}] currency code in the environment variables.`
          )

          return res.status(200).json({ actions: [] })
        }

        req.talonOneUtils = talonOneUtils
        next()
      }
    )
    applyRoutes(this.#app)
  }

  async start(): Promise<void> {
    try {
      this.#config()
      this.#server = this.#app.listen(PORT, () => {
        d(`HTTP server listening on port ${PORT}.`)
      })
    } catch (e) {
      this.log({
        method: this.start.name,
        value: 'error',
        content: e
      })
    }
  }

  async stop(): Promise<void> {
    try {
      this.#server?.close()
    } catch (e) {
      this.log({
        method: this.stop.name,
        value: 'error',
        content: e
      })
    }
  }

  log({
    method,
    value,
    content
  }: {
    method: string
    value: string
    content: unknown
  }) {
    d(
      `Server invoked -> ${
        this.constructor.name
      } ~ ${method} ~ value: ${value} ~ content: ${JSON.stringify(content)}`
    )
  }
}

const server = new Server()

export { server as Server }
