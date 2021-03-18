import pg from 'pg'
import { DBQueryResponse } from 'types'

// TODO: refactor this class similar to MediaClient.ts
class VideoDatabaseClient {

    #videoDatabaseClient: pg.Client

    constructor(videoDatabaseConfig: pg.ClientConfig) {
        this.#videoDatabaseClient = new pg.Client(videoDatabaseConfig)

        this.#videoDatabaseClient.connect(err => {
            if (err) {
                console.error(`❌ Unable to connect to video database with host: ${videoDatabaseConfig.host}`)
                throw err;
            }
            else {  
                console.info('🚀 Connected with Azure Video Database')
            }   
        });        

    }   

    public closeDBConnection(): void {
        this.#videoDatabaseClient.end()
    }

    public isDBConnectionEstablished(): boolean {
        if(this.#videoDatabaseClient)
            return true
        else
            return false
    }
    
    public async fetchVideoDataFromDB(limit: string | undefined): Promise<DBQueryResponse>{
        const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }
        try{
            if(limit){
                const limitedDataQuery = 'SELECT * FROM get_video_data_by_limit($1);';
                queryResult.data = (await this.#videoDatabaseClient.query(limitedDataQuery, [limit])).rows
            }else{
                const allVideosQuery = `SELECT * FROM get_all_video_data()`
                queryResult.data = (await this.#videoDatabaseClient.query(allVideosQuery)).rows
            }
            queryResult.wasRequestSuccessful = true;
            queryResult.message = 'Success retrieving video data'
        }catch(error){
            const message = `Error trying to get video metadata. ${error}`
            queryResult.message = message
        }

        return queryResult;
    }    

    //!FIXME: doesn't accept single quotes (') for parameter values --> find way to escape it
    public async insertVideoDataToDB(videoTitle: string, videoDescription: string, outputAssetName: string): Promise<DBQueryResponse>{
        const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

        try{
            const insertQuery = 'CALL add_initial_video_metadata($1, $2, $3);'
            await this.#videoDatabaseClient.query(insertQuery, [videoTitle, videoDescription, outputAssetName]);
            queryResult.wasRequestSuccessful = true;
            queryResult.message = 'Success adding video metadata to database'
        }catch(error){
            const message = `Error trying to add video metadata for assetName ${outputAssetName}. Error: ${error}`
            queryResult.message = message
        }        
        return queryResult;
    }    


    public async updateStreamingUrlByAsset(streamingURL: string, assetName: string): Promise<DBQueryResponse>{
        const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

        try{
            const updateQuery = 'CALL update_streaming_url_by_asset($1, $2);'
            await this.#videoDatabaseClient.query(updateQuery, [streamingURL, assetName] );
            queryResult.wasRequestSuccessful = true;
            queryResult.message = 'Success updating streaming url'            
        }catch(error){
            const message = `Error trying to update streaming url for assetName ${assetName}. Error: ${error}`
            queryResult.message = message
        }

        return queryResult;
    }    

}

export default VideoDatabaseClient;