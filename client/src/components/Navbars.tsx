import * as React from 'react'
import { chakra, Box, Flex, useColorModeValue, VisuallyHidden, HStack, Button, useDisclosure, VStack, IconButton, CloseButton, Avatar } from '@chakra-ui/react'
//import Logo from "components/navbar/logo"; //TODO
import { AiOutlineMenu, AiFillHome, AiOutlineInbox, AiOutlineSearch, AiFillBell } from 'react-icons/ai'
import { BsFillCameraVideoFill } from 'react-icons/bs'

const Navbars = (props: { brand: string; profileImg: string }) => {
    const mobileNav = useDisclosure()

    return (
        <Box shadow="md">
            <chakra.header bg="gray.800" borderColor="gray.600" borderBottomWidth={1} w="full" px={{ base: 2, sm: 4 }} py={4}>
                <Flex alignItems="center" justifyContent="space-between" mx="auto" flexFlow="row-reverse">
                    <HStack spacing={3} display="flex" alignItems="center">
                        <HStack spacing={3} display={{ base: 'none', md: 'inline-flex' }}>
                            <Button variant="ghost" href="#" leftIcon={<AiOutlineInbox />} size="sm">
                                Videos
                            </Button>
                            <Button variant="ghost" href="#" leftIcon={<BsFillCameraVideoFill />} size="sm">
                                New Upload
                            </Button>
                        </HStack>

                        <Avatar size="sm" name="Clark Chen" src={props.profileImg} />
                    </HStack>
                    <HStack spacing={4} display="flex" alignItems="center">
                        <Box display={{ base: 'inline-flex', md: 'none' }}>
                            <IconButton display={{ base: 'flex', md: 'none' }} aria-label="Menu" fontSize="20px" icon={<AiOutlineMenu />} onClick={mobileNav.onToggle} />
                        </Box>
                        {/* <chakra.a href="/" title="Choc Home Page" display="flex" alignItems="center">
                            <VisuallyHidden>Choc</VisuallyHidden>
                        </chakra.a> */}
                        <chakra.h1 fontSize="2xl">{props.brand}</chakra.h1>
                    </HStack>
                </Flex>
                <VStack display={{ base: mobileNav.isOpen ? 'flex' : 'none', md: 'none' }} pt={4} bg="gray.800" spacing={3} rounded="sm" shadow="sm">
                    <Button isFullWidth display="flex" justifyContent="flex-start" href="#" variant="ghost" leftIcon={<AiOutlineInbox />}>
                        Videos
                    </Button>
                    <Button isFullWidth display="flex" justifyContent="flex-start" href="#" variant="ghost" leftIcon={<BsFillCameraVideoFill />}>
                        New Upload
                    </Button>
                </VStack>
            </chakra.header>
        </Box>
    )
}

export default Navbars
