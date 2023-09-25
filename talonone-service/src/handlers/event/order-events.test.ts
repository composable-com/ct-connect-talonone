import { TalonOneUtils } from '../../services/TalonOne'
import { OrderReference } from '@commercetools/platform-sdk'

import { OrderState, getState, orderEventsHandler } from './order-events'
import { NewCustomerSessionV2 } from 'talon_one'
import { logger } from '../../services/utils/logger'

import { getOrderActions } from '../actions'

describe('getState', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.mock('../actions', () => jest.fn())
    jest.mock('../../services/utils/logger')
    jest.mock('../../handlers/effects/order', () =>
      jest.fn().mockReturnValue({})
    )
  })

  it('should return NewCustomerSessionV2.StateEnum.closed for OrderState.Open', () => {
    const orderState = OrderState.Open
    const result = getState(orderState)

    expect(result).toEqual(NewCustomerSessionV2.StateEnum.closed)
  })
  it('should return NewCustomerSessionV2.StateEnum.closed for OrderState.Complete', () => {
    const orderState = OrderState.Complete
    const result = getState(orderState)

    expect(result).toEqual(NewCustomerSessionV2.StateEnum.closed)
  })

  it('should return NewCustomerSessionV2.StateEnum.closed for OrderState.Confirmed', () => {
    const orderState = OrderState.Confirmed
    const result = getState(orderState)

    expect(result).toEqual(NewCustomerSessionV2.StateEnum.closed)
  })
  it('should return NewCustomerSessionV2.StateEnum.cancelled for OrderState.Cancelled', () => {
    const orderState = OrderState.Cancelled
    const result = getState(orderState)

    expect(result).toEqual(NewCustomerSessionV2.StateEnum.cancelled)
  })
  it('should return NewCustomerSessionV2.StateEnum.open as a default', () => {
    const orderState = 'someOtherState'
    const result = getState(orderState)

    expect(result).toEqual(NewCustomerSessionV2.StateEnum.open)
  })
})

jest.mock('../actions')

describe('orderEventsHandler', () => {
  let mockTalonOneUtils: jest.Mocked<TalonOneUtils>
  let mockResource: OrderReference
  let warnSpy: jest.SpyInstance

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()

    jest.mock('../actions')
    jest.mock('../../services/utils/logger')
    jest.mock('../../handlers/effects/order', () =>
      jest.fn().mockReturnValue({})
    )

    warnSpy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
    jest.mock('../../handlers/effects/order', () => jest.fn())

    mockTalonOneUtils = {
      updateCustomerSession: jest.fn().mockResolvedValue(['someEffect'])
    } as unknown as jest.Mocked<TalonOneUtils>

    mockResource = {
      obj: {
        id: 'someOrderId',
        orderState: 'Open',
        cart: {
          id: 'someCartId'
        }
      }
    } as OrderReference
  })

  it('should return empty array if no order provided', async () => {
    ;(getOrderActions as jest.Mock).mockResolvedValue(undefined)

    const actions = await orderEventsHandler(mockTalonOneUtils, {
      ...mockResource,
      obj: undefined
    })
    expect(actions).toEqual([])
  })

  it('should handle order with cart and state Open', async () => {
    ;(getOrderActions as jest.Mock).mockResolvedValue(undefined)

    const actions = await orderEventsHandler(mockTalonOneUtils, mockResource)
    expect(mockTalonOneUtils.updateCustomerSession).toHaveBeenCalledWith(
      'someCartId',
      { state: 'closed' }
    )

    expect(actions).toEqual([])
  })

  it('should return array of actions', async () => {
    ;(getOrderActions as jest.Mock).mockResolvedValue(['someAction'])
    const actions = await orderEventsHandler(mockTalonOneUtils, mockResource)

    expect(actions).toEqual(['someAction'])
  })

  it('should log warning on error', async () => {
    mockTalonOneUtils.updateCustomerSession.mockRejectedValue(
      new Error('Test error')
    )
    await orderEventsHandler(mockTalonOneUtils, mockResource)
    expect(warnSpy).toHaveBeenCalledWith(
      JSON.stringify(new Error('Test error'))
    )
  })
})
