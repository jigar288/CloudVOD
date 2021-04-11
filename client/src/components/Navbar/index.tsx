import * as React from 'react'
import { chakra, Box, Flex, HStack, Button, useDisclosure, VStack, IconButton, Avatar } from '@chakra-ui/react'
import { AiOutlineMenu } from 'react-icons/ai'
import { NavbarProps } from '../../types'
//import Logo from "components/navbar/logo"; //TODO

const Navbar = (props: NavbarProps) => {
    const mobileNav = useDisclosure()

    return (
        <Box shadow="md">
            <chakra.header bg="gray.800" borderColor="gray.600" borderBottomWidth={1} w="full" px={{ base: 2, sm: 4 }} py={4}>
                <Flex alignItems="center" justifyContent="space-between" mx="auto" flexFlow="row-reverse">
                    <HStack spacing={3} display="flex" alignItems="center">
                        <HStack spacing={3} display={{ base: 'none', md: 'inline-flex' }}>
                            {props.paths.map(({ name, href, icon, authenticated }, idx) => (
                                <Button variant="ghost" href={href} leftIcon={icon} size="sm" key={idx}>
                                    {name}
                                </Button>
                            ))}
                        </HStack>

                        <Avatar size="sm" name="Clark Chen" src={''} />
                    </HStack>
                    <HStack spacing={4} display="flex" alignItems="center">
                        <Box display={{ base: 'inline-flex', md: 'none' }}>
                            <IconButton display={{ base: 'flex', md: 'none' }} aria-label="Menu" fontSize="20px" icon={<AiOutlineMenu />} onClick={mobileNav.onToggle} />
                        </Box>
                        {/* <chakra.a href="/" title="Choc Home Page" display="flex" alignItems="center">
                            <VisuallyHidden>Choc</VisuallyHidden>
                        </chakra.a> */}
                        <chakra.h1 fontSize="2xl">CloudTube</chakra.h1>
                    </HStack>
                </Flex>
                <VStack display={{ base: mobileNav.isOpen ? 'flex' : 'none', md: 'none' }} pt={4} bg="gray.800" spacing={3} rounded="sm" shadow="sm">
                    {props.paths.map(({ name, href, icon, authenticated }, idx) => (
                        <Button isFullWidth display="flex" justifyContent="flex-start" href={href} variant="ghost" leftIcon={icon} key={idx}>
                            {name}
                        </Button>
                    ))}
                </VStack>
            </chakra.header>
        </Box>
    )
}

export default Navbar
