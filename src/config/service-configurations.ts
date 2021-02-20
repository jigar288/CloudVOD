import { ConfigParams } from 'express-openid-connect'
import { AzureAccountConfig } from 'types'
import { ClientConfig } from 'pg'

import dotenv from 'dotenv'
dotenv.config()

export const azureAccountConfig: AzureAccountConfig = {
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

export const openIDConfig: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_DOMAIN,
    routes: { login: false, logout: false },
}

export const videoDatabaseConfig: ClientConfig = {
    host: process.env.DB_SERVER_NAME,
    user: process.env.DB_ADMIN_USERNAME,     
    password: process.env.DB_ADMIN_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: true
}