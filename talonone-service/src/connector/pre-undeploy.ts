import dotenv from 'dotenv'

import { deleteMyExtension } from './actions'
import { createApiRoot } from '../services/commercetools/client/create.client'
dotenv.config()

async function preUndeploy(): Promise<void> {
  const apiRoot = createApiRoot()
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
