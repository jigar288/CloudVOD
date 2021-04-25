import * as path from 'path'
import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
    setupFilesAfterEnv: [path.resolve(__dirname, 'src/tests/test.setup.ts')],
    verbose: true,
}
export default config
