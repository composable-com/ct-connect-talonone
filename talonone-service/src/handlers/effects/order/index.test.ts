import { describe, expect, jest } from '@jest/globals';
import { EffectHandlers } from '../types';
import addLoyaltyPointsHandler from './addLoyaltyPoints';
import getOrderEffectHandlers from './index';
import rollbackAddedLoyaltyPointsHandler from './rollbackAddedLoyaltyPoints';

jest.mock('./addLoyaltyPoints')
jest.mock('./rollbackAddedLoyaltyPoints')

describe('getOrderEffectHandlers', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it('should return an object with the addLoyaltyPoints and rollbackAddedLoyaltyPoints effect handlers', () => {
    (addLoyaltyPointsHandler as jest.Mock).mockReturnValue(null);
    (rollbackAddedLoyaltyPointsHandler as jest.Mock).mockReturnValue(null);

    const effectHandlers: EffectHandlers = getOrderEffectHandlers()

    expect(effectHandlers).toHaveProperty('addLoyaltyPoints')
    expect(effectHandlers).toHaveProperty('rollbackAddedLoyaltyPoints')
    expect(effectHandlers.addLoyaltyPoints({})).toBeNull()
    expect(effectHandlers.rollbackAddedLoyaltyPoints({})).toBeNull()
  })
})
