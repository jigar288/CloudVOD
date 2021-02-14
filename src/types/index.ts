import { Request, Response, NextFunction } from 'express'
import { Readable } from 'stream'

export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export type AzureAccountConfig = {
    AadClientId: string
    AadSecret: string
    AadTenantDomain: string
    AadTenantId: string
    AccountName: string
    Location: string
    ResourceGroup: string
    SubscriptionId: string
    StorageConnection: string
    TransformName: string
    ArmAadAudience: string
    ArmEndpoint: string
    activeDirectoryEndpointUrl: string
}

export type FileInfo = {
    fileName: string
    fileReadStream: Readable
}

export enum AssetType {
    Input,
    Output,
}

export type EncodingInfo = {
    filename: string
    inputAssetName: string
    outputAssetName: string
}
