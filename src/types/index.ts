import { Request, Response, NextFunction } from 'express'
import { ReadStream } from 'fs'
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
    ArmAadAudience: string
    ArmEndpoint: string
    activeDirectoryEndpointUrl: string
}

export type FileInfo = {
    fileName: string;
    fileReadStream: Readable
}

export enum AssetType {
    Input,
    Output
}