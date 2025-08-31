import type { ErrorRequestHandler, RequestHandler } from 'express'
import { NotFoundError, HttpError } from '../errors/http-error.js'
import { isDev } from '../config/env.js'

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new NotFoundError())
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isHttp = err instanceof HttpError
  const status = isHttp ? err.status : 500
  const code = isHttp ? err.code : 'ERR_INTERNAL'
  const message = isHttp ? err.message : 'Internal Server Error'

  const payload: Record<string, unknown> = { message, code }
  if (isHttp && 'details' in err && err.details) {
    payload.details = err.details
  }
  if (isDev && !isHttp) {
    payload.error = String(err)
  }

  res.status(status).json(payload)
}

