import React from 'react'
import { useAppSelector } from '../state'
import VideoCard from '../components/VideoCard'
import { Box, Flex, Spacer } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export const VideosPage = () => {
    const { data } = useAppSelector((state) => state)

    return (
        <>
            <Flex w="100%">
                {data.videos.map((video, index) => {
                    return (
                        <Box as={Link} to={{ pathname: '/watch/' + video.id, state: video }}>
                            <VideoCard
                                key={index}
                                id={video.id}
                                title={video.title}
                                thumbnail_url={video.thumbnail_url}
                                user_name={video.user_name}
                                profile_url={video.profile_url}
                                upload_date={video.upload_date}
                            />
                            <>{data.videos.length !== index + 1 && <Spacer />}</>
                        </Box>
                    )
                })}
            </Flex>
        </>
    )
}
