import React from 'react'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUpload, AiOutlineVideoCamera } from 'react-icons/ai'
import { NavbarPath } from '../types'

export const paths: NavbarPath[] = [
    { name: 'Videos', icon: <AiOutlineVideoCamera />, href: '/' },
    { name: 'Upload', icon: <AiOutlineUpload />, authenticated: true, href: '/upload' },
    { name: 'Login', icon: <AiOutlineLogin />, authenticated: false, href: '/', external: true },
    { name: 'Sign Off', icon: <AiOutlineLogout />, authenticated: true, href: '/', external: true },
]
