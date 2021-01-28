// Place azure related hard-coded configurations here

interface AzureAccountConfig {
    AadClientId: string
    AadSecret: string
    AadTenantDomain: string
    AadTenantId: string
    AccountName: string
    Location: string
    ResourceGroup: string
    SubscriptionId: string
    ArmAadAudience: string
    ArmEndpoint: string
    activeDirectoryEndpointUrl: string
}

// this object is necessary for silencing typescript type restriction
const azureAccountConfig: AzureAccountConfig = {
    AadClientId: '***REMOVED***',
    AadSecret: '***REMOVED***',
    AadTenantDomain: '***REMOVED***',
    AadTenantId: '***REMOVED***',
    AccountName: '***REMOVED***',
    Location: 'North Central US',
    ResourceGroup: '***REMOVED***',
    SubscriptionId: '***REMOVED***',
    ArmAadAudience: 'https://management.core.windows.net/',
    ArmEndpoint: 'https://management.azure.com/%22%7D',
    activeDirectoryEndpointUrl: 'https://login.microsoftonline.com/',
}

export default azureAccountConfig
