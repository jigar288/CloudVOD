import express from 'express'
import cors from 'cors'
import multer from 'multer'
import pg from 'pg'
import { Controller } from './controllers'
import { Server } from 'http'
import { Middleware } from './types'
import { Sanity } from './controllers/Sanity'
import { AzureMediaServices } from '@azure/arm-mediaservices'
import { loginWithServicePrincipalSecretWithAuthResponse } from '@azure/ms-rest-nodeauth'
import { AzureAccountConfig } from 'types'
import { exit } from 'process'
import { MediaService } from './controllers/MediaService'
import { auth, ConfigParams as OpenIDConfigParams } from 'express-openid-connect'
import { Auth } from './controllers/Auth'
import { VideoDatabase } from './controllers/VideoDatabase'

export default class App {
    // # represents private variables - EC2020
    #app: express.Application
    #basePath: string
    #serviceName: string
    #port: number
    #azureConfig: AzureAccountConfig
    #openIDConfig: OpenIDConfigParams
    #videoDatabaseConfig: pg.ClientConfig 

    #server?: Server
    #mediaServicesClient?: AzureMediaServices
    #videoDatabaseClient?: pg.Client

    get app(): express.Application {
        return this.#app
    }

    constructor(port: number, basePath: string, serviceName: string, azureConfig: AzureAccountConfig, openIDConfig: OpenIDConfigParams, videoDatabaseConfig: pg.ClientConfig) {
        this.#app = express()
        this.#port = port
        this.#basePath = basePath
        this.#serviceName = serviceName
        this.#azureConfig = azureConfig
        this.#openIDConfig = openIDConfig
        this.#videoDatabaseConfig = videoDatabaseConfig

        this.#app.options('*', cors) //! FIXME: update cors configuration after deployment
    }

    public start = async (callBack?: Mocha.Done): Promise<void> => {
        await this.initialize()

        this.#server = this.#app.listen(this.#port, () => {
            console.log(`${this.#serviceName} has started on port ${this.#port}.`)
            if (callBack) callBack()
        })
    }

    public stop = async (callBack?: Mocha.Done): Promise<void> => {
        this.#server?.close(() => {
            if (callBack) callBack()
        })

        this.#videoDatabaseClient?.end() //closing DB connection
    }

    private async initialize(): Promise<void> {
        await this.initializeServices()

        if (!this.#mediaServicesClient || !this.#videoDatabaseClient) exit(1)

        // * Bind middlewares
        const middlewares = [auth(this.#openIDConfig), express.json(), express.urlencoded({ extended: true }), multer({ storage: multer.memoryStorage() }).single('filetoupload')]
        this.bindMiddlewares(middlewares)

        // * Create and controllers
        const sanityCrl = new Sanity('/')
        const authCrl = new Auth('/user')
        const mediaService = new MediaService('/az', this.#mediaServicesClient, this.#azureConfig)
        const videoDatabase = new VideoDatabase('/data', this.#videoDatabaseClient)

        // * Bind all the controllers
        this.bindControllers([mediaService, sanityCrl, authCrl, videoDatabase])
    }

    private async initializeServices(): Promise<void> {
        // * Connect with Azure Media Service and create the client
        const { AadClientId, AadSecret, AadTenantId, SubscriptionId, AadTenantDomain } = this.#azureConfig
        try {
            const response = await loginWithServicePrincipalSecretWithAuthResponse(AadClientId, AadSecret, AadTenantId)
            this.#mediaServicesClient = new AzureMediaServices(response.credentials, SubscriptionId)
            console.info('🌟 Connected with Azure Media Service')
        } catch (err) {
            console.error(`❌ Unable to authenticate with Azure for tenant: ${AadTenantDomain}`)
            console.error(`Debug: ` + err)
            throw err
        }

        // * Other clients and connections here
        this.#videoDatabaseClient = new pg.Client(this.#videoDatabaseConfig)

        this.#videoDatabaseClient.connect(err => {
            if (err) {
                console.error(`❌ Unable to connect to video database with host: ${this.#videoDatabaseConfig.host}`)
                throw err;
            }
            else {  
                console.info('🚀 Connected with Azure Video Database')
            }   
        });

    }

    // * Calls `app.use` on each middleware
    private bindMiddlewares = (middlewares: Middleware[]) => {
        middlewares.forEach((middle) => this.#app.use(middle))
    }

    // * Bind the routes for each controller and calls `app.use` for each controller router
    private bindControllers = (controllers: Controller[]) => {
        controllers.forEach((controller) => {
            controller.bindRoutes()
            this.#app.use(this.#basePath + controller.path, controller.router)
        })
    }
}
