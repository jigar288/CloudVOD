// * Retrieve environment variables
import dotenv from 'dotenv'
import App from './app'

dotenv.config()

/**
 * Start Express server.
 */
const app = new App(parseInt(process.env.API_PORT || '') || 5000, '/api', 'CloudVOD')

;(async () => {
    app.listen()
})()
