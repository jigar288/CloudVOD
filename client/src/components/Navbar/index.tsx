import * as React from 'react'
import { chakra, Box, Flex, HStack, Button, useDisclosure, VStack, IconButton, Avatar } from '@chakra-ui/react'
import { AiOutlineMenu } from 'react-icons/ai'
import { NavbarProps } from '../../types'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
//import Logo from "components/navbar/logo"; //TODO

const Navbar = (props: NavbarProps) => {
    const mobileNav = useDisclosure()
    const { user, sanity } = useAppSelector((state) => state)

    return (
        <Box shadow="md">
            <chakra.header bg="gray.800" borderColor="gray.600" borderBottomWidth={1} w="full" px={{ base: 2, sm: 4 }} py={4}>
                <Flex alignItems="center" justifyContent="space-between" mx="auto" flexFlow="row-reverse">
                    <HStack spacing={3} display="flex" alignItems="center">
                        <HStack spacing={3} display={{ base: 'none', md: 'inline-flex' }}>
                            {props.paths.map(({ name, href, icon, authenticated, external }, idx) => {
                                const shouldDisplay = authenticated === undefined || (authenticated && user) || (!authenticated && !user)
                                const navigateExt: React.MouseEventHandler<HTMLButtonElement> | undefined = external
                                    ? (event) => {
                                          event.preventDefault()
                                          if (href) window.location.href = href
                                      }
                                    : undefined

                                return (
                                    <>
                                        {shouldDisplay && (
                                            <Button as={Link} variant="ghost" to={{ pathname: href }} onClick={navigateExt} leftIcon={icon} size="sm" key={idx}>
                                                {name}
                                            </Button>
                                        )}
                                    </>
                                )
                            })}
                        </HStack>

                        {user !== null && <Avatar size="sm" name="Clark Chen" src={user.picture} />}
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
                    {props.paths.map(({ name, href, icon, authenticated, external }, idx) => {
                        const shouldDisplay = authenticated === undefined || (authenticated && user) || (!authenticated && !user)
                        const navigateExt: React.MouseEventHandler<HTMLButtonElement> | undefined = external
                            ? (event) => {
                                  event.preventDefault()
                                  if (href) window.location.href = href
                              }
                            : undefined

                        return (
                            <>
                                {shouldDisplay && (
                                    <Button isFullWidth as={Link} display="flex" justifyContent="flex-start" to={{ pathname: href }} variant="ghost" onClick={navigateExt} leftIcon={icon} key={idx}>
                                        {name}
                                    </Button>
                                )}
                            </>
                        )
                    })}
                </VStack>
            </chakra.header>
        </Box>
    )
}

export default Navbar
