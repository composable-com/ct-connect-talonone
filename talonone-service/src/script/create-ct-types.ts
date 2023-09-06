import { CT_HOST, CT_PROJECT_KEY } from "env"
import { ctLogin, ctClient } from "services/Commercetools"

const setDiscountDefinition = {
	"name": "talon_one_line_item_effect",
	"label": {
		"en-US": "setDiscount"
	},
	"required": false,
	"type": {
		"name": "String"
	},
	"inputHint": "SingleLine"
}

const talonOneCustomerTotalPoints = {
	"name" : "talon_one_customer_loyalty_points",
	"label" : {
		"en-US" : "TotalPoints"
	},
	"required" : false,
	"type" : {
		"name" : "Number"
	}
}

const customerMetadataType = {
  "key" : "talon_one_customer_metadata",
  "name" : {
    "en-US" : "Talon One Customer metadata"
  },
  "description" : {
    "en-US" : "Talon one Customer metadata desc"
  },
  "resourceTypeIds" : [ "customer" ],
  "fieldDefinitions" : [
		talonOneCustomerTotalPoints
	]
}

const lineItemsMetadataFields = [setDiscountDefinition]

const lineItemMetadataType = {
	key: 'talon_one_line_item_metadata',
	name: {
		'en-US': 'Talon One Line Item metadata',
	},
	description: {
		'en-US': 'Talon one Line Item matadata desc',
	},
	resourceTypeIds: ['line-item', 'custom-line-item'],
	fieldDefinitions: lineItemsMetadataFields,
}

const createCtTypes = async () => {
	await ctLogin()
	// In this case we only need types for lineItems
	const types = [
		lineItemMetadataType,
		customerMetadataType,
	]

	types.forEach(typeMetadata => {
		ctClient.post(
			`${CT_HOST}/${CT_PROJECT_KEY}/types`,
			typeMetadata
		)
	});
}

createCtTypes()
