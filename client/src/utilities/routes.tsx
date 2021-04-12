import { AppRoute } from '../types'

export enum APP_ROUTES {
    VIDEOS_PAGE = '/',
    ABOUT_PAGE = '/about',
    UPLOAD_PAGE = '/upload',
    VIDEO_PAGE = '/watch/:id',
}

export const routes: AppRoute[] = [
    { path: APP_ROUTES.VIDEOS_PAGE, exact: true, component: undefined, dependent: true },
    { path: APP_ROUTES.ABOUT_PAGE, component: undefined },
    { path: APP_ROUTES.VIDEO_PAGE, component: undefined, dependent: true },
    { path: APP_ROUTES.UPLOAD_PAGE, component: undefined, authenticated: true, dependent: true },
]
