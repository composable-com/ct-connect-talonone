import { createApiRoot } from './create.client'

const mockedWithProjectKey = jest.fn()

jest.mock('@commercetools/platform-sdk', () => {
  return {
    createApiBuilderFromCtpClient: jest.fn().mockImplementation(() => ({
      withProjectKey: mockedWithProjectKey
    }))
  }
})

jest.mock('./build.client')

jest.mock('../utils', () => ({
  readConfiguration: jest.fn().mockImplementation(() => ({
    projectKey: 'test-project-key',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    scope: 'test-scope',
    region: 'test-region'
  }))
}))

describe('createApiRoot function', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should create an API root with the correct project key', () => {
    createApiRoot()

    expect(mockedWithProjectKey).toBeCalledWith({
      projectKey: 'test-project-key'
    })
  })
})
