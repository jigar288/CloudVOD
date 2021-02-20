// * Retrieve environment variables
import { azureAccountConfig, openIDConfig, videoDatabaseConfig } from '../config/service-configurations'
import assert from 'assert'
import App from '../app'
import got from 'got'


const checkEnvValuesExistence = ( (config) => {
    // Print out missing environment var in err
    for (const [key, value] of Object.entries(config)) {
        if (value == '') {
            console.error('Missing env var ' + key)
        }
    }
});

checkEnvValuesExistence(azureAccountConfig);
checkEnvValuesExistence(openIDConfig);
checkEnvValuesExistence(videoDatabaseConfig);


const app = new App(parseInt(process.env.API_PORT || '') || 5000, '/api', 'CloudVOD', azureAccountConfig, openIDConfig, videoDatabaseConfig)
describe('Basic', function () {
    before(function (done) {
        // * Wait for app to initialize
        app.start(function () {
            done()
        })
    })
    after(function (done) {
        // * Wait for app to stop
        app.stop(function () {
            done()
        })
    })

    describe('Basic HTTP Request Test', function () {
        it('Access /api/', async function () {
            got('http://127.0.0.1:5000/api')
                .then((response) => {
                    console.log(response.body)
                    assert.strictEqual(response.body, 'Application is running')
                })
                .catch((error) => {
                    assert.fail(error)
                })
        })
    })
})
