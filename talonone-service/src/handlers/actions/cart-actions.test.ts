import { Effect } from 'talon_one'
import { Cart } from '@commercetools/platform-sdk'
import { EffectHandlers } from '../effects/types'
import { getCartActions } from './cart-actions'

describe('getCartActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })
  it('should return empty array if no effects are given', () => {
    const mockCart = {} as unknown as Cart
    const mockEffects = [] as unknown as Effect[]
    const mockHandlers = {
      someEffectType: jest.fn().mockReturnValue('someActionResult')
    }

    const result = getCartActions(mockCart, mockEffects, mockHandlers)
    expect(result).toEqual([])
  })

  it('should return the correct cart actions based on given effects and handlers', () => {
    const mockCart = {} as unknown as Cart

    const mockEffects = [
      { effectType: 'someEffectType', props: { key: 'value' } },
      { effectType: 'unhandledEffectType', props: { key2: 'value2' } }
    ] as unknown as Effect[]

    const mockHandlers = {
      someEffectType: jest.fn().mockReturnValue('someActionResult')
    }

    const result = getCartActions(mockCart, mockEffects, mockHandlers)

    // Assert that the handler for 'someEffectType' was called with correct properties
    expect(mockHandlers.someEffectType).toHaveBeenCalledWith({
      key: 'value',
      cart: mockCart
    })

    // Assert the expected result
    expect(result).toEqual(['someActionResult'])
  })
})
