import React from 'react'
import { chakra, Box, Image, Flex, useColorModeValue, Link } from '@chakra-ui/react'
import VideoPlayer from '../VideoPlayer'
import { Video } from '../../types'
import { useAppSelector } from '../../state'


const VideoView = (props: { videoData: Video }) => {
    const { user } = useAppSelector((state) => state)
    // Check for permission
    if (!props.videoData.is_public && user == null) {
        return <>Permission Denied</>
    }
    return (
        <Flex bg="gray.600" p={50} w="full" alignItems="center" justifyContent="center">
            <Box w="full" mx="auto" rounded="lg" shadow="md" bg={useColorModeValue('white', 'gray.800')} maxW="75%">
                {/* <Image roundedTop="lg" w="full" h={64} fit="cover" src={props.thumbnail} alt="Thumbnail" /> */}
                <VideoPlayer src={props.videoData.streaming_url} thumbnail_url={props.videoData.thumbnail_url} />
                <Box p={6}>
                    <Box>
                        <chakra.span fontSize="xs" textTransform="uppercase" color={useColorModeValue('brand.600', 'brand.400')}>
                            #1 ON TRENDING
                        </chakra.span>
                        <Link display="block" color={useColorModeValue('gray.800', 'white')} fontWeight="bold" fontSize="2xl" mt={2} _hover={{ color: 'gray.600', textDecor: 'underline' }} href="#">
                            {props.videoData.title}
                        </Link>
                        <chakra.p mt={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            {props.videoData.description}
                        </chakra.p>
                    </Box>

                    <Box mt={4}>
                        <Flex alignItems="center">
                            <Flex alignItems="center">
                                <Image h={10} fit="cover" rounded="full" src={props.videoData.profile_url} alt="Avatar" />
                                <Link mx={2} fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} href="#">
                                    {props.videoData.user_name}
                                </Link>
                            </Flex>
                            <chakra.span mx={1} fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                                {props.videoData.upload_date}
                            </chakra.span>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default VideoView
