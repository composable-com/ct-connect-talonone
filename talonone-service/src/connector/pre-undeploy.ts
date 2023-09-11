import dotenv from 'dotenv'
dotenv.config()

import { deleteMyExtension } from './actions'
import { createApiRoot } from '../services/commercetools/client/create.client'

async function preUndeploy(): Promise<void> {
  const apiRoot = await createApiRoot()
  await deleteMyExtension(apiRoot)
}

async function run(): Promise<void> {
  try {
    await preUndeploy()
  } catch (error) {
    process.stderr.write(`Pre-undeploy failed: ${error}`)
    process.exitCode = 1
  }
}

run()
