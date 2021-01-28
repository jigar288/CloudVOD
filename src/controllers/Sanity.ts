import { Request, Response } from 'express'
import { Controller, Get } from './'

export class Sanity extends Controller {
    // * This class will just contain routes that are sanity checks
    // * Primarily for test in deployment, and health checks
    @Get('/')
    sanity_check(_req: Request, res: Response): void {
        res.status(200).send('Application is running')
    }
}
