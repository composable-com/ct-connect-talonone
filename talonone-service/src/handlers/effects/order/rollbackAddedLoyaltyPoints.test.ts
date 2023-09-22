import rollbackAddedLoyaltyPointsHandler, {
  RollbackAddedLoyaltyPointsHandlerParams
} from './rollbackAddedLoyaltyPoints'

const customer = {
  version: 1,
  custom: {
    fields: {
      talon_one_customer_loyalty_points: 15
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

describe('rollbackAddedLoyaltyPointsHandler', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })
  it('should call the Commercetools API with the correct parameters', async () => {
    const rollbackAddedLoyaltyPointsParams = {
      name: 'Loyalty points',
      value: 5,
      order: { customerId: '1234' }
    } as unknown as RollbackAddedLoyaltyPointsHandlerParams

    await rollbackAddedLoyaltyPointsHandler(rollbackAddedLoyaltyPointsParams)

    const loyaltyDeducted =
      customer.custom.fields.talon_one_customer_loyalty_points -
      rollbackAddedLoyaltyPointsParams.value

    expect(mockedExcute).toHaveBeenCalled()
    expect(mockedPost).toHaveBeenCalledWith({
      body: {
        version: customer.version,
        actions: [
          {
            action: 'setCustomType',
            fields: {
              talon_one_customer_loyalty_points: loyaltyDeducted
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
