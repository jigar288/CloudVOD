import React from 'react'
import VideoView from '../components/VideoView'
import { useAppSelector } from '../state'

export const VideoPage = () => {
    const { data } = useAppSelector((state) => state)
    return <>VideoPage<VideoView videoData={data["videos"][0]} />
    </>
}
