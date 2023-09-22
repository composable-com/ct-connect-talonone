import { Cart, CustomLineItem } from '@commercetools/platform-sdk'
import { nameToSlug } from '../../../utils'

const CTP_PRODUCT_LOCALE = process.env.CTP_PRODUCT_LOCALE || 'en-US';
export interface SetDiscountParams {
  name: string
  value: number
  cart: Cart
}

const custom = {
  type: {
    key: 'talon_one_line_item_metadata'
  },
  fields: {
    talon_one_line_item_effect: 'setDiscount'
  }
}

export const getDiscountApplied = (cart: Cart): CustomLineItem | undefined => {
  const discountApplied = cart.customLineItems.find((customLineItem: any) => {
    return (
      customLineItem.custom.fields.talon_one_line_item_effect === 'setDiscount'
    )
  })

  return discountApplied
}

const setDiscountHandler = (
  { name, value, cart }: SetDiscountParams,
  currencyCode: string,
  taxCategoryId: string
) => {
  const isDiscountApplied = getDiscountApplied(cart)

  if (isDiscountApplied)
    return {
      action: 'changeCustomLineItemMoney',
      customLineItemId: isDiscountApplied.id,
      money: {
        centAmount: value * -1,
        type: 'centPrecision',
        currencyCode,
        fractionDigits: 2
      }
    }

  return {
    action: 'addCustomLineItem',
    custom,
    name: { [CTP_PRODUCT_LOCALE]: name }, // we need to handle localization
    money: {
      centAmount: value * -1,
      type: 'centPrecision',
      currencyCode,
      fractionDigits: 2
    },
    slug: nameToSlug(name),
    taxCategory: {
      typeId: 'tax-category',
      id: taxCategoryId
    }
  }
}

export default setDiscountHandler
