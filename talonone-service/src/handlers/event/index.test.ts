import { getEventHandler } from './index'
import { cartEventsHandler } from './cart-events'
import { Request } from 'express'

jest.mock('./cart-events')
jest.mock('./order-events')

describe('getEventHandler', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
    ;(cartEventsHandler as jest.Mock).mockReturnValue('cartHandler')
  })

  it('should return a handler function', () => {
    const req = {
      body: {
        resource: {
          typeId: 'CART'
        }
      },
      talonOneUtils: {}
    } as unknown as Request

    const result = getEventHandler(req)

    expect(result).toBeInstanceOf(Function)
    const resultValue = (result as any)()
    expect(resultValue).toEqual('cartHandler')
  })
  it('should return an actions object with an empty array', () => {
    const req = {
      body: {
        resource: {
          typeId: 'invalidId'
        }
      },
      talonOneUtils: {}
    } as unknown as Request

    const result = getEventHandler(req)
    const resultValue = (result as any)()

    expect(resultValue).toEqual({ actions: [] })
  })
})
