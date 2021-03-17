import { ConfigParams } from 'express-openid-connect'
import { AzureAccountConfig } from 'types'
import { ClientConfig } from 'pg'

import dotenv from 'dotenv'
dotenv.config()

export const azureAccountConfig: AzureAccountConfig = {
    AadClientId: process.env.AadClientId || 'N/A',
    AadSecret: process.env.AadSecret || 'N/A',
    AadTenantDomain: process.env.AadTenantDomain || 'N/A',
    AadTenantId: process.env.AadTenantId || 'N/A',
    AccountName: process.env.AccountName || 'N/A',
    Location: process.env.Location || 'North Central US',
    ResourceGroup: process.env.ResourceGroup || 'N/A',
    SubscriptionId: process.env.SubscriptionId || 'N/A',
    StorageConnection: process.env.StorageConnection || 'N/A',
    TransformName: process.env.TransformName || 'N/A',
    ArmAadAudience: 'https://management.core.windows.net/',
    ArmEndpoint: 'https://management.azure.com/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
}

export const openIDConfig: ConfigParams = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_CLIENT_SECRET || 'N/A',
    baseURL: process.env.BASE_URL || 'N/A',
    clientID: process.env.AUTH0_CLIENT_ID || 'N/A',
    issuerBaseURL: process.env.AUTH0_DOMAIN || 'N/A',
    routes: { login: false, logout: false },
}

export const videoDatabaseConfig: ClientConfig = {
    host: process.env.DB_SERVER_NAME || 'N/A',
    user: process.env.DB_ADMIN_USERNAME || 'N/A',     
    password: process.env.DB_ADMIN_PASS || 'N/A',
    database: process.env.DB_NAME || 'N/A',
    port: 5432,
    ssl: true
}