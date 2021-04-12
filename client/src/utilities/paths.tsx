import React from 'react'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUpload, AiOutlineVideoCamera, AiOutlineInfoCircle } from 'react-icons/ai'
import { NavbarPath } from '../types'
import { APP_ROUTES } from './routes'

export const paths: NavbarPath[] = [
    { name: 'Videos', icon: <AiOutlineVideoCamera />, href: APP_ROUTES.VIDEOS_PAGE },
    { name: 'Upload', icon: <AiOutlineUpload />, authenticated: true, href: APP_ROUTES.UPLOAD_PAGE },
    { name: 'Login', icon: <AiOutlineLogin />, authenticated: false, href: '/', external: true },
    { name: 'Sign Off', icon: <AiOutlineLogout />, authenticated: true, href: '/', external: true },
    { name: 'About Us', icon: <AiOutlineInfoCircle />, href: APP_ROUTES.ABOUT_PAGE },
]
