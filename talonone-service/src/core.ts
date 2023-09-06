import { Effect } from 'talon_one'
import { EffectHandlers } from './handlers/effects/cart/index'
import { Cart, Order } from '@commercetools/platform-sdk'

export const getCartActions = (
  cart: Cart,
  effects: Effect[],
  handlers: EffectHandlers
) => {
  if (effects.length === 0) return []

  const actions = effects
    .map(effect => {
      const { effectType, props } = effect

      if (handlers[effectType]) return handlers[effectType]?.({ ...props, cart })
    })
    .filter(action => action)

  return actions
}

export const getOrderActions = async (
  order: Order,
  effects: Effect[],
  handlers: EffectHandlers
) => {
  if (effects.length === 0) return []

  // We don't want to send actions to Talon.One for anonymous orders ?
  if (order.anonymousId) return []

  const actions = effects
    .map(async effect => {
      const { effectType, props } = effect

      if (handlers[effectType]) {
        const result = await handlers[effectType]?.({ ...props, order })
        return result
      }
    })
    .filter(action => action)

  const result = await Promise.allSettled(actions);

  return result
    .filter(action => action.status === 'fulfilled')
    .map(action => (action as PromiseFulfilledResult<any>).value)
    .filter(action => action)
}
