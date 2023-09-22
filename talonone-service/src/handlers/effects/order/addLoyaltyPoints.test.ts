import { jest } from '@jest/globals'

import addLoyaltyPointsHandler, {
  AddLoyaltyPointsParams
} from './addLoyaltyPoints'

const customer = {
  version: 1,
  custom: {
    fields: {
      talon_one_customer_loyalty_points: 5
    }
  }
}

const mockedExcute = jest.fn().mockReturnValue({ body: customer })
const mockedPost = jest.fn().mockReturnValue({
  execute: jest.fn()
})
jest.mock('../../../services/commercetools/client/create.client', () => {
  return {
    createApiRoot: jest.fn().mockImplementation(() => ({
      customers: jest.fn().mockReturnValue({
        withId: jest.fn().mockReturnValue({
          get: jest.fn().mockReturnValue({
            execute: mockedExcute
          }),
          post: mockedPost
        })
      })
    }))
  }
})

describe('addLoyaltyPointsHandler', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should call the Commercetools API with the correct parameters', async () => {
    const addLoyaltyPointsParams = {
      name: 'Loyalty points',
      value: 15,
      order: { customerId: '1234' }
    } as unknown as AddLoyaltyPointsParams

    await addLoyaltyPointsHandler(addLoyaltyPointsParams)

    expect(mockedExcute).toHaveBeenCalled()
    expect(mockedPost).toHaveBeenCalledWith({
      body: {
        version: customer.version,
        actions: [
          {
            action: 'setCustomType',
            fields: {
              talon_one_customer_loyalty_points:
                customer.custom?.fields.talon_one_customer_loyalty_points +
                addLoyaltyPointsParams.value
            },
            type: {
              typeId: 'type',
              key: 'talon_one_customer_metadata'
            }
          }
        ]
      }
    })
  })
})
