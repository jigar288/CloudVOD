import { AzureMediaServices } from '@azure/arm-mediaservices'
import { Asset, AssetContainerSas, Job, JobInputUnion, JobOutputUnion, ListContainerSasInput, StreamingLocator } from '@azure/arm-mediaservices/esm/models'
import { generateUuid, RestResponse } from '@azure/ms-rest-js'
import { loginWithServicePrincipalSecretWithAuthResponse } from '@azure/ms-rest-nodeauth'
import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob'
import { Readable } from 'node:stream'
import { AssetType, AzureAccountConfig } from '../types'
import parse from 'url-parse'

class MediaClient {
    #azureConfig: AzureAccountConfig
    #mediaServicesClient: AzureMediaServices
    #blobServiceClient: BlobServiceClient

    /**
     * This constructor should not be called directly
     * Rather call the `build` method defined below
     *
     * @param azureConfig Azure Credentials to use
     * @param mediaServicesClient Client to interact with Azure Media Services
     * @param blobServiceClient Client to interact with storage containers
     */
    private constructor(azureConfig: AzureAccountConfig, mediaServicesClient: AzureMediaServices, blobServiceClient: BlobServiceClient) {
        this.#azureConfig = azureConfig
        this.#mediaServicesClient = mediaServicesClient
        this.#blobServiceClient = blobServiceClient
    }

