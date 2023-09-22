import { Effect } from 'talon_one'
import { Order } from '@commercetools/platform-sdk'
import { EffectHandlers } from '../effects/types'

export const getOrderActions = async (
  order: Order,
  effects: Effect[],
  handlers: EffectHandlers
) => {
  if (effects.length === 0) return []
  if (order.anonymousId) return []

  const actions = effects
    .map(async effect => {
      const { effectType, props } = effect

      if (handlers[effectType]) {
        const result = await handlers[effectType]?.({ ...props, order })

        return result
      }

      return null
    })
    .filter(action => action)

  const result = await Promise.allSettled(actions)

  return result
    .filter(action => action.status === 'fulfilled')
    .map(action => (action as PromiseFulfilledResult<any>).value)
    .filter(action => action)
}
