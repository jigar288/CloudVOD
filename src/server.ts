// * Retrieve environment variables
import { azureAccountConfig, openIDConfig, videoDatabaseConfig } from './config/service-configurations'
import App from './app'


/**
 * Start Express server.
 */
const app = new App(parseInt(process.env.API_PORT || '') || 5000, '/api', 'CloudVOD', azureAccountConfig, openIDConfig, videoDatabaseConfig)

;(async () => {
    await app.start()
})()
