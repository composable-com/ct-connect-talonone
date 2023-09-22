import { Effect } from 'talon_one'
import { Cart } from '@commercetools/platform-sdk'
import { EffectHandlers } from '../effects/types'

export const getCartActions = (
  cart: Cart,
  effects: Effect[],
  handlers: EffectHandlers
) => {
  if (effects.length === 0) return []

  const actions = effects
    .map(effect => {
      const { effectType, props } = effect

      if (handlers[effectType])
        return handlers[effectType]?.({ ...props, cart })

      return null
    })
    .filter(action => action)

  return actions
}
