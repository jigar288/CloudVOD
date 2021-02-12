// * Retrieve environment variables
import dotenv from 'dotenv'
import { AzureAccountConfig } from 'types'
import assert from 'assert';
import App from '../app'
import got from 'got'

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

// Print out missing environment var in err
for (const [key, value] of Object.entries(azureAccountConfig)) {
    if (value == ""){
        console.error("Missing env var "+ key)
    }
}

const app = new App(parseInt(process.env.API_PORT || '') || 5000, '/api', 'CloudVOD', azureAccountConfig)
describe('Basic', function() {
    before(function(done){
        // * Wait for app to initialize
        app.start(function(){
            done()
        });
    });
    after(function(done){
        // * Wait for app to stop
        app.stop(function(){
            done()
        });
    });
    
    describe('Basic HTTP Request Test', function() {
        it('Access /api/', async function() {
            got('http://127.0.0.1:5000/api').then(response => {
                console.log(response.body);
                assert.strictEqual(response.body, "Application is running");
            }).catch(error => {
                assert.fail(error)
            });
        });
    });
});