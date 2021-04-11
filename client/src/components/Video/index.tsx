import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import videojs from 'video.js'

const VideoPlayer: React.FC<{ width?: number; height?: number; src: string }> = ({ width, height, src }) => {
    const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

    useEffect(() => {
        let player = videoRef
            ? videojs(videoRef, {
                  autoplay: false,
                  playbackRates: [0.5, 1, 1.25, 1.5, 2],
                  width,
                  height,
                  controls: true,
                  sources: [{ src, type: 'application/x-mpegURL' }],
              })
            : undefined

        return () => {
            player?.dispose()
        }
    }, [videoRef])

    return (
        <div data-vjs-player>
            <video ref={(node) => setVideoRef(node)} className="video-js" />
        </div>
    )
}
export default VideoPlayer
