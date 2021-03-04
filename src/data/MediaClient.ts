import { AzureMediaServices } from '@azure/arm-mediaservices'
import { Asset, AssetContainerSas, Job, JobInputUnion, JobOutputUnion, ListContainerSasInput, StreamingLocator } from '@azure/arm-mediaservices/esm/models'

import { generateUuid, RestResponse } from '@azure/ms-rest-js'
import { loginWithServicePrincipalSecretWithAuthResponse } from '@azure/ms-rest-nodeauth'
import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob'
import { Readable } from 'node:stream'
import { AssetType, AzureAccountConfig } from 'types'
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
        const { AadClientId, AadSecret, AadTenantId, SubscriptionId, StorageConnection } = azureConfig
        const response = await loginWithServicePrincipalSecretWithAuthResponse(AadClientId, AadSecret, AadTenantId)
        const mediaServicesClient = new AzureMediaServices(response.credentials, SubscriptionId)
        const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnection)

        return new MediaClient(azureConfig, mediaServicesClient, blobServiceClient)
    }

    public asset = {
        /**
         * Creates a new asset associated with the given filename
         *
         * This function will make sure the name of the asset will be unique
         *
         * @param filename A filename to be associated with the asset
         * @param assetName Whether the asset is an INPUT or an OUTPUT asset
         * @returns Promise<Asset>
         */
        create: async (filename: string, assetType: AssetType): Promise<Asset> => {
            const { ResourceGroup, AccountName } = this.#azureConfig
            const createAsset = this.#mediaServicesClient.assets.createOrUpdate

            let id: string
            while (true) {
                // * Generate a new uuid until a unique one is found
                id = generateUuid()
                const assetWithId = await this.asset.get(id)

                // * Break out of the loop if an asset doesn't exist
                if (assetWithId.assetId === undefined) break
            }

            return await createAsset(ResourceGroup, AccountName, id, { alternateId: filename, description: assetType === AssetType.Input ? 'INPUT' : 'OUTPUT' + ': ' + filename })
        },

        /**
         * Retrieves an asset with the given asset name
         *
         * @param assetName The name by which to search for the assets
         * @returns Promise<Asset>
         */
        get: async (assetName: string): Promise<Asset> => {
            const { ResourceGroup, AccountName } = this.#azureConfig
            const getAsset = this.#mediaServicesClient.assets.get

            return await getAsset(ResourceGroup, AccountName, assetName)
        },

        /**
         * Deletes an asset with the given asset name
         *
         * @param assetName The name of the asset to delete
         * @returns Promise<RestResponse>
         */
        delete: async (assetName: string): Promise<RestResponse> => {
            const { ResourceGroup, AccountName } = this.#azureConfig
            const deleteAsset = this.#mediaServicesClient.assets.deleteMethod

            return await deleteAsset(ResourceGroup, AccountName, assetName)
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
                const listContainers = this.#mediaServicesClient.assets.listContainerSas

                // * Create updated parameters
                const parameters: ListContainerSasInput = {
                    permissions: 'ReadWrite',
                    expiryTime: new Date(), // TODO Add an hour to expiry date
                }

                return await listContainers(ResourceGroup, AccountName, assetName, parameters)
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
                if (!doesExist) throw new Error("Container doesn't exist")

                return containerClient.getBlockBlobClient(filename).uploadStream(stream)
            },
        },
    }
    public video = {
        verify: undefined,

        /**
         *
         * @param filename
         * @param stream
         * @returns
         */
        upload: async (filename: string, stream: Readable): Promise<Asset> => {
            // * Create an asset for input
            const inputAsset = await this.asset.create(filename, AssetType.Input)
            if (!inputAsset.assetId || !inputAsset.name) throw new Error('Unable to create Input asset')

            // TODO: Create a new container if one doesn't exist
            const { assetContainerSasUrls } = await this.asset.containers.list(inputAsset.name)
            if (!assetContainerSasUrls || assetContainerSasUrls.length === 0) throw new Error('No container found')
            const containerName = parse(assetContainerSasUrls[0]).pathname.substr(1)

            // * Upload to the container
            const uploadResult = await this.asset.containers.upload(containerName, filename, stream)
            if (uploadResult._response.status !== 201) throw new Error(`Unable to upload ${filename} to ${containerName}`)

            return inputAsset
        },
    }
    public jobs = {
        /**
         * Create a re-encoding job for the given asset
         *
         * @param inputAsset Asset to perform the job on
         * @returns Promise<Job>
         */
        create: async (inputAsset: Asset): Promise<Job> => {
            const { ResourceGroup, AccountName, TransformName } = this.#azureConfig
            const createJob = this.#mediaServicesClient.jobs.create

            //! Verify that the asset exists and is associated with a file
            if (!inputAsset.name || !inputAsset.assetId || !inputAsset.alternateId) throw new Error("Given asset either doesn't exist or is not associated with a file")

            // * Create an output asset
            const outputAsset = await this.asset.create(inputAsset.alternateId, AssetType.Output)
            if (!outputAsset.name || !outputAsset.assetId || !outputAsset.alternateId) throw new Error('Unable to create a valid output asset')

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

            return await createJob(ResourceGroup, AccountName, TransformName, inputAsset.name, jobMetadata)
        },

        /**
         * Deletes a existing job given the job name
         *
         * @param jobName The job name to delete
         * @return Promise<RestResponse>
         */
        delete: async (jobName: string): Promise<RestResponse> => {
            const { ResourceGroup, AccountName, TransformName } = this.#azureConfig
            const deleteJob = this.#mediaServicesClient.jobs.deleteMethod

            return await deleteJob(ResourceGroup, AccountName, TransformName, jobName)
        },
    }

    streaming_locators = {
        /**
         * Creates a streaming locator associated with an asset
         *
         * @param assetName The name of the asset to use
         * @returns
         */
        create: async (assetName: string): Promise<StreamingLocator> => {
            const { ResourceGroup, AccountName } = this.#azureConfig
            const createStreamingLocator = this.#mediaServicesClient.streamingLocators.create

            const metadata: StreamingLocator = {
                assetName: assetName,
                streamingPolicyName: 'Predefined_ClearStreamingOnly',
            }

            return await createStreamingLocator(ResourceGroup, AccountName, assetName, metadata)
        },

        paths: {
            /**
             * Get a list of paths for a given streaming locator
             *
             * @param locatorName The name of the locator to get the paths for
             * @returns Promise<string[]>
             */
            list: async (locatorName: string): Promise<string[]> => {
                const { ResourceGroup, AccountName } = this.#azureConfig
                const streamingPaths = this.#mediaServicesClient.streamingLocators.listPaths

                const formats = (await streamingPaths(ResourceGroup, AccountName, locatorName)).streamingPaths
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
}

export default MediaClient
