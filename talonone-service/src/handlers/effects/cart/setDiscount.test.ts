import { nameToSlug } from '../../../utils'
import setDiscountHandler, { getDiscountApplied } from './setDiscount'
import { Cart, CustomLineItem } from '@commercetools/platform-sdk'

describe('setDiscountHandler', () => {
  let mockCart: Cart
  const mockCurrencyCode = 'USD'
  const mockTaxCategoryId = 'mockTaxCategoryId'

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockCart = {
      customLineItems: []
    } as unknown as Cart
  })

  it("should return 'addCustomLineItem' action if discount is not applied", () => {
    const params = {
      name: 'testDiscount',
      value: 100,
      cart: mockCart
    }

    const result = setDiscountHandler(
      params,
      mockCurrencyCode,
      mockTaxCategoryId
    )

    expect(result.action).toBe('addCustomLineItem')
    expect(result.slug).toBe(nameToSlug(params.name)) // Assuming nameToSlug function converts the name to lowercase.
    expect(result.money.centAmount).toBe(-100)
    expect(result.money.currencyCode).toBe(mockCurrencyCode)
    expect(result.taxCategory?.id).toBe(mockTaxCategoryId)
  })

  it("should return 'changeCustomLineItemMoney' action if discount is already applied", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockCart.customLineItems = [
      {
        custom: {
          fields: {
            talon_one_line_item_effect: 'setDiscount'
          }
        },
        id: '1234'
      }
    ]

    const params = {
      name: 'testDiscount',
      value: 100,
      cart: mockCart
    }

    const result = setDiscountHandler(
      params,
      mockCurrencyCode,
      mockTaxCategoryId
    )

    expect(result.action).toBe('changeCustomLineItemMoney')
    expect(result.customLineItemId).toBe('1234')
    expect(result.money.centAmount).toBe(-100)
    expect(result.money.currencyCode).toBe(mockCurrencyCode)
  })
})

describe('getDiscountApplied', () => {
  let mockCart: Cart

  beforeEach(() => {
    mockCart = {
      customLineItems: []
    } as unknown as Cart
  })

  it('should return undefined if no discount is applied', () => {
    const result = getDiscountApplied(mockCart)
    expect(result).toBeUndefined()
  })

  it("should return the custom line item with 'setDiscount' effect if it's applied", () => {
    const mockCustomLineItem = {
      custom: {
        fields: {
          talon_one_line_item_effect: 'setDiscount'
        }
      },
      id: '1234'
    }
    mockCart.customLineItems.push(
      mockCustomLineItem as unknown as CustomLineItem
    )

    const result = getDiscountApplied(mockCart)

    expect(result).toBeDefined()
    expect(result?.id).toBe('1234')
    expect(result?.custom?.fields.talon_one_line_item_effect).toBe(
      'setDiscount'
    )
  })

  it("should return undefined if another effect is applied, but not 'setDiscount'", () => {
    mockCart.customLineItems.push({
      custom: {
        fields: {
          talon_one_line_item_effect: 'someOtherEffect'
        }
      },
      id: '1234'
    } as unknown as CustomLineItem)

    const result = getDiscountApplied(mockCart)
    expect(result).toBeUndefined()
  })
})
