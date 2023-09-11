import { Order } from '@commercetools/platform-sdk'
import { createApiRoot } from '../../../services/commercetools/client/create.client'
import { logger } from '../../../services/utils/logger'

export interface AddLoyaltyPointsParams {
  name: string
  value: number
  order: Order
}

const addLoyaltyPointsHandler = async ({
  name,
  value,
  order
}: AddLoyaltyPointsParams) => {
  const customerId = order.customerId
  try {
    const { body: customer } = await createApiRoot()
      .customers()
      .withId({ ID: customerId! })
      .get()
      .execute()

    const res = await createApiRoot()
      .customers()
      .withId({ ID: customerId! })
      .post({
        body: {
          version: customer.version,
          actions: [
            {
              action: 'setCustomType',
              fields: {
                talon_one_customer_loyalty_points:
                  (customer.custom?.fields.talon_one_customer_loyalty_points ??
                    0) + value
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
      `There was an error trying to apply the 'addLoyaltyPoint' effect: ${error}`
    )
  }
}

export default addLoyaltyPointsHandler
