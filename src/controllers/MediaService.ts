// create a controller & add code for azure media service: asset, file upload

import { AzureMediaServices } from '@azure/arm-mediaservices'
import { Request, Response } from 'express'
import { Controller, Get, Post } from '.'
import { AzureAccountConfig, FileInfo, EncodingInfo } from 'types'
import { AssetType } from '../types/index'
import { BlobServiceClient } from '@azure/storage-blob'
import { JobsCreateResponse, ListContainerSasInput } from '@azure/arm-mediaservices/esm/models'
import { AssetContainerPermission, Job, JobInputClipUnion, JobInputUnion, JobOutputUnion, JobOutputAsset, JobInputAsset, StreamingLocator } from '@azure/arm-mediaservices/src/models/index'
import parse from 'url-parse'
import bufferToStream from 'into-stream'
import { requiresAuth } from 'express-openid-connect'

export class MediaService extends Controller {
    #mediaServicesClient: AzureMediaServices
    #azureConfig: AzureAccountConfig

    constructor(path: string, mediaServicesClient: AzureMediaServices, azureConfig: AzureAccountConfig) {
        super(path)
        this.#mediaServicesClient = mediaServicesClient
        this.#azureConfig = azureConfig
    }

    private async uploadFileToStorageContainer(containerSasURL: string, fileInfo: FileInfo): Promise<boolean> {
        let containerName = parse(containerSasURL, true).pathname
        containerName = containerName.substring(1, containerName.length)

        const { StorageConnection } = this.#azureConfig

        //* get storage clients
        const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnection)
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(fileInfo.fileName)

        try {
            const uploadResult = await blockBlobClient.uploadStream(fileInfo.fileReadStream)
            if (uploadResult._response.status == 201) {
                console.info(`uploading file (${fileInfo.fileName}) to storage container() successful w/ status: ${uploadResult._response.status}`)
                return true
            }
        } catch (error) {
            console.error(`error uploading file (${fileInfo.fileName}) ${error}`)
        }

