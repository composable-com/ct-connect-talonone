import { TypeDraft } from '@commercetools/platform-sdk'
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'

const MY_EXTENSION_KEY = 'talonone-ct-extension'

export async function createMyExtension(
  apiRoot: ByProjectKeyRequestBuilder,
  applicationUrl: string
): Promise<void> {
  const {
    body: { results: extensions }
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${MY_EXTENSION_KEY}"`
      }
    })
    .execute()

  if (extensions.length > 0) {
    const extension = extensions[0]

    await apiRoot
      .extensions()
      .withKey({ key: MY_EXTENSION_KEY })
      .delete({
        queryArgs: {
          version: extension.version
        }
      })
      .execute()
  }

  await apiRoot
    .extensions()
    .post({
      body: {
        key: MY_EXTENSION_KEY,
        destination: {
          type: 'HTTP',
          url: applicationUrl
        },
        triggers: [
          { resourceTypeId: 'cart', actions: ['Create', 'Update'] },
          { resourceTypeId: 'order', actions: ['Create', 'Update'] }
        ]
      }
    })
    .execute()
}

export async function deleteMyExtension(
  apiRoot: ByProjectKeyRequestBuilder
): Promise<void> {
  const {
    body: { results: extensions }
  } = await apiRoot
    .extensions()
    .get({
      queryArgs: {
        where: `key = "${MY_EXTENSION_KEY}"`
      }
    })
    .execute()

  if (extensions.length > 0) {
    const extension = extensions[0]

    await apiRoot
      .extensions()
      .withKey({ key: MY_EXTENSION_KEY })
      .delete({
        queryArgs: {
          version: extension.version
        }
      })
      .execute()
  }
}

export async function createType(
  apiRoot: ByProjectKeyRequestBuilder,
  key: string,
  typeDefinition: TypeDraft
): Promise<void> {
  const {
    body: { results: types }
  } = await apiRoot
    .types()
    .get({
      queryArgs: {
        where: `key = "${key}"`
      }
    })
    .execute()

  if (types.length > 0) return

  await apiRoot
    .types()
    .post({
      body: typeDefinition
    })
    .execute()
}
