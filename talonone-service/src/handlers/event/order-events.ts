import { NewCustomerSessionV2 } from 'talon_one'

import { OrderReference } from '@commercetools/platform-sdk'
import { TalonOneUtils } from '../../services/TalonOne'
import getOrderEffectHandlers from '../../handlers/effects/order'
import { getOrderActions } from '../actions'
import { logger } from '../../services/utils/logger'

export enum OrderState {
  Open = 'Open',
  Confirmed = 'Confirmed',
  Complete = 'Complete',
  Cancelled = 'Cancelled'
}

export const getState = (orderState: string) => {
  switch (orderState) {
    case OrderState.Open:
    case OrderState.Complete:
    case OrderState.Confirmed:
      return NewCustomerSessionV2.StateEnum.closed

    case OrderState.Cancelled:
      return NewCustomerSessionV2.StateEnum.cancelled

    default:
      return NewCustomerSessionV2.StateEnum.open
  }
}

export const orderEventsHandler = async (
  talonOneUtils: TalonOneUtils,
  resource: OrderReference
) => {
  const { obj: order } = resource
  const { updateCustomerSession } = talonOneUtils

  if (!order) return []

  try {
    const orderState = getState(order?.orderState)

    // The session id is suppose to exist since this comes from a cart
    if (order?.cart?.id) {
      const { effects } = await updateCustomerSession(order?.cart?.id, {
        state: orderState
      })

      const handlers = getOrderEffectHandlers()
      const actions = await getOrderActions(order, effects, handlers)

      return actions ?? []
    }
  } catch (e) {
    // In case we try to update a session that is already closed or cancelled
    // we just ignore the error, this daes not affect the order flow or session
    logger.warn(JSON.stringify(e))

    return []
  }
}
