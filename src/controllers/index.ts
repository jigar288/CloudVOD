import { Request, Response, Router } from 'express'
import { Middleware } from '../types'

type RouteDescriptor = (target: Controller, _propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor

const RouteDecorator = (method: string, path: string, middlewares?: Middleware[]): RouteDescriptor => {
    return (target: Controller, _propertyKey: string, descriptor: PropertyDescriptor) => {
        if (Object.getOwnPropertyDescriptor(target, 'routes') == null || target.routes === undefined) target.routes = []
        target.routes.push({
            path,
            method,
            middlewares: middlewares && middlewares.length > 0 ? middlewares : [],
            handler: descriptor.value,
        })
        return descriptor
    }
}

export const Get = (path: string, middlewares?: Middleware[]): RouteDescriptor => {
    return RouteDecorator('get', path, middlewares)
}

export const Post = (path: string, middlewares?: Middleware[]): RouteDescriptor => {
    // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return RouteDecorator('post', path, middlewares)
}

export const Put = (path: string, middlewares?: Middleware[]): RouteDescriptor => {
    // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return RouteDecorator('put', path, middlewares)
}

export const Delete = (path: string, middlewares?: Middleware[]): RouteDescriptor => {
    // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return RouteDecorator('delete', path, middlewares)
}

export const All = (path: string, middlewares?: Middleware[]): RouteDescriptor => {
    // eslint-disable-line @typescript-eslint/explicit-module-boundary-types
    return RouteDecorator('all', path, middlewares)
}

interface Route {
    path: string
    method: string
    middlewares: Middleware[]
    handler: (req: Request, res: Response) => void
}

export abstract class Controller {
    public router: Router
    public path: string

    public routes?: Route[]

    constructor(path: string) {
        this.path = path
        this.router = Router()
    }

    public static jsonResponse(response: Response, code: number, message: string): Response {
        return response.status(code).json({ message })
    }

    public bindRoutes(): void {
        this.routes?.forEach((route) => {
            switch (route.method) {
                case 'get':
                    this.router.get(route.path, ...route.middlewares, route.handler.bind(this))
                    break
                case 'post':
                    this.router.post(route.path, ...route.middlewares, route.handler.bind(this))
                    break
                case 'delete':
                    this.router.delete(route.path, ...route.middlewares, route.handler.bind(this))
                    break
                case 'put':
                    this.router.put(route.path, ...route.middlewares, route.handler.bind(this))
                    break
                case 'all':
                default:
                    this.router.all(route.path, ...route.middlewares, route.handler.bind(this))
            }
        })
    }

    public ok<T>(res: Response, data?: T): Response {
        if (data) {
            res.type('application/json')
            return res.status(200).json(data)
        } else {
            return res.sendStatus(200)
        }
    }
    public created(response: Response): void {
        response.sendStatus(201)
    }

    public accepted(response: Response): void {
        response.sendStatus(202)
    }

    public clientError(response: Response, message?: string): void {
        Controller.jsonResponse(response, 400, message ? message : 'Unauthorized')
    }

    public unauthorized(response: Response, message?: string): void {
        Controller.jsonResponse(response, 401, message ? message : 'Unauthorized')
    }

    public paymentRequired(response: Response, message?: string): void {
        Controller.jsonResponse(response, 402, message ? message : 'Payment required')
    }

    public forbidden(response: Response, message?: string): void {
        Controller.jsonResponse(response, 403, message ? message : 'Forbidden')
    }

    public notFound(response: Response, message?: string): void {
        Controller.jsonResponse(response, 404, message ? message : 'Not found')
    }

    public conflict(response: Response, message?: string): void {
        Controller.jsonResponse(response, 409, message ? message : 'Conflict')
    }

    public tooMany(response: Response, message?: string): void {
        Controller.jsonResponse(response, 429, message ? message : 'Too many requests')
    }

    public notImplemented(response: Response, message?: string): void {
        Controller.jsonResponse(response, 501, message ? message : 'Not Implemented')
    }

    public fail(response: Response, error: Error | string): Response {
        console.log(error)
        return response.status(500).json({
            message: error.toString(),
        })
    }
}
