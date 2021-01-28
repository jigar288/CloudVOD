// Place azure related hard-coded configurations here
import dotenv from 'dotenv'
dotenv.config()

export interface AzureAccountConfig {
    AadClientId: string
    AadSecret: string
    AadTenantDomain: string
    AadTenantId: string
    AccountName: string
    Location: string
    ResourceGroup: string
    SubscriptionId: string
    StorageConnection: string
    ArmAadAudience: string
    ArmEndpoint: string
    activeDirectoryEndpointUrl: string
}

// this object is necessary for silencing typescript type restriction
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
    ArmAadAudience: 'https://management.core.windows.net/',
    ArmEndpoint: 'https://management.azure.com/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
}

export default azureAccountConfig
