import React from 'react'
import { useAppSelector } from '../state'
import VideoView from '../components/VideoView'
import VideoCard from '../components/VideoCard'

export const VideosPage = () => {
    const { data } = useAppSelector((state) => state)
    let output: JSX.Element = <></>

    return <>VideosPage {data["videos"].map((video, index) => {
        return (<VideoCard
            id={video.id}
            title={video.title}
            thumbnail_url={video.thumbnail_url}
            user_name={video.user_name}
            profile_url={video.profile_url}
            upload_date={video.upload_date}
        />)
    })}</>
}
