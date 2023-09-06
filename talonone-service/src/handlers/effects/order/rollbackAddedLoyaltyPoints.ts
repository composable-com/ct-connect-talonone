import { Customer, Order } from "@commercetools/platform-sdk"
import { CT_HOST, CT_PROJECT_KEY } from "env"
import { ctClient } from "services/Commercetools"

export interface RollbackAddedLoyaltyPointsHandlerParams {
  name: string
  value: number
  order: Order
}

const rollbackAddedLoyaltyPointsHandler = async (
  { name, value, order }: RollbackAddedLoyaltyPointsHandlerParams,
) => {
  const customerId = order.customerId
  const customer = (await ctClient.get(`${CT_HOST}/${CT_PROJECT_KEY}/customers/${customerId}`)).data as Customer

  let loyaltyDeducted
  if (customer.custom?.fields.talon_one_customer_loyalty_points < value) {
	loyaltyDeducted = 0
  } else {
	loyaltyDeducted = customer.custom?.fields.talon_one_customer_loyalty_points - value
  }

  ctClient.post(`${CT_HOST}/${CT_PROJECT_KEY}/customers/${customerId}`, {
    version: customer.version,
    actions: [{
      action: 'setCustomType',
      fields: {
        talon_one_customer_loyalty_points: loyaltyDeducted
      },
      type: { key: 'talon_one_customer_metadata' }
    }]
  })
}

export default rollbackAddedLoyaltyPointsHandler