        return false
    }

    private async createStreamingLocator(assetName: string, streamingPolicyName: string) {
        const { ResourceGroup, AccountName } = this.#azureConfig
        const streamingLocatorsName = `${assetName}-streaming-locator`

        const streamingLocatorMetadata: StreamingLocator = {
            assetName: assetName,
            streamingPolicyName: streamingPolicyName,
        }

        try {
            const response = await this.#mediaServicesClient.streamingLocators.create(ResourceGroup, AccountName, streamingLocatorsName, streamingLocatorMetadata)

            if (response._response.status == 201) {
                console.info(`Successfully created streaming locator for ${assetName}`)
                return true
            }
        } catch (error) {
            console.error(`Error creating streaming locator for ${assetName}`)
        }

        return false
    }

    private async getStreamingEndpointHostName(streamingEndpointName: string) {
        const { ResourceGroup, AccountName } = this.#azureConfig
        let streamingEndpointHostName: string | undefined

        try {
            const response = await this.#mediaServicesClient.streamingEndpoints.get(ResourceGroup, AccountName, streamingEndpointName)

            if (response._response.status == 200) {
                streamingEndpointHostName = response.hostName
            }
        } catch (error) {
            console.error(`Error getting streaming endpoint: ${error}`)
        }

        return streamingEndpointHostName
    }

    private async getStreamingPath(streamingLocatorName: string) {
        const { ResourceGroup, AccountName } = this.#azureConfig
        let streamingPath: string | undefined

        try {
            const response = await this.#mediaServicesClient.streamingLocators.listPaths(ResourceGroup, AccountName, streamingLocatorName)

            if (response._response.status == 200) {
                const streamingPaths = response.streamingPaths?.shift()
                const paths = streamingPaths?.paths
                if (paths) {
                    const firstPath = paths[0]
                    streamingPath = firstPath.split('\n')[0]
                }
            }
        } catch (error) {
            console.error(`Error getting streaming endpoint for streaming locator ${streamingLocatorName} - ${error}`)
        }

        return streamingPath
    }

    private async getStreamingURL(streamingLocatorName: string, streamingEndpointName: string): Promise<string | undefined> {
        let streamingURL: string | undefined = undefined
        if (streamingLocatorName) {
            const streamingEndpointHostName = await this.getStreamingEndpointHostName(streamingEndpointName)
            if (streamingEndpointHostName) {
                const streamingPath = await this.getStreamingPath(streamingLocatorName)
                if (streamingPath) streamingURL = `https://${streamingEndpointHostName}${streamingPath}`
            }
        }
        return streamingURL
    }

    private async uploadFileToAsset(assetName: string, fileInfo: FileInfo): Promise<boolean> {
        const currentDate = new Date()
        currentDate.setHours(currentDate.getHours() + 2)

        const permission: AssetContainerPermission = 'ReadWrite'
        const permissionOptions: ListContainerSasInput = {
            permissions: permission,
            expiryTime: currentDate,
        }

        const { ResourceGroup, AccountName } = this.#azureConfig

        try {
            const containerList = await this.#mediaServicesClient.assets.listContainerSas(ResourceGroup, AccountName, assetName, permissionOptions)
            if (containerList._response.status == 200 && containerList.assetContainerSasUrls) {
                const containerSasURL = containerList.assetContainerSasUrls[0]
                return this.uploadFileToStorageContainer(containerSasURL, fileInfo)
            }
        } catch (error) {
            console.error(`error trying to get container: ${error}`)
        }

        return false
    }

    private async createAsset(fileName: string, assetType: AssetType): Promise<string | undefined> {
        let assetName: string

        if (assetType == AssetType.Input) {
            assetName = `${fileName}-input-asset`
        } else if (assetType == AssetType.Output) {
            assetName = `${fileName}-output-asset`
        } else {
            return undefined
        }

        try {
            const { ResourceGroup, AccountName } = this.#azureConfig
            const result = await this.#mediaServicesClient.assets.createOrUpdate(ResourceGroup, AccountName, assetName, {})
            console.info(`asset created with name: ${assetName} & ID: ${JSON.stringify(result.assetId)}`)
            return assetName
        } catch (error) {
            console.error(`Error trying to create asset for ${assetName} - ${error}`)
            return undefined
        }
    }

    //TODO: Only 1 input & output asset should be created per user & should postfix a unique ID to asset name. Contents should be uploaded to existing assets
    private async processFile(fileInfo: FileInfo): Promise<boolean> {
        let isFileUploadSuccessful = false
        let isFileEncodingSubmitted = false
        let isStreamingLocatorStarted = false
        const inputAssetName = await this.createAsset(fileInfo.fileName, AssetType.Input)

        if (inputAssetName) {
            isFileUploadSuccessful = await this.uploadFileToAsset(inputAssetName, fileInfo)
        }

        if (isFileUploadSuccessful) {
            const outputAssetName = await this.createAsset(fileInfo.fileName, AssetType.Output)

            if (inputAssetName && outputAssetName) {
                const encodingInfo: EncodingInfo = {
                    filename: fileInfo.fileName,
                    inputAssetName: inputAssetName,
                    outputAssetName: outputAssetName,
                }
                isFileEncodingSubmitted = await this.startEncoding(encodingInfo)
            }

            if (isFileEncodingSubmitted && outputAssetName) {
                const streamingPolicyName = 'Predefined_ClearStreamingOnly'
                isStreamingLocatorStarted = await this.createStreamingLocator(outputAssetName, streamingPolicyName)
            }
        }
        return isStreamingLocatorStarted
    }

    private createJobMetadata(encodingInfo: EncodingInfo) {
        const jobInputAsset: JobInputAsset = {
            odatatype: '#Microsoft.Media.JobInputAsset',
            files: [encodingInfo.filename],
            assetName: encodingInfo.inputAssetName,
        }

        const jobInputClipUnion: JobInputClipUnion = jobInputAsset
        const jobInputUnion: JobInputUnion = jobInputClipUnion

        const jobOutputAsset: JobOutputAsset = {
            odatatype: '#Microsoft.Media.JobOutputAsset',
            assetName: encodingInfo.outputAssetName,
        }

        const jobOutputUnion: JobOutputUnion = jobOutputAsset

        const jobMetadata: Job = {
            input: jobInputUnion,
            outputs: [jobOutputUnion],
        }

        return jobMetadata
    }

    private async startEncoding(encodingInfo: EncodingInfo) {
        const { ResourceGroup, AccountName, TransformName } = this.#azureConfig
        let jobCreationResponse: JobsCreateResponse

        const jobMetadata: Job = this.createJobMetadata(encodingInfo)
        const randomID = Math.floor(Math.random() * 1001)
        const jobName = `${encodingInfo.filename}-encoding-job-${randomID}`

        try {
            jobCreationResponse = await this.#mediaServicesClient.jobs.create(ResourceGroup, AccountName, TransformName, jobName, jobMetadata)
            if (jobCreationResponse._response.status == 201) {
                console.info(`Job successfully created for file (${encodingInfo.filename}) with status: ${jobCreationResponse._response.status}`)
                return true
            }
        } catch (error) {
            console.error(`Encoding job failed for file name: ${encodingInfo.filename} with error: ${error}`)
        }

        return false
    }

    //todo: consider limiting size of file
    //todo: send file upload info to proxy that fronts a DB
    @Post('/file-upload')
    async upload_file(_req: Request, res: Response): Promise<void> {
        const fileReadStream = bufferToStream(_req.file.buffer)

        const fileInfo: FileInfo = {
            fileName: _req.file.originalname,
            fileReadStream: fileReadStream,
        }

        const fileProcessingResult = await this.processFile(fileInfo)
        if (fileProcessingResult) res.status(200).send('Successfully uploaded file. File encoding process for streaming has started.')
        else res.status(500).send('Error uploading file. Its must be on our end. Please try again.')
    }

    //Fixme: update client at later date - this is only for testing purposes
    @Get('/file-upload')
    async file_uploader(_req: Request, res: Response): Promise<void> {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write('<form action="file-upload" method="post" enctype="multipart/form-data">')
        res.write('<input type="file" name="filetoupload"><br>')
        res.write('<input type="submit">')
        res.write('</form>')
        return res.end()
    }

    @Get('/video-test', [requiresAuth()])
    async video_test(req: Request, res: Response): Promise<void> {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(
            `
            <html>
            <link href="http://amp.azure.net/libs/amp/2.3.6/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
            <script src="http://amp.azure.net/libs/amp/2.3.6/azuremediaplayer.min.js"></script>

            <script>
                function handleOnClick() {

                    var myPlayer = amp(
                        'azuremediaplayer', {
                            /* Options */
                            techOrder: ["azureHtml5JS", "flashSS", "html5FairPlayHLS", "silverlightSS", "html5"],
                            "nativeControlsForTouch": false,
                            autoplay: false,
                            controls: true,
                            width: "640",
                            height: "400",
                            poster: ""
                        },
                        function () {
                            console.log('Good to go!');
                            // add an event listener
                            this.addEventListener('ended', function () {
                                console.log('Finished!');
                            })
                        },
                    );



                    myPlayer.src([{
                        src: document.getElementById('source_input').value,
                        type: "application/vnd.ms-sstr+xml"
                    }]);
                }
            </script>

            <video id="azuremediaplayer" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0"></video>
            <br>
            Streaming URL Here:
            <input type="text" id="source_input"> <button id="source_button" onclick={handleOnClick}>Start Streaming</button>

            <script>
                document.getElementById('source_button').onclick = handleOnClick
            </script>

            </html>
            `,
        )
        res.end()
    }
}

/**
 *
 * TODO: [other tasks]
 *
 * - Start streaming endpoint via portal
 * - create streaming URLs
 *      - monitor encoding job via event grid
 *      - once job finishes get the streaming URL
 *      - add streaming url to DB
 *
 * [low priority tasks]
 * - delete job after its finished & output assets are created (50k limit)
 * ! why does port forwarding stop after the file uploader route?
 */
