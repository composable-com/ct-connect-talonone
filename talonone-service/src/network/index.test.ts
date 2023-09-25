import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Server } from './server';

jest.mock('express', () => {
    const mockedExpress = () => {
        return {
            use: jest.fn(),
            listen: jest.fn(),
        }
    };
    Object.defineProperty(mockedExpress, "json", { value: jest.fn() });
    Object.defineProperty(mockedExpress, "urlencoded", { value: jest.fn() });
    Object.defineProperty(mockedExpress, "Router", { value: jest.fn().mockReturnValue({route: jest.fn().mockReturnValue({post: jest.fn()})}) });
    return mockedExpress;
})

jest.mock('../services/commercetools/client/create.client', () => {
    return {
        getProject: jest.fn()
    }
})

describe('Server', () => {
    afterEach(() => {
        jest.resetAllMocks()
        jest.restoreAllMocks()
        jest.resetModules()
    })

    it('run start function', async () => {
        expect(Server.start()).resolves.not.toThrowError()
    })

    it('run stop function', async () => {
        expect(Server.stop()).resolves.not.toThrowError()
    })
})
