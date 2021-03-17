import { Request, Response } from 'express'
import { Controller, Get } from './'
import pg from 'pg'

// * Video Database will store metadata and info about videos & files. This controller consists of api routes to access the DB
export class VideoDatabase extends Controller {

    #videoDatabaseClient: pg.Client

    constructor(path: string, videoDatabaseClient: pg.Client) {
        super(path)
        this.#videoDatabaseClient = videoDatabaseClient
    }    

    @Get('/videos')
    async get_all_video_metadata(_req: Request, res: Response): Promise<void> {
        res.status(200).send('Functionality needs to be implemented.')
    }
}
