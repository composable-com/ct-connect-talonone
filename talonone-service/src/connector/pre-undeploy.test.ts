import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { deleteMyExtension } from './actions';
import { run } from './pre-undeploy';
import { createApiRoot } from '../services/commercetools/client/create.client'

jest.mock('./actions')
jest.mock('../services/commercetools/client/create.client')

describe('Pre-undeploy', () => {
  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.resetModules()
  })

  it('should run start function', async () => {
    (deleteMyExtension as jest.Mock).mockReturnValue({
      data: 'success',
    });

    await run()
    expect(createApiRoot).toHaveBeenCalled()
    expect(deleteMyExtension).toHaveBeenCalled()
  })

  it('should handle errors', async () => {
    const errorMessage = 'Something went wrong';
    (deleteMyExtension as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const stderrSpy = jest.spyOn(process.stderr, 'write');
    await run();

    expect(stderrSpy).toHaveBeenCalledWith(`Pre-undeploy failed: Error: ${errorMessage}`);
    expect(process.exitCode).toBe(1);
  });
})