import React from 'react'
import { chakra, Box, Image, Flex, useColorModeValue, Link } from '@chakra-ui/react'

const VideoCard = (props: { id: number; title: string; thumbnail_url: string; user_name: string; profile_url: string; upload_date: string }) => {
    return (
        <Flex p={5} w="unset" alignItems="center" justifyContent="center">
            <Box mx="auto" rounded="lg" shadow="md" bg={useColorModeValue('white', 'gray.800')} maxW="2xl">
                <Image roundedTop="lg" w="sm" h="full" fit="cover" src={props.thumbnail_url} alt="Thumbnail" />

                <Box bg="gray.600" p={6} roundedBottom="lg">
                    <Box>
                        <Link
                            display="block"
                            color={useColorModeValue('gray.800', 'white')}
                            fontWeight="bold"
                            fontSize="2xl"
                            mt={2}
                            _hover={{ color: 'gray.600', textDecor: 'underline' }}
                            href={'#/watch/' + props.id}
                        >
                            {props.title}
                        </Link>
                    </Box>

                    <Box mt={4}>
                        <Flex alignItems="center">
                            <Flex alignItems="center">
                                <Image h={10} fit="cover" rounded="full" src={props.profile_url} alt="Avatar" />
                                <Link mx={2} fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} href="#">
                                    {props.user_name}
                                </Link>
                            </Flex>
                            <chakra.span mx={1} fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                                {props.upload_date}
                            </chakra.span>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default VideoCard
