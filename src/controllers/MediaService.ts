// create a controller & add code for azure media service: asset, file upload

import { AzureMediaServices } from '@azure/arm-mediaservices'
import { Request, Response } from 'express'
import { Controller, Get, Post } from '.'
import { AzureAccountConfig, FileInfo, EncodingInfo } from 'types'
import { AssetType } from '../types/index'
import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob'
import { AssetsListContainerSasResponse, JobsCreateResponse, ListContainerSasInput } from '@azure/arm-mediaservices/esm/models'
import { AssetContainerPermission, Job, JobInputClipUnion, JobInputUnion, JobOutputUnion, JobOutputAsset, JobInputAsset } from '@azure/arm-mediaservices/src/models/index'
import parse from 'url-parse'
import bufferToStream from 'into-stream'

export class MediaService extends Controller {
    #mediaServicesClient: AzureMediaServices
    #azureConfig: AzureAccountConfig

    constructor(path: string, mediaServicesClient: AzureMediaServices, azureConfig: AzureAccountConfig) {
        super(path)
        this.#mediaServicesClient = mediaServicesClient
        this.#azureConfig = azureConfig
    }

    private async uploadFileToStorageContainer(containerSasURL: string, fileInfo: FileInfo): Promise<boolean> {
        let containerName = parse(containerSasURL, true).pathname;
        containerName = containerName.substring(1, containerName.length)

        const { StorageConnection } = this.#azureConfig

        //* get storage clients
        const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnection)
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(fileInfo.fileName)
        
        let uploadResult: BlobUploadCommonResponse;
        try{
            uploadResult = await blockBlobClient.uploadStream(fileInfo.fileReadStream);            
        }catch(error){
            console.error(`error uploading file ${error}`)
            return false;
        }

        if(uploadResult._response.status == 201){ 
            console.info(`uploading file to storage container() successful w/ status: ${uploadResult._response.status}`)  
            return true;
        }else{
            return false
        }
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
        let containerList: AssetsListContainerSasResponse;

        try{                    
            containerList = await this.#mediaServicesClient.assets.listContainerSas(ResourceGroup, AccountName, assetName, permissionOptions);        
        }catch(error){
            console.error(`error trying to get container: ${error}`)
            return false;
        }

        if(containerList._response.status == 200 && containerList.assetContainerSasUrls){
            const containerSasURL = containerList.assetContainerSasUrls[0]
            return this.uploadFileToStorageContainer(containerSasURL, fileInfo);
        }
        return false;
    }

    private async createAsset(fileName: string, assetType: AssetType): Promise<string | undefined> {
        
        let assetName: string;

        if(assetType == AssetType.Input){
            assetName = `${fileName}-input-asset`
        }else if(assetType == AssetType.Output){
            assetName = `${fileName}-output-asset`
        }else{
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
        let fileUploadResult = false;
        let fileEncodingResult = false;
        const inputAssetName = await this.createAsset(fileInfo.fileName, AssetType.Input)

        if(inputAssetName){
            fileUploadResult = await this.uploadFileToAsset(inputAssetName, fileInfo)
        }

        if(fileUploadResult){
            const outputAssetName = await this.createAsset(fileInfo.fileName, AssetType.Output)

            if(inputAssetName && outputAssetName){
                const encodingInfo: EncodingInfo = {
                    filename: fileInfo.fileName,
                    inputAssetName: inputAssetName,
                    outputAssetName: outputAssetName
                }
                fileEncodingResult = await this.startEncoding(encodingInfo);
            }
        }                    
        return fileEncodingResult;
    }

    private createJobMetadata(encodingInfo: EncodingInfo){
        
        const jobInputAsset: JobInputAsset = {
            odatatype: "#Microsoft.Media.JobInputAsset",
            files: [encodingInfo.filename],
            assetName: encodingInfo.inputAssetName
        }

        const jobInputClipUnion: JobInputClipUnion = jobInputAsset;
        const jobInputUnion: JobInputUnion = jobInputClipUnion;

        const jobOutputAsset: JobOutputAsset = {
            odatatype: "#Microsoft.Media.JobOutputAsset",
            assetName: encodingInfo.outputAssetName       
        }       
        
        const jobOutputUnion: JobOutputUnion = jobOutputAsset;
        
        const jobMetadata: Job = {
            input: jobInputUnion,
            outputs: [jobOutputUnion]
        }        

        return jobMetadata;
    }

    private async startEncoding(encodingInfo: EncodingInfo){        
        const { ResourceGroup, AccountName, TransformName } = this.#azureConfig
        let jobCreationResponse: JobsCreateResponse;

        const jobMetadata: Job = this.createJobMetadata(encodingInfo);
        const randomID = Math.floor(Math.random() * 1001)
        const jobName = `${encodingInfo.filename}-encoding-job-${randomID}`
        
        try{
            jobCreationResponse = await this.#mediaServicesClient.jobs.create(ResourceGroup, AccountName, TransformName, jobName, jobMetadata);                    
            console.info(`Job successfully created with status: ${jobCreationResponse._response.status}`)
            if(jobCreationResponse._response.status == 201)
                return true;
        }catch(error){
            console.error(`Encoding job failed for file name: ${encodingInfo.filename} with error: ${error}`)
        }    

        return false;
    }

    //todo: consider limiting size of file
    //todo: send file upload info to proxy that fronts a DB 
    @Post('/file-upload')
    async upload_file(_req: Request, res: Response): Promise<void> {

        const fileReadStream = bufferToStream(_req.file.buffer);

        const fileInfo: FileInfo = {
            fileName: _req.file.originalname,
            fileReadStream: fileReadStream
        }
        
        const fileProcessingResult = await this.processFile(fileInfo);
        if(fileProcessingResult){
            res.status(200).send('Successfully uploaded file. File encoding process for streaming has started.')
        }else{
            res.status(500).send('Error uploading file. Its must be on our end. Please try again.')
        }        
    }    

    //Fixme: update client at later date - this is only for testing purposes
    @Get('/file-uploader')
    async file_uploader(_req: Request, res: Response): Promise<void> {    
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="file-upload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
    
}


/**
 * 
 * TODO: [other tasks]
 * 
 * - create streaming locator per asset 
 *      - create this when new asset is created
 * - Start streaming endpoint 
 *      - (only once)
 * - create streaming URLs: concat streaming endpoint host name + steaming locator path
 *      - may not be possible until file encoding is done since .ism file is needed
 *      - if so then will need to use event grid to monitor task
 * 
 * [low priority tasks]
 * 
 * - monitor encoding job via event grid
 * - delete job after its finished & output assets are created (50k limit)
 * 
 * ! why does port forwarding stop after the file uploader route?

 */