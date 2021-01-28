// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

// import * as msRest from "@azure/ms-rest-js";
// import * as msRestAzure from "@azure/ms-rest-azure-js";


import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AzureMediaServices } from "@azure/arm-mediaservices";
import azureAccountConfig from './config/azure'
import { BlobServiceClient } from '@azure/storage-blob'
import { ListContainerSasInput } from '@azure/arm-mediaservices/src/models/index'

//TODO: separation of concerns: project layers, helper methods, classes


async function uploadFileToStorageContainer(containerSasURL: string){

    //TODO: replace w/ url parser library
    const start = containerSasURL.indexOf('/', 10)
    const end = containerSasURL.indexOf('?');
    const containerName = containerSasURL.substring(start + 1, end)

    //TODO: after basic implementation use file upload stream method uploadStream() when receiving data from real client  
    const filePathForTesting = '/home/codespace/workspace/CloudVOD/resources/test.mov'         
    const fileNameForTesting = 'test.mov'

    const blobServiceClient = BlobServiceClient.fromConnectionString(azureAccountConfig.AZURE_STORAGE_CONNECTION_STRING);    
    const containerClient = blobServiceClient.getContainerClient(containerName);
            
    const blockBlobClient = containerClient.getBlockBlobClient(fileNameForTesting);
    const uploadResult = await blockBlobClient.uploadFile(filePathForTesting)
    console.log(uploadResult._response);    

}

async function uploadFileToAsset(client: AzureMediaServices, assetName: string){
    

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2)  
    
    //todo: use strict typing for read write
    const permissionOptions: ListContainerSasInput = {
        permissions: 'ReadWrite',
        expiryTime: currentDate
    }

    //!fixme do I need to add more async await?
    //!fixme: catch errors when getting urls
    //!fixme: check res._response for status 200 
        
    await client.assets.listContainerSas(azureAccountConfig.ResourceGroup, azureAccountConfig.AccountName, assetName, permissionOptions).then( async (containerListResponse) => {
        if(containerListResponse.assetContainerSasUrls){          
            const sasURL = containerListResponse.assetContainerSasUrls[0]
            uploadFileToStorageContainer(sasURL);
        }
    });
}

async function createAsset(fileName: string, client: AzureMediaServices){
    const assetName = `${fileName}-asset`
    try{
        // create an asset         
        await client.assets.createOrUpdate(azureAccountConfig.ResourceGroup, azureAccountConfig.AccountName, assetName, {}).then( (res) => {
            console.log(`creating asset result: ${res}`)
        })
        
    }catch(err){
        console.log(`Error trying to create asset for ${assetName} - ${err}`)
    }
    return assetName
}

function createMediaServiceClient(authResponse: msRestNodeAuth.AuthResponse){
    return new AzureMediaServices(authResponse.credentials, azureAccountConfig.SubscriptionId);   
}

//! FIXME: use the actual name of the file & pass in other details
function processFile(fileName: string){        
    //authenticating
    msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(azureAccountConfig.AadClientId, azureAccountConfig.AadSecret, azureAccountConfig.AadTenantId).then(async (authResponse) => {
        const client = createMediaServiceClient(authResponse);    
        const assetName = await createAsset(fileName, client);        
        await uploadFileToAsset(client, assetName);

    }).catch((err) => {
        console.log(`authentication error ${err}`);
    });
}

processFile(`test`);
