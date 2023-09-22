import * as validatorHelpers from './validators/helpers.validators'
import { readConfiguration } from './utils'
import CustomError from './errors/custom.error'

jest
  .spyOn(validatorHelpers, 'getValidateMessages')
  .mockImplementation(jest.fn().mockReturnValue([]))

describe('readConfiguration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Mocked environment variables
  const mockEnv = {
    CTP_CLIENT_ID: 'mockClientId',
    CTP_CLIENT_SECRET: 'mockClientSecret',
    CTP_PROJECT_KEY: 'mockProjectKey',
    CTP_SCOPE: 'mockScope',
    CTP_REGION: 'mockRegion'
  }

  beforeEach(() => {
    process.env = {} // Reset environment variables
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it('should read and return environment variables correctly', () => {
    jest
      .spyOn(validatorHelpers, 'getValidateMessages')
      .mockImplementationOnce(jest.fn().mockReturnValue([]))

    process.env = { ...mockEnv }

    const config = readConfiguration()
    expect(config.clientId).toBe('mockClientId')
    expect(config.clientSecret).toBe('mockClientSecret')
    expect(config.projectKey).toBe('mockProjectKey')
    expect(config.region).toBe('mockRegion')
    expect(config.scope).toBe('mockScope')
  })

  it('should throw CustomError when there are validation errors', () => {
    jest
      .spyOn(validatorHelpers, 'getValidateMessages')
      .mockImplementationOnce(jest.fn().mockReturnValue(['error']))

    expect(readConfiguration).toThrow(CustomError)
  })
})
