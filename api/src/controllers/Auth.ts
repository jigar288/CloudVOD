import { Controller, Get } from './'
import { OpenidRequest, OpenidResponse } from 'express-openid-connect'

export class Auth extends Controller {
    // * This class will just contain routes that are sanity checks
    // * Primarily for test in deployment, and health checks
    @Get('/')
    async user(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        res.status(200).send('<a href="login">Login</a> <a href="logout">Logout</a><br>' + JSON.stringify(req.oidc.user))
    }
    @Get('/login')
    async login(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        res.oidc.login({ returnTo: '/api/user/' })
    }

    @Get('/logout')
    async logout(req: OpenidRequest, res: OpenidResponse): Promise<void> {
        res.oidc.logout({ returnTo: '/api/user/' })
    }
}
