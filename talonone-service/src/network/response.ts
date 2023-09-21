import { type Response } from 'express'

const response = ({
  error,
  message,
  res,
  status
}: {
  error: boolean
  message: unknown
  res: Response
  status: number
}) => {
  console.log(status, error, message)
  res.status(status).send({ error, message })
}

export { response }
