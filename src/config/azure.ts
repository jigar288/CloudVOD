// Place azure related hard-coded configurations here

export interface AzureAccountConfig {
    AadClientId: string,
    AadSecret: string,
    AadTenantDomain: string,
    AadTenantId: string,
    AccountName: string,
    Location: string,
    ResourceGroup: string,
    SubscriptionId: string,
    AZURE_STORAGE_CONNECTION_STRING: string,
    ArmAadAudience: string,
    ArmEndpoint: string,
    activeDirectoryEndpointUrl: string,
}

// this object is necessary for silencing typescript type restriction
const azureAccountConfig : AzureAccountConfig = {
    AadClientId: process.env.AadClientId || 'placeholder',
    AadSecret: process.env.AadSecret || 'placeholder',
    AadTenantDomain: process.env.AadTenantDomain || 'placeholder',
    AadTenantId: process.env.AadTenantId || 'placeholder',
    AccountName: process.env.AccountName || 'placeholder',
    Location: process.env.Location || 'placeholder',
    ResourceGroup: process.env.ResourceGroup || 'placeholder',
    SubscriptionId: process.env.SubscriptionId || 'placeholder',
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING || 'placeholder',
    ArmAadAudience: 'https://management.core.windows.net/',
    ArmEndpoint: 'https://management.azure.com/',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
}

export default azureAccountConfig;

