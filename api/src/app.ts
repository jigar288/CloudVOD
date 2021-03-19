import express from 'express'
import cors from 'cors'
import multer from 'multer'
import pg from 'pg'
import { Controller } from './controllers'
import { Server } from 'http'
import { Middleware } from './types'
import { Sanity } from './controllers/Sanity'
import { AzureAccountConfig } from 'types'
import { exit } from 'process'
import { auth, ConfigParams as OpenIDConfigParams } from 'express-openid-connect'
import { Auth } from './controllers/Auth'
import MediaClient from './data/MediaClient'
import VideoDatabaseClient from './data/VideoDatabaseClient'
import { VideoController } from './controllers/VideoController'

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
    #mediaClient?: MediaClient
    #videoDBClient?: VideoDatabaseClient

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

        this.#app.use(cors()) //! FIXME: update cors configuration after deployment
    }

    public start = async (callBack?: Mocha.Done): Promise<void> => {
        await this.initialize()

        this.#server = this.#app.listen(this.#port, () => {
            console.info(`${this.#serviceName} has started on port ${this.#port}.`)
            if (callBack) callBack()
        })
    }

    public stop = async (callBack?: Mocha.Done): Promise<void> => {
        this.#server?.close(() => {
            if (callBack) callBack()
        })

        this.#videoDBClient?.dbConnection.close()
    }

    private async initialize(): Promise<void> {
        await this.initializeServices()

        if (!this.#mediaClient || !this.#videoDBClient) exit(1)

        if(!this.#videoDBClient.dbConnection.isEstablished())
            exit(1)

        // * Bind middlewares
        const middlewares = [auth(this.#openIDConfig), express.json(), express.urlencoded({ extended: true }), multer({ storage: multer.memoryStorage() }).single('filetoupload')]
        this.bindMiddlewares(middlewares)
        
        // * Create and controllers
        const sanityCrl = new Sanity('/')
        const authCrl = new Auth('/user')

        // TODO: use rest standards --> /user/<verb>/
        const videoController = new VideoController('/data', this.#mediaClient, this.#videoDBClient) 

        // * Bind all the controllers
        this.bindControllers([sanityCrl, authCrl, videoController])
    }

    private async initializeServices(): Promise<void> {
        // * Connect with Azure Media Service and create the client
        this.#mediaClient = await MediaClient.build(this.#azureConfig)

        // * Connect to Video Database Client to store metadata 
        this.#videoDBClient = await VideoDatabaseClient.build(this.#videoDatabaseConfig)

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