import { Config } from 'jest';

const config: Config = {
    rootDir: './',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/tests/fileMock.ts',
    }
}

export default config;