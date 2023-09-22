import { createClient } from './build.client'
import { ClientBuilder } from '@commercetools/sdk-client-v2'

// import { ClientBuilder } from '@commercetools/sdk-client-v2'
// import { authMiddlewareOptions } from '../middleware/auth'
// import { httpMiddlewareOptions } from '../middleware/http'
// import { readConfiguration } from '../utils'

jest.mock('@commercetools/sdk-client-v2', () => ({
  ClientBuilder: jest.fn().mockImplementation(() => ({
    withProjectKey: jest.fn().mockReturnThis(),
    withClientCredentialsFlow: jest.fn().mockReturnThis(),
    withHttpMiddleware: jest.fn().mockReturnThis(),
    build: jest.fn()
  }))
}))

jest.mock('../middleware/auth', () => ({
  authMiddlewareOptions: jest.fn()
}))

jest.mock('../middleware/http', () => ({
  httpMiddlewareOptions: jest.fn()
}))

jest.mock('../utils', () => ({
  readConfiguration: jest.fn().mockImplementation(() => ({
    projectKey: 'test-project-key',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    scope: 'test-scope',
    region: 'test-region'
  }))
}))

describe('createClient function', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should create a new Client with the correct configuration', () => {
    createClient()
    expect(ClientBuilder).toHaveBeenCalled()
  })
})
