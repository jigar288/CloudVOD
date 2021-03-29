import pg from 'pg'
import { DBQueryResponse } from 'types'

class VideoDatabaseClient {
    
    #videoDatabaseClient: pg.Client

    /**
     * This constructor should not be called directly
     * Rather call the `build` method defined below
     *
     * @param videoDatabaseClient Client to interact with Azure PostgreSQL Database
     */    
    private constructor(videoDatabaseClient: pg.Client){
        this.#videoDatabaseClient = videoDatabaseClient
    }

    /**
     * Creates an instance of VideoDatabaseClient asynchronously
     * This method should be used instead of the constructor
     *
     * @param videoDatabaseConfig Database configurations and Credentials to use
     * @returns Promise<VideoDatabaseClient>
     * @throws Error if postgres client object cannot be created using the given credentials
     */    
    public static async build(videoDatabaseConfig: pg.ClientConfig): Promise<VideoDatabaseClient> {
        try{
            const videoDatabaseClient = new pg.Client(videoDatabaseConfig)
            await videoDatabaseClient.connect();
            console.info('🚀 Connected with Azure Video Database')
            return new VideoDatabaseClient(videoDatabaseClient)
        }catch(err) {
            console.error(`❌ Unable to connect to video database with host: ${videoDatabaseConfig.host}`)
            console.error(`Debug: ` + err)
            throw err
        }
    }   

    public dbConnection = {

        /**
         * Closes database connection
         *  */        
        close: (): void => {
            this.#videoDatabaseClient.end()
        }, 

        /**
         * Checks if database connection is established
         *  */         
        isEstablished: (): boolean => {
            if(this.#videoDatabaseClient)
                return true
            else
                return false            
        }
    }

    public videoMetadata = {
        /**
         * Returns metadata about video conetent such as (title, description, streaming url, category, user, upload date)
         * 
         * @param limit Optionally specify amount of rows that should be returned 
         * @returns DBQueryResponse
         *
         *  */         
        get: async (limit?: string): Promise<DBQueryResponse> => {
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
                console.error(message)
                queryResult.message = message
            }
    
            return queryResult;
        },

        /**
         * 
         * Creates video meatadata by inserting provided information into the database. 
         * The streaming url when its available using another method from this class
         * 
         * @param videoTitle
         * @param videoDescription
         * @param outputAssetName The output asset from azure media service that contains streaming files 
         * @returns DBQueryResponse
         */
        create: async (videoTitle: string, videoDescription: string, outputAssetName: string, categoryID: number, userEmail: string, userName: string, uploadDate: string): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const insertQuery = 'CALL create_initial_video_entry($1, $2, $3, $4, $5, $6, $7);'
                await this.#videoDatabaseClient.query(insertQuery, [videoTitle, videoDescription, outputAssetName, uploadDate, categoryID, userEmail, userName]);
                queryResult.wasRequestSuccessful = true;
                queryResult.message = 'Success adding video metadata to database'
            }catch(error){
                const message = `Error trying to add video metadata for assetName ${outputAssetName}. Error: ${error}`
                console.error(message)
                queryResult.message = message
            }        
            return queryResult;
        }
    }

    public streamingURL = {
        /**
         * 
         * Updates the streaming url by using the unique output asset name that is provided
         * 
         * @param streamingURL The url that is used by video player clients to stream video content. This is provided by azure media service
         * @param assetName The unique output asset name from azure media service that contains files for the video 
         * @returns DBQueryResponse
         */
        update: async (streamingURL: string, outputAssetName: string): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const updateQuery = 'CALL update_streaming_url_by_asset($1, $2);'
                await this.#videoDatabaseClient.query(updateQuery, [streamingURL, outputAssetName] );
                queryResult.wasRequestSuccessful = true;
                queryResult.message = 'Success updating streaming url'            
            }catch(error){
                const message = `Error trying to update streaming url for assetName ${outputAssetName}. Error: ${error}`
                console.error(message)
                queryResult.message = message
            }
    
            return queryResult;
        }
    }

    public videoCategories = {
        /**
         * 
         * Get list of all the categories for video media
         * 
         * @returns DBQueryResponse
         */
        get: async (): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const getCategoriesQuery = 'SELECT * FROM get_categories()';
                queryResult.data = (await this.#videoDatabaseClient.query(getCategoriesQuery)).rows
                queryResult.wasRequestSuccessful = true;
                queryResult.message = 'Success retrieving video data'
            }catch(error){
                const message = `Error trying to get categories`
                console.error(message)
                queryResult.message = message
            }

            return queryResult;
        }
    }


}

export default VideoDatabaseClient;