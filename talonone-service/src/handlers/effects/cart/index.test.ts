import { EffectHandlers } from '../types'
import getCartEffectHandlers from './index'

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
    const effectHandlers: EffectHandlers = getCartEffectHandlers(
      currencyCode,
      taxCategoryId
    )

    expect(effectHandlers).toEqual({
      setDiscount: expect.any(Function)
    })
  })
})
