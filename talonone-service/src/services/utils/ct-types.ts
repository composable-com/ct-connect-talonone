import { FieldDefinition } from '@commercetools/platform-sdk'

const setDiscountDefinition = {
  name: 'talon_one_line_item_effect',
  label: {
    'en-US': 'setDiscount'
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
    'en-US': 'TotalPoints'
  },
  required: false,
  type: {
    name: 'Number'
  }
}

export const customerMetadataType = {
  key: 'talon_one_customer_metadata',
  name: {
    'en-US': 'Talon One Customer metadata'
  },
  description: {
    'en-US': 'Talon one Customer metadata desc'
  },
  resourceTypeIds: ['customer'],
  fieldDefinitions: [talonOneCustomerTotalPoints] as FieldDefinition[]
}

const lineItemsMetadataFields = [setDiscountDefinition]

export const lineItemMetadataType = {
  key: 'talon_one_line_item_metadata',
  name: {
    'en-US': 'Talon One Line Item metadata'
  },
  description: {
    'en-US': 'Talon one Line Item matadata desc'
  },
  resourceTypeIds: ['line-item', 'custom-line-item'],
  fieldDefinitions: lineItemsMetadataFields as FieldDefinition[]
}
