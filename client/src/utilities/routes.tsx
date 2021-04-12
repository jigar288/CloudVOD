import { lazily } from 'react-lazily'
import { AppRoute } from '../types'
const { VideosPage, AboutPage, VideoPage, UploadPage } = lazily(() => import('../pages'))

export enum APP_ROUTES {
    VIDEOS_PAGE = '/',
    ABOUT_PAGE = '/about',
    UPLOAD_PAGE = '/upload',
    VIDEO_PAGE = '/watch/:id',
}

export const routes: AppRoute[] = [
    { path: APP_ROUTES.VIDEOS_PAGE, exact: true, component: VideosPage, dependent: true },
    { path: APP_ROUTES.ABOUT_PAGE, component: AboutPage },
    { path: APP_ROUTES.VIDEO_PAGE, component: VideoPage, dependent: true },
    { path: APP_ROUTES.UPLOAD_PAGE, component: UploadPage, authenticated: true, dependent: true },
]
