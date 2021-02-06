// create a controller & add code for azure media service: asset, file upload

import { AzureMediaServices } from '@azure/arm-mediaservices'
import { Request, Response } from 'express'
import { Controller, Get, Post } from '.'
import { AzureAccountConfig, FileInfo } from 'types'
import { AssetType } from '../types/index'
import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob'
import { AssetsListContainerSasResponse, ListContainerSasInput } from '@azure/arm-mediaservices/esm/models'
import { AssetContainerPermission } from '@azure/arm-mediaservices/src/models/index'
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

    // todo: after file upload is complete --> send request to start encoding process
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
            console.log(`uploading file to storage container() successful w/ status: ${uploadResult._response.status}`)  
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
            console.log(`asset created: ${JSON.stringify(result.assetId)}`)
            return assetName
        } catch (error) {
            console.error(`Error trying to create asset for ${assetName} - ${error}`)
            return undefined
        }
    }

    // todo: pass in other parameters as necessary
    private async processFile(fileInfo: FileInfo): Promise<boolean> {
        let fileProcessingResult = false;
        const assetName = await this.createAsset(fileInfo.fileName, AssetType.Input)

        if(assetName)
            fileProcessingResult = await this.uploadFileToAsset(assetName, fileInfo)

        return fileProcessingResult;
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
        if(fileProcessingResult == true){
            const outputAssetName = await this.createAsset(fileInfo.fileName, AssetType.Output)
            // todo: send req to start encoding file process



            res.status(200).send('Successfully uploaded file. File encoding process for streaming will start soon.')
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
