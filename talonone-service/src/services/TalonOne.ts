import {
  IntegrationRequest,
  ApiClient,
  IntegrationApi,
  NewCustomerProfile,
  NewCustomerSessionV2
} from 'talon_one'

interface GetTalonOneApiClient {
  basePath: string
  apiKey: string
}

interface TalonOneEnvConfig {
  [key: string]: {
    API_URL: string
    API_KEY: string
  }
}

export interface TalonOneUtils {
  updateCustomerProfile: (
    id: string,
    payload: NewCustomerProfile
  ) => Promise<any>
  updateCustomerProfiles: (payload: any) => Promise<any>
  updateCustomerSession: (
    id: string,
    payload: Partial<NewCustomerSessionV2>
  ) => Promise<any>
}

export const getTalonOneApiClient = ({
  basePath,
  apiKey
}: GetTalonOneApiClient) => {
  const apiClient = new ApiClient()
  apiClient.basePath = basePath

  // @ts-ignore this is a bug in the talon one types
  const apiKeyV1 = apiClient.authentications.api_key_v1
  apiKeyV1.apiKey = apiKey
  apiKeyV1.apiKeyPrefix = 'ApiKey-v1'

  return new IntegrationApi(apiClient)
}

export const getTalonOneUtils = (
  currencyCode: string
): TalonOneUtils | null => {
  const TALON_API = JSON.parse(decodeURIComponent(`"${process.env.TALON_ONE_API}"`)) as TalonOneEnvConfig

  if (
    !TALON_API[currencyCode] ||
    !TALON_API[currencyCode].API_KEY ||
    !TALON_API[currencyCode].API_URL
  )
    return null

  const client = getTalonOneApiClient({
    apiKey: TALON_API[currencyCode].API_KEY,
    basePath: TALON_API[currencyCode].API_URL
  })

  const updateCustomerProfile = (id: string, payload: NewCustomerProfile) => {
    return client
      .updateCustomerProfileV2(id, payload, {
        runRuleEngine: true
      })
      .then(_projection)
  }

  const updateCustomerProfiles = (payload: any) => {
    return client.updateCustomerProfilesV2(payload).then(_projection)
  }

  const updateCustomerSession = async (
    id: string,
    payload: Partial<NewCustomerSessionV2>
  ) => {
    const integrationRequest = new IntegrationRequest(payload)

    integrationRequest.responseContent = [
      IntegrationRequest.ResponseContentEnum.customerSession,
      IntegrationRequest.ResponseContentEnum.loyalty
    ]

    return client
      .updateCustomerSessionV2(id, integrationRequest)
      .then(_projection)
  }

  const _projection = (data: { fromApi: any }) => {
    if (data) data.fromApi = currencyCode

    return data as any
  }

  return {
    updateCustomerProfile,
    updateCustomerProfiles,
    updateCustomerSession
  }
}
