// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

// import * as msRest from "@azure/ms-rest-js";
// import * as msRestAzure from "@azure/ms-rest-azure-js";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AzureMediaServices } from "@azure/arm-mediaservices";
import azureAccountConfig from './config/azure'


//authenticating and connecting to azure media service
//if it doesn't work try loginWithServicePrincipalSecret() instead
msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(azureAccountConfig.AadClientId, azureAccountConfig.AadSecret, azureAccountConfig.AadTenantId).then((authResponse) => {
    
    const client = new AzureMediaServices(authResponse.credentials, azureAccountConfig.SubscriptionId);    

    client.assets.list(azureAccountConfig.ResourceGroup, azureAccountConfig.AccountName).then((res) => {
        console.log(res)
    })
    
}).catch((err) => {
    console.log(err);
});


