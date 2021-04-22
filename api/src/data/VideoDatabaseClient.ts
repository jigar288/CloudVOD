import pg from 'pg'
import { DBQueryResponse } from 'types'
import { Video } from '../types/Video'


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
         * Returns metadata about video content such as (title, description, streaming url, category, user, upload date)
         * 
         * @param limit Optionally specify amount of rows that should be returned 
         * @returns DBQueryResponse
         *
         * TODO: add types for db metadata response
         * 
         *  */         
        get: async (limit?: string): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }
            
            // retrieve initial video metadata
            try{
                if(limit){
                    const limitedDataQuery = 'SELECT * FROM get_all_video_data_by_limit($1);';
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

            // retrieve & add categories associated with each video

            for (let index = 0; index < queryResult.data.length; index++) {
                const data = queryResult.data[index];
                
                const videoID: number = parseInt(data.id);                
                const categoriesResponse = await this.videoCategories.getCategoriesByVideoID(videoID);
                const category_names: string[] = [];

                categoriesResponse.data.forEach( (categoryItem) => {
                    category_names.push(categoryItem.name)
                })           
                                
                data['category_names'] = category_names;                          
            }
                    
            return queryResult;
        },

        /**
         * 
         * Creates video metadata by inserting provided information into the database. 
         * The streaming url when its available using another method from this class
         * 
         * @param Video object consisting of video related metadata info
         * @returns DBQueryResponse
         */
        create: async (videoMetadata: Video): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const insertQuery = 'CALL create_initial_video_entry($1, $2, $3, $4, $5, $6, $7, $8, $9);'
                await this.#videoDatabaseClient.query(insertQuery, 
                    [videoMetadata.title, videoMetadata.description, videoMetadata.output_asset_name, videoMetadata.upload_date,
                     videoMetadata.categories, videoMetadata.user_email, videoMetadata.user_profile_url, videoMetadata.user_name, videoMetadata.is_public]
                );
                queryResult.wasRequestSuccessful = true;
                queryResult.message = 'Success adding video metadata to database'
            }catch(error){
                const message = `Error trying to add video metadata for assetName ${videoMetadata.output_asset_name}. Error: ${error}`
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
        update: async (streamingURL: string, outputAssetName: string, thumbnailURL: string): Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const updateQuery = 'CALL update_video_metadata($1, $2, $3);'
                await this.#videoDatabaseClient.query(updateQuery, [streamingURL, thumbnailURL, outputAssetName] );
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
        },
        getCategoriesByVideoID: async (videoID: number) : Promise<DBQueryResponse> => {
            const queryResult: DBQueryResponse = { data: null, wasRequestSuccessful: false, message: '' }

            try{
                const categoriesByVideoIDResponse = 'SELECT * FROM get_categories_for_video_id($1);'
                queryResult.data = (await this.#videoDatabaseClient.query(categoriesByVideoIDResponse, [videoID])).rows
                queryResult.wasRequestSuccessful = true;
                queryResult.message = 'Success retrieving categories for a specific video ID'
            }catch(error) {
                const message = `Error retrieving categories for a specific video ID`
                console.error(message)
                queryResult.message = message
            }

            return queryResult;
        } 
    }


}

export default VideoDatabaseClient;