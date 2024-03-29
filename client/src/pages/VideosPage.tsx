import React from 'react'
import { useAppSelector } from '../state'
import VideoCard from '../components/VideoCard'
import { Link } from 'react-router-dom'

export const VideosPage = () => {
    const { data } = useAppSelector((state) => state)

    return (
        <div className="max-w-7xl mx-auto h-full py-8 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-stretch px-4 xl:px-0  gap-8">
                {data.videos.map((video, index) => {
                    return (
                        <Link to={{ pathname: '/watch/' + video.id, state: video }} key={index}>
                            <VideoCard video={video} />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
