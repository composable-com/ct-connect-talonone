import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createType, createMyExtension } from './actions'
import { run } from './post-deploy'

jest.mock('./actions')

describe('Post-deploy', () => {
    afterEach(() => {
        jest.resetAllMocks()
        jest.restoreAllMocks()
        jest.resetModules()
    })

    it('should run start function', async () => {
        (createMyExtension as jest.Mock).mockReturnValue({
            data: 'success',
          });

        await run()
        expect(createMyExtension).toHaveBeenCalled()
        expect(createType).toHaveBeenCalled()
    })

    it('should handle errors', async () => {
        const errorMessage = 'Something went wrong';
        (createMyExtension as jest.Mock).mockImplementation(() => {
          throw new Error(errorMessage);
        });
    
        const stderrSpy = jest.spyOn(process.stderr, 'write');
        await run();
    
        expect(stderrSpy).toHaveBeenCalledWith(`Post-deploy failed: Error: ${errorMessage}`);
        expect(process.exitCode).toBe(1);
      });
})