import { Customer, Order } from "@commercetools/platform-sdk"
import { CT_HOST, CT_PROJECT_KEY } from "env"
import { ctClient } from "services/Commercetools"


export interface AddLoyaltyPointsParams {
  name: string
  value: number
  order: Order
}

const addLoyaltyPointsHandler = async (
  { name, value, order }: AddLoyaltyPointsParams,
) => {
  const customerId = order.customerId
  const customer = (await ctClient.get(`${CT_HOST}/${CT_PROJECT_KEY}/customers/${customerId}`)).data as Customer

  ctClient.post(`${CT_HOST}/${CT_PROJECT_KEY}/customers/${customerId}`, {
    version: customer.version,
    actions: [{
      action: 'setCustomType',
      fields: {
        talon_one_customer_loyalty_points: (customer.custom?.fields.talon_one_customer_loyalty_points || 0) + value
      },
      type: { key: 'talon_one_customer_metadata' }
    }]
  })
}

export default addLoyaltyPointsHandler
