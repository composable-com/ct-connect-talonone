import { httpMiddlewareOptions } from './http'

jest.mock('../utils', () => ({
  readConfiguration: jest.fn().mockImplementation(() => ({
    region: 'test-region'
  }))
}))

describe('httpMiddlewareOptions configuration', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should generate httpMiddlewareOptions with the correct host', () => {
    const expectedHttpMiddlewareOptions = {
      host: `https://api.test-region.commercetools.com`
    }

    expect(httpMiddlewareOptions).toEqual(expectedHttpMiddlewareOptions)
  })
})
