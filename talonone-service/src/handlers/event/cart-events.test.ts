import { cartEventsHandler } from './cart-events'
import { CartReference } from '@commercetools/platform-sdk'

import { getDiscountApplied } from '../../handlers/effects/cart/setDiscount'
import getCartEffectHandlers from '../effects/cart/index'
import { getCartActions } from '../actions'

jest.mock('../../handlers/effects/cart/setDiscount')
jest.mock('../effects/cart/index')
jest.mock('../../services/utils/logger')
jest.mock('../actions')

describe('cartEventsHandler', () => {
  let mockTalonOneUtils: any
  let mockResource: CartReference
  let mockUpdateCustomerSession: typeof jest.fn

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    ;(getDiscountApplied as jest.Mock).mockReturnValue(null)
    ;(getCartEffectHandlers as jest.Mock).mockReturnValue({})
    ;(getCartActions as jest.Mock).mockReturnValue([])

    // Mock implementations
    mockUpdateCustomerSession = jest.fn().mockReturnValue({
      effects: []
    })
    mockTalonOneUtils = {
      updateCustomerSession: mockUpdateCustomerSession
    }

    mockResource = {
      obj: {
        id: 'someCartId',
        customerId: 'customerId123',
        anonymousId: 'anonymousId123',
        lineItems: [
          {
            name: { 'en-US': 'productName' },
            variant: { id: 123, sku: 'sku123' },
            quantity: 1,
            price: { value: { centAmount: 100 } }
          }
        ],
        totalPrice: { currencyCode: 'USD' }
      },
      id: 'cartId123'
    } as unknown as CartReference
  })

  it('should return empty array if no cart provided', async () => {
    const actions = await cartEventsHandler(mockTalonOneUtils, {
      ...mockResource,
      obj: undefined
    })
    expect(actions).toEqual([])
    expect(mockUpdateCustomerSession).not.toHaveBeenCalled()
  })

  it('should handle no effects and existing discount', async () => {
    mockTalonOneUtils.updateCustomerSession.mockResolvedValue({ effects: [] })
    ;(getDiscountApplied as jest.Mock).mockReturnValue({ id: 'discountId123' })

    const actions = await cartEventsHandler(mockTalonOneUtils, mockResource)
    expect(actions).toEqual([
      { action: 'removeCustomLineItem', customLineItemId: 'discountId123' }
    ])
  })

  it('should handle no effects and no discount', async () => {
    mockTalonOneUtils.updateCustomerSession.mockResolvedValue({ effects: [] })
    ;(getDiscountApplied as jest.Mock).mockReturnValue(null)

    const actions = await cartEventsHandler(mockTalonOneUtils, mockResource)
    expect(actions).toEqual([])
  })

  it('should handle existing effects and no discount', async () => {
    mockTalonOneUtils.updateCustomerSession.mockResolvedValue({
      effects: ['effect1']
    })

    const actions = await cartEventsHandler(mockTalonOneUtils, mockResource)

    expect(actions).toEqual([])
    expect(getCartEffectHandlers).toHaveBeenCalled()
    expect(getCartActions).toHaveBeenCalledWith(
      mockResource.obj,
      ['effect1'],
      {}
    )
  })

  it('should return empty array if an error occurs', async () => {
    mockTalonOneUtils.updateCustomerSession.mockRejectedValue(
      new Error('error')
    )
    const actions = await cartEventsHandler(mockTalonOneUtils, mockResource)

    expect(actions).toEqual([])
  })

  // TODO: Add more test cases for effects handling logic and error scenarios.
})
