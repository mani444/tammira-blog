export class HttpError extends Error {
  status: number
  code: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.status = status
    this.code = code ?? 'ERR_HTTP'
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', code = 'ERR_NOT_FOUND') {
    super(404, message, code)
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', code = 'ERR_BAD_REQUEST') {
    super(400, message, code)
  }
}

export class ValidationError extends HttpError {
  details?: unknown
  constructor(message = 'Validation Failed', details?: unknown) {
    super(422, message, 'ERR_VALIDATION')
    this.details = details
  }
}

