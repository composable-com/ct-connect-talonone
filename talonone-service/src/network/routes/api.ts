import { Response, Request, Router } from 'express'
import { getEventHandler } from 'handlers/event'

const Api = Router()

Api.route('')
  .post(async (req: Request, res: Response) => {
    const eventHandler = getEventHandler(req)
    const actions = await eventHandler(req.body.resource)
    
    res.json({ actions })
  })

export { Api }
