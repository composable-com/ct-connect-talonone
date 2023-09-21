import { FieldDefinition } from '@commercetools/platform-sdk'


const CTP_PRODUCT_LOCALE = process.env.CTP_PRODUCT_LOCALE || 'en-US'

const setDiscountDefinition = {
  name: 'talon_one_line_item_effect',
  label: {
    [CTP_PRODUCT_LOCALE]: 'setDiscount'
  },
  required: false,
  type: {
    name: 'String'
  },
  inputHint: 'SingleLine'
}

const talonOneCustomerTotalPoints = {
  name: 'talon_one_customer_loyalty_points',
  label: {
    [CTP_PRODUCT_LOCALE]: 'TotalPoints'
  },
  required: false,
  type: {
    name: 'Number'
  }
}

export const customerMetadataType = {
  key: 'talon_one_customer_metadata',
  name: {
    [CTP_PRODUCT_LOCALE]: 'Talon One Customer metadata'
  },
  description: {
    [CTP_PRODUCT_LOCALE]: 'Talon one Customer metadata desc'
  },
  resourceTypeIds: ['customer'],
  fieldDefinitions: [talonOneCustomerTotalPoints] as FieldDefinition[]
}

const lineItemsMetadataFields = [setDiscountDefinition]

export const lineItemMetadataType = {
  key: 'talon_one_line_item_metadata',
  name: {
    [CTP_PRODUCT_LOCALE]: 'Talon One Line Item metadata'
  },
  description: {
    [CTP_PRODUCT_LOCALE]: 'Talon one Line Item matadata desc'
  },
  resourceTypeIds: ['line-item', 'custom-line-item'],
  fieldDefinitions: lineItemsMetadataFields as FieldDefinition[]
}
