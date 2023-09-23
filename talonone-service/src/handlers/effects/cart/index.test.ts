import { describe, expect, test, jest } from '@jest/globals';
import { EffectHandlers } from '../types'
import getCartEffectHandlers from './index'
import getDiscountApplied from './setDiscount'

jest.mock('./setDiscount')

describe('getCartEffectHandlers', () => {
  let currencyCode: string
  let taxCategoryId: string

  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  beforeEach(() => {
    currencyCode = 'USD'
    taxCategoryId = 'taxCategoryId'
  })

  it('should return an object with the setDiscount effect handler', () => {
    (getDiscountApplied as jest.Mock).mockReturnValue(null)

    const effectHandlers: EffectHandlers = getCartEffectHandlers(
      currencyCode,
      taxCategoryId
    )

    expect(effectHandlers).toHaveProperty('setDiscount')
    expect(effectHandlers.setDiscount({})).toBeNull()
  })
})
