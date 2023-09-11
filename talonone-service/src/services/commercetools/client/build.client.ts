import { ClientBuilder } from '@commercetools/sdk-client-v2'
import { authMiddlewareOptions } from '../middleware/auth'
import { httpMiddlewareOptions } from '../middleware/http'
import { readConfiguration } from '../utils'

/**
 * Create a new client builder.
 * This code creates a new Client that can be used to make API calls
 */
export const createClient = () =>
  new ClientBuilder()
    .withProjectKey(readConfiguration().projectKey)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .build()
