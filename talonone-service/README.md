# commercetools API Extension: TalonOne Integration

This commercetools API Extension integrates TalonOne, providing support for both Loyalty Points and Cart-Level Discounts. The following README provides detailed instructions on how to install, configure, and verify the integration of this open-source project.

## Current State

This solution currently supports managing of commercetools cart discounts and customer loyalty points through Talon.One. Enhancements and updates are continually made to improve the functionality and usability of the extension. _Have in mind that a Customer Session is for TalonOne what is a Cart for commercetools._

## Prerequisites

Before installing this commercetools API Extension, ensure that you have the following:

- **commercetools Project:** You must have the permissions on your commercetools project that allow creation of a new commercetools [API Client](https://docs.commercetools.com/merchant-center/api-clients).

- **Talon.One Account:** You must have a Talon.One account with the correct permissions to create Campaigns and Rules. You must also have the API keys for the account.

- **ngrok(for local development only):** To develop and troubleshoot bugs, we recommend using a proxy service like ngrok. See the [Local Development Steps](#local-development-steps) for more information.


## Installation Steps

These are the steps to install the commercetools API Extension:

1. **Install Dependencies:** Install the dependencies by running `pnpm install` in the root directory.
2. **Create commercetools API client keys:** Ensure that you create the API client keys with the correct scope (**_manage_project_**).
3. **Create TalonOne API Credentials:** Create the API credentials for your Talon.One account. You can find this in the Talon.One dashboard under (**_Settings > Developer_**).
4. **Get Tax Category ID:** Get the Tax Category ID for the project. You can find this in the commercetools dashboard under (**_Settings > Project Settings > Taxes_**).
5. **Create .env file:** Create a .env file in the root directory and fill in the required environment variables. See the sample .env.example file for reference.
Note: the TalonOne API has to be set this way (a valid JSON), this is to support multiple currencies, you can add as many currencies as you want, just add the currency code as a key and the API KEY and API URL as values (check *Setup TalonOne*):

```json
{
  "USD": {
    "API_KEY": "your API key here",
    "API_URL": "your API URL here"
  }
  "PEN": {
    "API_KEY": "your API key here",
    "API_URL": "your API URL here"
  },
  ...
}
```



5. **Run the setup script:** Use the script provided to create the commercetools custom fields and configure the extension. `pnpm run create-ct-types`

## Setup Talon.One
  1. [Create the Application](https://docs.talon.one/docs/product/applications/creating-applications), you can only set one currency per application, so if you want to use multiple currencies you will need to create multiple applications. (each application will have its own API key) 
  2. [Create the desired Campaigns](https://docs.talon.one/docs/product/campaigns/creating-campaigns)
  3. [Create the Loyalty Program](https://docs.talon.one/docs/product/loyalty-programs/profile-based/creating-pb-programs)
  4. Associate the Campaigns with the Loyalty Program 
    **_(Loyalty Programs > Settings > Connected Applications)_**
  5. Create the Rules for the Campaigns

     - **Cart Discount Rule** https://docs.talon.one/docs/product/tutorials/coupons/basic-discount
     - **Loyalty Rule**: https://docs.talon.one/docs/product/tutorials/loyalty/loyalty-points-program
  6. When an Order is cancelled or refunded, the loyalty points on the commercetools Customer object need to be adjusted to reflect the cancellation or refund change. Talon.One can keep points in a _pending_ state to handle situations where customer points need to be deducted. Talon.One must be configured to use `Relative date` for the Reward Schedule by going to **_(Loyalty > Settings > reward schedule > Reward start date > Relative)_**, then choose your `Custom start date` - you can choose a short time period like 1 hour, or a longer period of days or weeks. This time period will keep points in a _pending_ state to allow rollback of points from the commercetools Customer object. After this time period, points associated with a certain Customer Session in Talon.One will not be able to be rolled back if an Order cancellation or refund occurs.

## Local Development Steps

To set up local development, follow these steps:

1.**Configure ngrok:** Install and configure [ngrok](https://ngrok.com/) to allow the API Extension to call your local machine's express application.
2. **Start the express server:** Start the express server by running `cd talonone-service && pnpm run start`.
3. **Setup commercetools API Extension:** Use the below JSON body to setup the commercetools API Extension with the correct triggers. The `destination.url` should be the ngrok domain you're currently using on your local machine.
```json
{
  "destination": {
    "type": "HTTP",
    "url": "(your API Extension public URL here)"
  },
  "triggers": [
    { "resourceTypeId": "cart", "actions": ["Create", "Update"] },
    { "resourceTypeId": "order", "actions": ["Create", "Update"] }
  ]
}
```





## Testing and Verification (WIP)

To ensure the integration is set up correctly, follow these steps:

1. **Test:** Run several test transactions to ensure the integration works seamlessly.

## References

- [commercetools API Extension Documentation](https://docs.commercetools.com/api/projects/api-extensions)

- [Talon.One API Documentation Getting Started](https://docs.talon.one/docs/product/getting-started)

- [Talon.One API Customer Sessions](https://docs.talon.one/docs/dev/concepts/entities/customer-sessions)


This README will be updated as the project evolves. We welcome all contributions to improve this open-source project.
