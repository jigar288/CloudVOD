import express from 'express'
import cors from 'cors'
import { Controller } from './controllers'
import { Server } from 'http'
import { Middleware } from './types'
import { Sanity } from './controllers/Sanity'
import { AzureMediaServices } from '@azure/arm-mediaservices'
import { loginWithServicePrincipalSecretWithAuthResponse } from '@azure/ms-rest-nodeauth'
import { AzureAccountConfig } from 'types'
import { exit } from 'process'
import { MediaService } from './controllers/MediaService'
import multer from 'multer'
export default class App {
    // # represents private variables - EC2020
    #app: express.Application
    #basePath: string
    #serviceName: string
    #port: number
    #azureConfig: AzureAccountConfig

    #server?: Server
    #mediaServicesClient?: AzureMediaServices

    get app(): express.Application {
        return this.#app
    }

    constructor(port: number, basePath: string, serviceName: string, azureConfig: AzureAccountConfig) {
        this.#app = express()
        this.#port = port
        this.#basePath = basePath
        this.#serviceName = serviceName
        this.#azureConfig = azureConfig

        this.#app.options('*', cors)
    }

    public start = async (callBack?: Mocha.Done): Promise<void> => {
        await this.initialize()

        this.#server = this.#app.listen(this.#port, () => {
            console.log(`${this.#serviceName} has started on port ${this.#port}.`)
            if (callBack) callBack();
        })
    }

    public stop = async (callBack?: Mocha.Done): Promise<void> => {
        this.#server?.close(() => {
            if (callBack) callBack();
        })
    }

    private async initialize(): Promise<void> {
        await this.initializeServices()

        // * Bind middlewares
        // TODO: Verify that `busyboy` is compatible with other middlewares
        const middlewares = [express.json(), express.urlencoded({ extended: true }), multer({ storage: multer.memoryStorage() }).single('filetoupload') ]
        this.bindMiddlewares(middlewares)

        // * Create and controllers
        const sanityCrl = new Sanity('/')

        let mediaService;
        if(this.#mediaServicesClient)
            mediaService = new MediaService('/az', this.#mediaServicesClient, this.#azureConfig)

        // * Bind all the controllers
        this.bindControllers([mediaService, sanityCrl])
    }

    private async initializeServices(): Promise<void> {
        // * Connect with Azure Media Service and create the client
        const { AadClientId, AadSecret, AadTenantId, SubscriptionId, AadTenantDomain } = this.#azureConfig
        try {
            const response = await loginWithServicePrincipalSecretWithAuthResponse(AadClientId, AadSecret, AadTenantId)
            this.#mediaServicesClient = new AzureMediaServices(response.credentials, SubscriptionId)
            console.log('🌟 Connected with Azure Media Service')
        } catch (err) {
            console.error(`❌ Unable to authenticate with Azure for tenant: ${AadTenantDomain}`)
            console.error(`Debug: `+err)
            exit(1)
        }

        // * Other clients and connections here
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
