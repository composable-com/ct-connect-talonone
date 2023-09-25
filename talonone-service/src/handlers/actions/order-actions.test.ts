import { Effect } from 'talon_one'
import { Order } from '@commercetools/platform-sdk'
import { getOrderActions } from './order-actions'

describe('getCartActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should return an empty array if no effects are provided', async () => {
    const mockOrder = {
      anonymousId: null
    } as unknown as Order

    const result = await getOrderActions(mockOrder, [], {})
    expect(result).toEqual([])
  })

  it('should return an empty array if order has an anonymousId', async () => {
    const mockOrder = {
      anonymousId: 'someId'
    } as unknown as Order

    const mockEffects = [
      { effectType: 'someEffectType', props: { key: 'value' } }
    ] as unknown as Effect[]

    const result = await getOrderActions(mockOrder, mockEffects, {})
    expect(result).toEqual([])
  })

  it('should return the correct order actions based on given effects and handlers', async () => {
    const mockOrder = {
      anonymousId: null
    } as unknown as Order

    const mockEffects = [
      { effectType: 'someEffectType', props: { key: 'value' } },
      { effectType: 'unhandledEffectType', props: { key2: 'value2' } }
    ] as unknown as Effect[]

    const mockHandlerResult = 'someActionResult'
    const mockHandlers = {
      someEffectType: jest.fn().mockResolvedValue(mockHandlerResult)
    }

    const result = await getOrderActions(mockOrder, mockEffects, mockHandlers)

    expect(mockHandlers.someEffectType).toHaveBeenCalledWith({
      key: 'value',
      order: mockOrder
    })

    expect(result).toEqual([mockHandlerResult])
  })
})
