import React from 'react'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUpload, AiOutlineVideoCamera } from 'react-icons/ai'
import { NavbarPath } from '../types'

export const paths: NavbarPath[] = [
    { name: 'Videos', icon: <AiOutlineVideoCamera />, authenticated: false, href: '/' },
    { name: 'Upload', icon: <AiOutlineUpload />, authenticated: true, href: '/' },
    { name: 'Login', icon: <AiOutlineLogin />, authenticated: true, href: '/' },
    { name: 'Sign Off', icon: <AiOutlineLogout />, authenticated: true, href: '/' },
]
