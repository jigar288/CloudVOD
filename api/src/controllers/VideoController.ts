import MediaClient from 'data/MediaClient'
import { Request, Response } from 'express'
import { Controller, Get, Post } from './'
import bufferToStream from 'into-stream'
import { JobOutputAsset } from '@azure/arm-mediaservices/esm/models'
import VideoDatabaseClient from 'data/VideoDatabaseClient'
import { requiresAuth } from 'express-openid-connect'


export class VideoController extends Controller {

    #mediaClient: MediaClient
    #videoDBClient: VideoDatabaseClient

    constructor(path: string, mediaClient: MediaClient, videoDBClient: VideoDatabaseClient) {
        super(path)
        this.#mediaClient = mediaClient
        this.#videoDBClient = videoDBClient
    }

    // ! FIXME: only authenticated users should be able to upload files
    // TODO: move business logic to its own layer?
    @Post('/video')
    async upload_video_file(_req: Request, res: Response): Promise<void> {

        const videoTitle = _req.body.videoTitle
        const videoDescription = _req.body.videoDescription
        const filename = _req.file.originalname;
        
        try{
            //* transfering file via buffers & streams for smoother upload process
            const fileReadableStream = bufferToStream(_req.file.buffer)                                 
            const inputAsset = await this.#mediaClient.video.upload(filename, fileReadableStream);
            
            //* submit encoding job for uploaded file
            const jobSubmissionResult = await this.#mediaClient.jobs.create(inputAsset);            
            
            //* create streaming locator
            const outputAssetName = (jobSubmissionResult.outputs[0] as JobOutputAsset).assetName;
            const createLocatorResponse = await this.#mediaClient.streaming_locator.create(outputAssetName)
                  
            const dbWriteResponse = await this.#videoDBClient.insertVideoDataToDB(videoTitle, videoDescription , outputAssetName);
            console.info(dbWriteResponse)            

        }catch(error){              
            const message = `There was a problem processing the file: ${error}`
            console.error(message)
            this.fail(res, message);
            return;
        }

        this.ok(res);        
    }
    
    @Get('/file-upload', [requiresAuth()])
    async file_uploader(_req: Request, res: Response): Promise<void> {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(`
          <!DOCTYPE html>
          <html>
          <body>
          
          <h2>Upload Video</h2>
          
          <form action="video" method="post" enctype="multipart/form-data">
            <label for="videoTitle">Video Title:</label><br>
            <input type="text" id="videoTitle" name="videoTitle" value=""><br>
            <label for="videoDescription">Video Description:</label><br>
            <input type="text" id="videoDescription" name="videoDescription" value="">
            <br>
            <br>
            <input type="file" name="filetoupload">
            <br>
            <br>
            <input type="submit">
          </form>
          
          </body>
          </html>        
        `)
        return res.end()
    }    

    // Note: this route shouldn't require auth and will eventually be moved to another controller
    @Get('/videos')
    async get_video_metadata(_req: Request, res: Response): Promise<void> {
        
        let { limit } = _req.query;
        limit = limit?.toString();
        const queryResult = await this.#videoDBClient.fetchVideoDataFromDB(limit)

        if(queryResult.wasRequestSuccessful)
            this.ok(res, {message: queryResult})
        else    
            this.fail(res, queryResult.message)          
    }
    

    @Post('/job-monitor-web-hook')    
    async job_monitor_web_hook(_req: Request, res: Response): Promise<void> {
        const requestBody = _req.body[0];

        if('data' in requestBody){
            if('validationCode' in requestBody.data){
                const validationCode = requestBody.data.validationCode
                const webhook_response = {'validationResponse': validationCode}
                console.info('Monitoring web hook subscription validation successful via Azure EventGrid')
                res.send(webhook_response)
            }

            if('outputs' in requestBody.data){
                const outputAssetName = requestBody.data.outputs[0].assetName
                console.info(`encoding job finished for outputAssetName: ${outputAssetName}`)

                //* get streaming url by output asset name
                const streamingUrlList = await this.#mediaClient.streaming_urls.get(outputAssetName);
                const smoothStreamingURL = streamingUrlList[4];

                // * update DB
                const dbUpdateResponse = await this.#videoDBClient.updateStreamingUrlByAsset(smoothStreamingURL, outputAssetName)
                console.info(dbUpdateResponse)
            }
        }
    }      

    
    // TODO: add route to get video metadata such as streaming url, title, etc --> both authenticated & unauthenticated should have access

    @Get('/video-test')
    async video_test(req: Request, res: Response): Promise<void> {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(
            `
            <html>
            <head>
                <link
                href="https://amp.azure.net/libs/amp/2.3.6/skins/amp-default/azuremediaplayer.min.css"
                rel="stylesheet"
              />
              <script src="https://amp.azure.net/libs/amp/2.3.6/azuremediaplayer.min.js"></script>
              <script>
                function handleOnClick() {
                  var myPlayer = amp(
                    "azuremediaplayer",
                    {
                      /* Options */
                      techOrder: [
                        "azureHtml5JS",
                        "flashSS",
                        "html5FairPlayHLS",
                        "silverlightSS",
                        "html5",
                      ],
                      nativeControlsForTouch: false,
                      autoplay: false,
                      controls: true,
                      width: "640",
                      height: "400",
                      poster: "",
                    },
                    function () {
                      console.log("Good to go!");
                      // add an event listener
                      this.addEventListener("ended", function () {
                        console.log("Finished!");
                      });
                    }
                  );
                  myPlayer.src([
                    {
                      src: document.getElementById("source_input").value,
                      type: "application/vnd.ms-sstr+xml",
                    },
                  ]);
                }
              </script>
            </head>
        
            <body>
                
          <video
          id="azuremediaplayer"
          class="azuremediaplayer amp-default-skin amp-big-play-centered"
          tabindex="0"
        ></video>
        <br />
        <br />
        Streaming URL Here:
        <input type="text" id="source_input" />
        <button id="source_button" onclick="{handleOnClick}">Start Streaming</button>
        <script>
          document.getElementById("source_button").onclick = handleOnClick;
        </script>
        
          <h5>Video Links</h5>
          <ul id="videoList">
          </ul>
        
          <script>
              let videoListRef = document.querySelector('#videoList');
        
              function addToList(listItemData) {
                  var x = document.createElement("LI");
                  var t = document.createTextNode(listItemData);
                  x.appendChild(t);
                  videoListRef.appendChild(x);
              }     
              
              fetch('http://localhost:5000/api/data/videos')
              .then(response => response.json())
              .then(response => {
                  const data = response.message.data 
                  data.forEach( videoItem => {
                      const itemData = 'Title: ' + videoItem.video_title + ' - URL:' +  videoItem.streaming_url;
                      addToList(itemData)
                  })
              });
          </script>
            </body>
        
        </html>
            `,
        )
        res.end()
    }    

}