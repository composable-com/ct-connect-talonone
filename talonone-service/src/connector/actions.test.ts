import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'
import { createMyExtension, createType, deleteMyExtension } from './actions'
import { TypeDraft } from '@commercetools/platform-sdk'

describe('createMyExtension', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })
  const applicationUrl = 'https://example.com'

  const mockGetResponse = {
    body: {
      results: [{ version: 1 }]
    }
  }
  const mockDeletefn = jest.fn().mockReturnThis()
  const mockPostfn = jest.fn().mockReturnThis()
  const mockApiRoot = {
    extensions: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    withKey: jest.fn().mockReturnThis(),
    delete: mockDeletefn,
    post: mockPostfn,
    execute: jest.fn().mockResolvedValue(mockGetResponse)
  } as unknown as ByProjectKeyRequestBuilder

  it('should create an extension', async () => {
    await createMyExtension(mockApiRoot, applicationUrl)

    expect(mockPostfn).toHaveBeenCalledWith({
      body: {
        key: 'talonone-ct-extension',
        destination: {
          type: 'HTTP',
          url: 'https://example.com'
        },
        triggers: [
          { resourceTypeId: 'cart', actions: ['Create', 'Update'] },
          { resourceTypeId: 'order', actions: ['Create', 'Update'] }
        ]
      }
    })
  })

  it('should delete the existing extension before re-creating an extension', async () => {
    await createMyExtension(mockApiRoot, applicationUrl)

    expect(mockDeletefn).toHaveBeenCalledWith({
      queryArgs: {
        version: mockGetResponse.body.results[0].version
      }
    })
  })
})

describe('deleteMyExtension', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })
  const mockGetResponse = {
    body: {
      results: [{ version: 1 }]
    }
  }
  const mockDeletefn = jest.fn().mockReturnThis()
  const mockApiRoot = {
    extensions: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    withKey: jest.fn().mockReturnThis(),
    delete: mockDeletefn,
    execute: jest.fn().mockResolvedValue(mockGetResponse)
  } as unknown as ByProjectKeyRequestBuilder

  it('should delete the extension', async () => {
    await deleteMyExtension(mockApiRoot)

    expect(mockDeletefn).toHaveBeenCalledWith({
      queryArgs: {
        version: mockGetResponse.body.results[0].version
      }
    })
  })
})

describe('createType', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it('should create a custom type', async () => {
    const key = 'myKey'
    const typeDefinition = { info: 'myTypeDefinition' } as unknown as TypeDraft

    const mockGetResponse = {
      body: {
        results: { types: [] }
      }
    }
    const mockPostfn = jest.fn().mockReturnThis()

    const mockApiRoot = {
      types: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      post: mockPostfn,
      execute: jest.fn().mockResolvedValue(mockGetResponse)
    }

    await createType(
      mockApiRoot as unknown as ByProjectKeyRequestBuilder,
      key,
      typeDefinition
    )

    expect(mockPostfn).toHaveBeenCalledWith({
      body: typeDefinition
    })
  })

  it('should not create a custom type if it already exists', async () => {
    const key = 'myKey'
    const typeDefinition = { info: 'myTypeDefinition' } as unknown as TypeDraft

    const mockGetResponseNoCreate = {
      body: {
        results: ['typeExsist']
      }
    }

    const mockPostfn = jest.fn().mockReturnThis()

    const mockApiRoot = {
      types: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      withKey: jest.fn().mockReturnThis(),
      post: mockPostfn,
      execute: jest.fn().mockResolvedValue(mockGetResponseNoCreate)
    }

    await createType(
      mockApiRoot as unknown as ByProjectKeyRequestBuilder,
      key,
      typeDefinition
    )

    expect(mockPostfn).not.toHaveBeenCalled()
  })
})
