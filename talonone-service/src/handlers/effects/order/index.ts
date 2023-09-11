import addLoyaltyPointsHandler from './addLoyaltyPoints'
import rollbackAddedLoyaltyPointsHandler from './rollbackAddedLoyaltyPoints'

export const getOrderEffectHandlers = () => {
  return {
    addLoyaltyPoints: addLoyaltyPointsHandler,
    rollbackAddedLoyaltyPoints: rollbackAddedLoyaltyPointsHandler
    // add more effect handlers here
  }
}

export default getOrderEffectHandlers
