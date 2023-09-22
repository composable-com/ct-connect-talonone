import { authMiddlewareOptions } from './auth'

const mockConfiguration = {
  region: 'test-region',
  projectKey: 'test-project',
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  scope: undefined
}

jest.mock('../utils', () => ({
  readConfiguration: jest.fn().mockImplementation(() => ({
    projectKey: 'test-project',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    scope: 'default',
    region: 'test-region'
  }))
}))

describe('authMiddlewareOptions configuration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should use default scope when scope is not provided in configuration', () => {
    const expectedAuthMiddlewareOptions = {
      host: `https://auth.${mockConfiguration.region}.commercetools.com`,
      projectKey: mockConfiguration.projectKey,
      credentials: {
        clientId: mockConfiguration.clientId,
        clientSecret: mockConfiguration.clientSecret
      },
      scopes: ['default']
    }

    expect(authMiddlewareOptions).toEqual(expectedAuthMiddlewareOptions)
  })
})
