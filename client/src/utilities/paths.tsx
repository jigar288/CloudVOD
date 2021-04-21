import React from 'react'
import { AiOutlineLogin, AiOutlineLogout, AiOutlineUpload, AiOutlineVideoCamera, AiOutlineInfoCircle } from 'react-icons/ai'
import { NavbarPath } from '../types'
import { APP_ROUTES } from './routes'

const getRedirectedLink = (login: boolean, sanity: boolean) => {
    if (sanity && process.env.API_URL && process.env.API_BASE_PATH) {
        return process.env.API_URL + process.env.API_BASE_PATH + '/user/' + (login ? 'login' : 'logout') + '?return=' + process.env.PUBLIC_URL
    } else return '/'
}

export const paths: (sanity: boolean) => NavbarPath[] = (sanity) => [
    { name: 'Videos', icon: <AiOutlineVideoCamera />, href: APP_ROUTES.VIDEOS_PAGE },
    { name: 'Upload', icon: <AiOutlineUpload />, authenticated: true, href: APP_ROUTES.UPLOAD_PAGE },
    { name: 'Login', icon: <AiOutlineLogin />, authenticated: false, href: getRedirectedLink(true, sanity), external: true },
    { name: 'Sign Off', icon: <AiOutlineLogout />, authenticated: true, href: getRedirectedLink(false, sanity), external: true },
    { name: 'About Us', icon: <AiOutlineInfoCircle />, href: APP_ROUTES.ABOUT_PAGE },
]
