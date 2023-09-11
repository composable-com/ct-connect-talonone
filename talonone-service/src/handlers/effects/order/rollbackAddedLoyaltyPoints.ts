import { Order } from '@commercetools/platform-sdk'
import { createApiRoot } from '../../../services/commercetools/client/create.client'
import { logger } from '../../../services/utils/logger'

export interface RollbackAddedLoyaltyPointsHandlerParams {
  name: string
  value: number
  order: Order
}

const rollbackAddedLoyaltyPointsHandler = async ({
  name,
  value,
  order
}: RollbackAddedLoyaltyPointsHandlerParams) => {
  try {
    const customerId = order.customerId
    const { body: customer } = await createApiRoot()
      .customers()
      .withId({ ID: customerId! })
      .get()
      .execute()

    let loyaltyDeducted
    if (customer.custom?.fields.talon_one_customer_loyalty_points < value)
      loyaltyDeducted = 0
    else
      loyaltyDeducted =
        customer.custom?.fields.talon_one_customer_loyalty_points - value

    await createApiRoot()
      .customers()
      .withId({ ID: customerId! })
      .post({
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
      .execute()
  } catch (error) {
    logger.error(
      `There was an error trying to apply the 'rollbackAddedLoyaltyPoints' effect: ${error}`
    )
  }
}

export default rollbackAddedLoyaltyPointsHandler
