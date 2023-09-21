import getCartEffectHandlers from '../effects/cart/index'
import { CTP_TAX_CATEGORY_ID } from '../../env'
import { getCartActions } from '../actions'
import { getDiscountApplied } from '../../handlers/effects/cart/setDiscount'

import { CartReference, LineItem } from '@commercetools/platform-sdk'
import { TalonOneUtils } from '../../services/TalonOne'
import { logger } from '../../services/utils/logger'

const CTP_PRODUCT_LOCALE = process.env.CTP_PRODUCT_LOCALE || 'en-US'

export const cartEventsHandler = async (
  talonOneUtils: TalonOneUtils,
  resource: CartReference
) => {
  const { obj: cart, id } = resource
  const { updateCustomerSession } = talonOneUtils

  if (!cart) return []

  try {
    const { effects } = await updateCustomerSession(id, {
      state: 'open',
      profileId: cart?.customerId || cart?.anonymousId,
      cartItems: cart?.lineItems.map((lineItem: LineItem) => ({
        name: lineItem.name[CTP_PRODUCT_LOCALE], // TODO: handle localization
        sku: lineItem.variant.sku,
        quantity: lineItem.quantity,
        price: lineItem.price.value.centAmount
      }))
    })

    // here are we handle different effects that were previously applied to the cart,
    // and clean them if necessary
    if (effects.length === 0) {
      const discountItem = getDiscountApplied(cart)

      return discountItem
        ? [
            {
              action: 'removeCustomLineItem',
              customLineItemId: discountItem.id
            }
          ]
        : []
    }

    const handlers = getCartEffectHandlers(
      cart.totalPrice.currencyCode,
      CTP_TAX_CATEGORY_ID
    )
    const actions = getCartActions(cart, effects, handlers)

    return actions
  } catch (e) {
    logger.warn('warning: ', e)

    return []
  }
}
