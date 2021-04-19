import React from 'react'
import { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Video } from 'types'
import VideoView from '../components/VideoView'
import { useAppSelector } from '../state'
import { Spinner } from '@chakra-ui/react'

export const VideoPage = () => {
    const { data } = useAppSelector((state) => state)
    const { state }: { state?: Video } = useLocation()
    const { id }: { id?: string } = useParams()

    const [videoData, setVideoData] = React.useState<Video | undefined>(undefined)
    const [loading, setLoading] = React.useState(true)

    useEffect(() => {
        if (state) setVideoData(state)
        else {
            const video = data.videos.find((v) => v.id == Number(id))
            if (video) setVideoData(video)
        }

        setLoading(false)
    }, [state, id])

    return loading ? <Spinner /> : videoData ? <VideoView videoData={videoData} /> : <>Video Not Found</>
}
