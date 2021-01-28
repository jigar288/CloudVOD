import express from 'express'
import cors from 'cors'
import { Controller } from './controllers'
import { Server } from 'http'
import { Middleware } from './types'
import { Sanity } from './controllers/Sanity'
import busboy from 'connect-busboy'
import { loginWithServicePrincipalSecretWithAuthResponse } from '@azure/ms-rest-nodeauth'
import { AzureMediaServices } from '@azure/arm-mediaservices'
import azureAccountConfig from './config/azure'
import { exit } from 'process'

export default class App {
    #app: express.Application
    #basePath: string
    #serviceName: string
    #port: number
    #client?: AzureMediaServices

    get app(): express.Application {
        return this.#app
    }

    constructor(port: number, basePath: string, serviceName: string) {
        this.#app = express()
        this.#port = port
        this.#basePath = basePath
        this.#serviceName = serviceName
    }

    private bindMiddlewares = (middlewares?: Middleware[]) => {
        if (middlewares && middlewares.length > 0) middlewares.forEach((middle) => this.#app.use(middle))
    }

    private bindControllers = (controllers?: Controller[]) => {
        if (controllers && controllers.length > 0)
            controllers.forEach((controller) => {
                controller.bindRoutes()
                this.#app.use(this.#basePath + controller.path, controller.router)
            })
    }
    public listen = async (): Promise<Server> => {
        try {
            const response = await loginWithServicePrincipalSecretWithAuthResponse(azureAccountConfig.AadClientId, azureAccountConfig.AadSecret, azureAccountConfig.AadTenantId)
            this.#client = new AzureMediaServices(response.credentials, azureAccountConfig.SubscriptionId)
        } catch (err) {
            console.error('❌ Unable to authenticate with Azure')
            exit(1)
        }

        await this.init()

        return this.#app.listen(this.#port, '0.0.0.0', () => {
            console.log(`${this.#serviceName} has started on port ${this.#port}.`)
        })
    }

    private async init() {
        this.#app.options('*', cors)
        const middlewares = [express.json(), busboy({ immediate: true }), express.urlencoded({ extended: true })]

        // * Bind middlewares
        this.bindMiddlewares(middlewares)

        try {
            const response = await loginWithServicePrincipalSecretWithAuthResponse(azureAccountConfig.AadClientId, azureAccountConfig.AadSecret, azureAccountConfig.AadTenantId)
            this.#client = new AzureMediaServices(response.credentials, azureAccountConfig.SubscriptionId)

            console.log('🌟 Connected with Azure Media Server')
        } catch (err) {
            console.error('❌ Unable to authenticate with Azure')
            exit(1)
        }

        // * Create controllers
        const sanityCrl = new Sanity('/')

        this.bindControllers([sanityCrl])
    }
}
