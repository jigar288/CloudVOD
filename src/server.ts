// * Retrieve environment variables
import dotenv from 'dotenv'
import { ConfigParams } from 'express-openid-connect'
import { AzureAccountConfig } from 'types'
import App from './app'

dotenv.config()

const azureAccountConfig: AzureAccountConfig = {
    AadClientId: process.env.AadClientId || '',
    AadSecret: process.env.AadSecret || '',
    AadTenantDomain: process.env.AadTenantDomain || '',
    AadTenantId: process.env.AadTenantId || '',
    AccountName: process.env.AccountName || '',
    Location: process.env.Location || 'North Central US',
    ResourceGroup: process.env.ResourceGroup || '',
    SubscriptionId: process.env.SubscriptionId || '',
    StorageConnection: process.env.StorageConnection || '',
    TransformName: process.env.TransformName || '',
    ArmAadAudience: 'https://management.core.windows.net/',
    ArmEndpoint: 'https://management.azure.com/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
}

const openIDConfig: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    routes: { login: false, logout: false },
}

/**
 * Start Express server.
 */
const app = new App(parseInt(process.env.API_PORT || '') || 5000, '/api', 'CloudVOD', azureAccountConfig, openIDConfig)

;(async () => {
    await app.start()
})()
