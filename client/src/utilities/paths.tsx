import React from 'react'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUpload, AiOutlineVideoCamera, AiOutlineInfoCircle } from 'react-icons/ai'
import { NavbarPath } from '../types'
import { APP_ROUTES } from './routes'

export const getAuthorizationLink = (login: boolean, sanity: boolean) => {
    if (sanity && import.meta.env.VITE_API_URL && import.meta.env.VITE_API_BASE_PATH) {
        return import.meta.env.VITE_API_URL + import.meta.env.VITE_API_BASE_PATH + '/user/' + (login ? 'login' : 'logout') + '?return=' + import.meta.env.VITE_PUBLIC_URL
    } else return '/'
}

export const paths: NavbarPath[] = [
    { name: 'Videos', icon: <AiOutlineVideoCamera className="inline-block w-5 h-5" />, href: APP_ROUTES.VIDEOS_PAGE },
    { name: 'Upload', icon: <AiOutlineUpload className="inline-block w-5 h-5" />, authenticated: true, href: APP_ROUTES.UPLOAD_PAGE },
    { name: 'About Us', icon: <AiOutlineInfoCircle className="inline-block w-5 h-5" />, href: APP_ROUTES.ABOUT_PAGE },
]
