import * as React from 'react'
import { chakra, Box, Image, Flex, useColorModeValue, Link, ChakraProvider } from '@chakra-ui/react'

const Cards = (props: { title: string; thumbnail: string; channel: string; channelProfileImg: string; date: string; description: string }) => {
    return (
        <Flex bg="gray.600" p={50} w="full" alignItems="center" justifyContent="center">
            <Box mx="auto" rounded="lg" shadow="md" bg={useColorModeValue('white', 'gray.800')} maxW="2xl">
                <Image roundedTop="lg" w="full" h={64} fit="cover" src={props.thumbnail} alt="Thumbnail" />

                <Box p={6}>
                    <Box>
                        <chakra.span fontSize="xs" textTransform="uppercase" color={useColorModeValue('brand.600', 'brand.400')}>
                            #1 ON TRENDING
                        </chakra.span>
                        <Link display="block" color={useColorModeValue('gray.800', 'white')} fontWeight="bold" fontSize="2xl" mt={2} _hover={{ color: 'gray.600', textDecor: 'underline' }} href="#">
                            {props.title}
                        </Link>
                        <chakra.p mt={2} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            {props.description}
                        </chakra.p>
                    </Box>

                    <Box mt={4}>
                        <Flex alignItems="center">
                            <Flex alignItems="center">
                                <Image h={10} fit="cover" rounded="full" src={props.channelProfileImg} alt="Avatar" />
                                <Link mx={2} fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')} href="#">
                                    Clark Chen
                                </Link>
                            </Flex>
                            <chakra.span mx={1} fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                                {props.date}
                            </chakra.span>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default Cards
