import * as path from 'path'
import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    setupFilesAfterEnv: [path.resolve(__dirname, 'src/tests/test.setup.ts')],
    verbose: true
}
export default config
