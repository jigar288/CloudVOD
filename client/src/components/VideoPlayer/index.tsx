import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import videojs from 'video.js'

const VideoPlayer: React.FC<{ width?: number; height?: number; src: string; thumbnail_url: string }> = ({ width, height, src, thumbnail_url }) => {
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

    const videoType = (src.includes("mp4")) ? "video/mp4" : "application/x-mpegURL"
    if (videoType == "application/x-mpegURL" && !src.includes("(format=m3u8-aapl)")) {
        src += "(format=m3u8-aapl)"
    }
    useEffect(() => {
        let player = videoRef
            ? videojs(videoRef, {
                autoplay: false,
                playbackRates: [0.5, 1, 1.25, 1.5, 2],
                width,
                height,
                controls: true,
                poster: thumbnail_url,
                sources: [{ src, type: videoType }]
            })
            : undefined

        return () => {
            player?.dispose()
        }
    }, [videoRef])

    return (
        <div data-vjs-player>
            <video ref={(node) => setVideoRef(node)} className="video-js vjs-16-9 vjs-big-play-centered" />
        </div>
    )
}
export default VideoPlayer
