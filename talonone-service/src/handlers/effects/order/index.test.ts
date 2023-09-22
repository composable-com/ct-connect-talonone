import addLoyaltyPointsHandler from './addLoyaltyPoints'
import rollbackAddedLoyaltyPointsHandler from './rollbackAddedLoyaltyPoints'
import getOrderEffectHandlers from './index'

jest.mock('./addLoyaltyPoints', () => jest.fn())
jest.mock('./rollbackAddedLoyaltyPoints', () => jest.fn())

describe('getOrderEffectHandlers', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should return an object with the correct effect handlers', () => {
    const handlers = getOrderEffectHandlers()

    expect(handlers).toEqual({
      addLoyaltyPoints: addLoyaltyPointsHandler,
      rollbackAddedLoyaltyPoints: rollbackAddedLoyaltyPointsHandler
    })
  })
})
