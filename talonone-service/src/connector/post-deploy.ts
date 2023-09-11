import dotenv from 'dotenv'
dotenv.config()

import { createType, createMyExtension } from './actions'

import { createApiRoot } from '../services/commercetools/client/create.client'
import { customerMetadataType, lineItemMetadataType } from '../services/utils/ct-types'

const CONNECT_APPLICATION_URL_KEY = 'CONNECT_SERVICE_URL'

async function postDeploy(properties: Map<string, unknown>): Promise<void> {
  const applicationUrl = properties.get(CONNECT_APPLICATION_URL_KEY)

  const apiRoot = createApiRoot()
  await createMyExtension(apiRoot, applicationUrl as string)

  const types = [lineItemMetadataType, customerMetadataType]
  await createType(
    apiRoot,
    customerMetadataType.key,
    customerMetadataType,
  )
  await createType(
    apiRoot,
    lineItemMetadataType.key,
    lineItemMetadataType,
  )
}

async function run(): Promise<void> {
  try {
    const properties = new Map(Object.entries(process.env))
    await postDeploy(properties)
  } catch (error) {
    process.stderr.write(`Post-deploy failed: ${error}`)
    process.exitCode = 1
  }
}

run()
