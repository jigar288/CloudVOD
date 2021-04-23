import React from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { AiOutlineClose, AiOutlineLogin, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai'
import { Disclosure } from '@headlessui/react'
import { NavbarProps } from '../../types'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../state'
import { getAuthorizationLink } from '../../utilities'
//import Logo from "components/navbar/logo"; //TODO

function classNames(...classes: (string | Boolean)[]) {
    return classes.filter(Boolean).join(' ')
}

const Navbar = (props: NavbarProps) => {
    const mobileNav = useDisclosure()
    const { user, sanity } = useAppSelector((state) => state)
    const DEV_DATA_SANITY = process.env.DEV_DATA !== 'true'

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">{open ? 'Close' : 'Open'} main menu</span>
                                        {open ? <AiOutlineClose className="block h-6 w-6" aria-hidden="true" /> : <AiOutlineMenu className="block h-6 w-6" aria-hidden="true" />}
                                    </Disclosure.Button>
                                </div>

                                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0 flex items-center">
                                        <div className="block h-auto w-auto font-extrabold text-xl">CloudTube</div>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex space-x-4">
                                            {props.paths.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={item.href}
                                                    className={classNames(
                                                        false ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium',
                                                    )}
                                                    aria-current={false ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <div className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                        <a href={getAuthorizationLink(!!!user, DEV_DATA_SANITY)} className="md:flex">
                                            <span className="hidden md:block px-2">{user ? 'Logout' : 'Login'}</span>
                                            {user ? <AiOutlineLogout className="h-6 w-6" aria-hidden="true" /> : <AiOutlineLogin className="h-6 w-6" aria-hidden="true" />}
                                        </a>
                                    </div>

                                    {user && (
                                        <div className="ml-3 relative">
                                            <span className="sr-only">Open user menu</span>
                                            <img className="h-8 w-8 rounded-full" src={user.picture} alt="" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {props.paths.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        className={classNames(
                                            false ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'block px-3 py-2 rounded-md text-base font-medium',
                                        )}
                                        aria-current={false ? 'page' : undefined}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    )
}

export default Navbar
