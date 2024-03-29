import { Controller, Get } from './'
import { OpenidRequest, OpenidResponse } from 'express-openid-connect'

export class Auth extends Controller {
    // * This class will just contain routes that are sanity checks
    // * Primarily for test in deployment, and health checks
    @Get('/')
    async user(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        res.status(req.oidc.user ? 200 : 401).json(req.oidc.user)
    }
    @Get('/login')
    async login(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        const returnTo = typeof req.query.return === 'string' ? req.query.return : '/api/user/'
        res.oidc.login({ returnTo })
    }

    @Get('/logout')
    async logout(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        const returnTo = typeof req.query.return === 'string' ? req.query.return : '/api/user/'
        res.oidc.logout({ returnTo })
    }
}