    /**
     * Creates an instance of MediaClient asynchronously
     * This method should be used instead of the constructor
     *
     * @param azureConfig Azure Credentials to use
     * @returns Promise<MediaClient>
     * @throws Error if an AzureMediaServices object cannot be created using the given credentials
     */
    public static async build(azureConfig: AzureAccountConfig): Promise<MediaClient> {
        const { AadClientId, AadSecret, AadTenantId, SubscriptionId, StorageConnection, AadTenantDomain } = azureConfig

        try {
            const authResponse = await loginWithServicePrincipalSecretWithAuthResponse(AadClientId, AadSecret, AadTenantId)
            const mediaServicesClient = new AzureMediaServices(authResponse.credentials, SubscriptionId)
            const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnection)
            console.info('🌟 Connected with Azure Media Service')
            return new MediaClient(azureConfig, mediaServicesClient, blobServiceClient)
        } catch (err) {
            console.error(`❌ Unable to authenticate with Azure for tenant: ${AadTenantDomain}`)
            console.error(`Debug: ` + err)
            throw err
        }        

    }

    public asset = {
        /**
         * Creates a new asset associated with the given filename. 
         * This function ensures the name of the asset will be unique
         *
         * @param filename A filename to be associated with the asset
         * @param assetName Whether the asset is an INPUT or an OUTPUT asset
         * @returns Promise<Asset>
         */
        create: async (filename: string, assetType: AssetType): Promise<Asset> => {
            const { ResourceGroup, AccountName } = this.#azureConfig

            let id: string
            while (true) {
                // * Generate a new uuid until a unique one is found
                id = generateUuid()
                const assetWithId = await this.asset.get(id)

                // * Break out of the loop if an asset doesn't exist
                if (assetWithId.assetId === undefined) break
            }

            const creationResponse = await this.#mediaServicesClient.assets.createOrUpdate(ResourceGroup, AccountName, id, { 
                alternateId: filename, 
                description: assetType === AssetType.Input ? `INPUT: ${filename}` : `OUTPUT: ${filename}` 
            })

            if(creationResponse._response.status !== 201)
                throw new Error(`Unable to create ${assetType.toString()} asset for ${filename} Response: ${JSON.stringify(creationResponse._response)}`)


            return creationResponse
        },

        /**
         * Retrieves an asset with the given asset name
         *
         * @param assetName The name by which to search for the assets
         * @returns Promise<Asset>
         */
        get: async (assetName: string): Promise<Asset> => {
            const { ResourceGroup, AccountName } = this.#azureConfig

            const getResponse = await this.#mediaServicesClient.assets.get(ResourceGroup, AccountName, assetName);

            if(getResponse._response.status !== 200 && getResponse._response.status !== 404)
                throw new Error(`Error getting asset ${assetName} Response: ${JSON.stringify(getResponse._response)}`)   

            return getResponse;
        },

        /**
         * Deletes an asset with the given asset name
         *
         * @param assetName The name of the asset to delete
         * @returns Promise<RestResponse>
         */
        delete: async (assetName: string): Promise<RestResponse> => {
            const { ResourceGroup, AccountName } = this.#azureConfig

            const deleteResponse = await this.#mediaServicesClient.assets.deleteMethod(ResourceGroup, AccountName, assetName);
            // TODO: test this out & check success response code --> then code for error throwing

            return deleteResponse;
        },

        containers: {
            /**
             * Gets a list of container URL within the given asset
             *
             * @param assetName The name of the asset to get the list of containers for
             * @returns Promise<AssetContainerSas>
             */
            list: async (assetName: string): Promise<AssetContainerSas> => {
                const { ResourceGroup, AccountName } = this.#azureConfig

                const currentTimestamp = new Date();
                currentTimestamp.setHours(currentTimestamp.getHours() + 1)

                // * Create updated parameters
                const parameters: ListContainerSasInput = {
                    permissions: 'ReadWrite',
                    expiryTime: currentTimestamp, // TODO Add an hour to expiry date
                }

                const listResponse = await this.#mediaServicesClient.assets.listContainerSas(ResourceGroup, AccountName, assetName, parameters);
                if(listResponse._response.status !== 200)
                    throw new Error(`Unable to list containers for asset: ${assetName} response: ${JSON.stringify(listResponse._response)}`)

                return listResponse
            },

            /**
             * Uploads a file stream to a blob associated with the filename in the container with given name
             *
             * @param containerName
             * @param filename
             * @param stream
             * @returns Promise<BlobUploadCommonResponse>
             */
            upload: async (containerName: string, filename: string, stream: Readable): Promise<BlobUploadCommonResponse> => {
                const containerClient = this.#blobServiceClient.getContainerClient(containerName)
                const doesExist = await containerClient.exists()
                if (!doesExist) 
                    throw new Error(`Container doesn't exist with name: ${containerName}`)

                return await containerClient.getBlockBlobClient(filename).uploadStream(stream);     
            },
        },
    }
    public video = {
        verify: undefined,

        /**
         * This function uploads the given file to azure blob storage service using a readable stream 
         * 
         * @param filename
         * @param stream
         * @returns 
         */
        upload: async (filename: string, stream: Readable): Promise<Asset> => {
            // * Create an asset for input
            const inputAsset = await this.asset.create(filename, AssetType.Input)
            if (!inputAsset.assetId || !inputAsset.name) 
                throw new Error('Unable to create Input asset')

            // TODO: Create a new container if one doesn't exist
            const { assetContainerSasUrls } = await this.asset.containers.list(inputAsset.name)
            if (!assetContainerSasUrls || assetContainerSasUrls.length === 0) 
                throw new Error('No container found')
            const containerName = parse(assetContainerSasUrls[0]).pathname.substr(1)

            console.info(`Uploading ${filename} ...`)   

            // * Upload to the container
            const uploadResult = await this.asset.containers.upload(containerName, filename, stream)
            if (uploadResult._response.status !== 201) 
                throw new Error(`Unable to upload ${filename} to ${containerName} res: ${JSON.stringify(uploadResult._response)}`)

            return inputAsset
        },
    }
    public jobs = {
        /**
         * Create a encoding job for the given asset
         *
         * @param inputAsset Asset to perform the job on
         * @returns Promise<Job>
         */
        create: async (inputAsset: Asset): Promise<Job> => {
            const { ResourceGroup, AccountName, TransformName } = this.#azureConfig

            //* verifies that the asset exists and is associated with a file
            if (!inputAsset.name || !inputAsset.assetId || !inputAsset.alternateId) 
                throw new Error("Given asset either doesn't exist or is not associated with a file")

            // * Create an output asset
            const outputAsset = await this.asset.create(inputAsset.alternateId, AssetType.Output)
            if (!outputAsset.name || !outputAsset.assetId || !outputAsset.alternateId) 
                throw new Error(`Unable to create a valid output asset for corresponding input asset ${inputAsset}`)

            const jobInputAsset: JobInputUnion = {
                odatatype: '#Microsoft.Media.JobInputAsset',
                files: [inputAsset.alternateId],
                assetName: inputAsset.name,
            }

            const jobOutputAsset: JobOutputUnion = {
                odatatype: '#Microsoft.Media.JobOutputAsset',
                assetName: outputAsset.name,
            }

            const jobMetadata: Job = {
                input: jobInputAsset,
                outputs: [jobOutputAsset],
            }

            console.info(`submitting encoding job for ${inputAsset.name}`)

            const jobSubmissionResult = await this.#mediaServicesClient.jobs.create(ResourceGroup, AccountName, TransformName, inputAsset.name, jobMetadata);
            if(jobSubmissionResult._response.status !== 201) 
                throw new Error(`Unable to submit encoding job for input asset ${inputAsset} res: ${JSON.stringify(jobSubmissionResult._response)}`)

            return jobSubmissionResult
        },

        /**
         * Deletes a existing job given the job name
         *
         * @param jobName The job name to delete
         * @return Promise<RestResponse>
         */
        delete: async (jobName: string): Promise<RestResponse> => {
            const { ResourceGroup, AccountName, TransformName } = this.#azureConfig
            // TODO: check http response & throw error
            return await this.#mediaServicesClient.jobs.deleteMethod(ResourceGroup, AccountName, TransformName, jobName)
        },
    }

    streaming_locator = {
        /**
         * Creates a streaming locator associated with an asset
         *
         * @param outputAssetName The name of the output asset to use
         * @returns
         */
        create: async (outputAssetName: string): Promise<StreamingLocator> => {
            const { ResourceGroup, AccountName } = this.#azureConfig

            const metadata: StreamingLocator = {
                assetName: outputAssetName,
                streamingPolicyName: 'Predefined_ClearStreamingOnly',
            }

            const streamingLocatorsName = this.streaming_locator.getFormattedName(outputAssetName)
            console.info(`Creating streaming locator ${streamingLocatorsName}`)

            const creationResponse = await this.#mediaServicesClient.streamingLocators.create(ResourceGroup, AccountName, streamingLocatorsName, metadata)
            if(creationResponse._response.status !== 201)
                throw new Error(`Unable to create streaming locator: ${streamingLocatorsName}. Response: ${JSON.stringify(creationResponse._response)}`)

            return creationResponse
        },

        /**
         * Generates name for streaming locator in a consistent format that can be used by other functions
         * 
         * @param outputAssetName The name of the output asset 
         * @returns streamingLocatorsName  
         */
        getFormattedName: (outputAssetName: string): string => {
            return `${outputAssetName}-streaming-locator`;
        },

        paths: {
            /**
             * ! FIXME: azure api updated & no extra parsing needed: return entire formats object instead of parsing paths
             * Get a list of paths for a given streaming locator
             *
             * @param streamingLocatorName The name of the locator to get the paths for
             * @returns Promise<string[]>
             */
            list: async (streamingLocatorName: string): Promise<string[]> => {
                const { ResourceGroup, AccountName } = this.#azureConfig

                const listResponse = await this.#mediaServicesClient.streamingLocators.listPaths(ResourceGroup, AccountName, streamingLocatorName);

                if(listResponse._response.status !== 200)
                    throw new Error(`Error trying to list paths for locator: ${streamingLocatorName} res: ${JSON.stringify(listResponse._response)}`)

                const formats = listResponse.streamingPaths                                               
                if (!formats) return []

                const paths = formats
                    .map((format) => (format.paths ? format.paths : []))
                    .reduce((a, b) => [...a, ...b])
                    .map((path) => path.split('\n'))
                    .reduce((a, b) => [...a, ...b])

                return paths
            },
        },
    }

    // ? should this be moved elsewhere
    streaming_urls = {
        /**
         * ! FIXME: return type of streaming protorol w/ url (HLS, smooth streaming, etc)
         * gets a list of streaming urls for viewing VOD using video players
         * 
         * @param outputAssetName The name of the output asset 
         * @returns streamingUrlList 
         */
        get: async (outputAssetName: string): Promise<string[]> => {
            
            const streamingEndpointHostName = process.env.DEFAULT_STREAMING_ENDPOINT_HOSTNAME

            if(!outputAssetName || !streamingEndpointHostName)
                throw new Error(`Insufficient info outputAssetName: ${outputAssetName} streamingEndpointHostName: ${streamingEndpointHostName}`)
                        
            const streamingLocatorName = this.streaming_locator.getFormattedName(outputAssetName);     
            const streamingPaths = await this.streaming_locator.paths.list(streamingLocatorName)
            const streamingUrlList: string[] = []
            streamingPaths.forEach( (path) => {
                const streamingURL = `https://${streamingEndpointHostName}${path}`
                streamingUrlList.push(streamingURL)
            })

            return streamingUrlList;
        } 
    }
}

export default MediaClient