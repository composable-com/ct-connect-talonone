import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { errorMiddleware } from './error'
import CustomError from '../errors/custom.error'

describe('errorMiddleware', () => {
  let error: ErrorRequestHandler
  let req: Request
  let res: Response
  let next: NextFunction

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  beforeEach(() => {
    // @ts-ignore
    error = new Error('Test error')
    req = {} as Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    } as unknown as Response
    next = jest.fn()
  })

  it('should handle CustomError with status code and send JSON response', () => {
    const customError = new CustomError(400, 'Custom error message', [
      {
        statusCode: 400,
        message: 'Custom error message'
      }
    ])

    // @ts-ignore
    errorMiddleware(customError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Custom error message',
      errors: [{ message: 'Custom error message', statusCode: 400 }]
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should handle non-CustomError and send a generic error response with status 500', () => {
    errorMiddleware(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Internal server error')
    expect(next).not.toHaveBeenCalled()
  })
})
