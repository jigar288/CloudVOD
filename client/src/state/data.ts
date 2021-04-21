import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Video, Category } from '../types'

import { RETRIEVE_VIDEOS_RESPONSE, RETRIEVE_CATEGORIES_RESPONSE } from '../development/data'
import * as ErrorRedux from './error'
import * as LoadingRedux from './loading'
import { AxiosResponse } from 'axios'
import { AppDispatch, AppThunk } from '.'
import { api } from '../utilities'

export enum actions {
    RETRIEVE_VIDEOS = 'RETRIEVE_VIDEOS',
    RETRIEVE_CATEGORIES = 'RETRIEVE_CATEGORIES',
    UPLOAD_VIDEO = 'UPLOAD_VIDEO',
}

export const slice = createSlice({
    name: 'data',
    initialState: {
        videos: [] as Video[],
        categories: [] as Category[],
    },
    reducers: {
        set_videos: (state, action: PayloadAction<Video[]>) => {
            return { ...state, videos: action.payload }
        },
        clear_videos: (state) => {
            return { ...state, videos: [] }
        },
        set_categories: (state, action: PayloadAction<Category[]>) => {
            return { ...state, categories: action.payload }
        },
        clear_categories: (state) => {
            return { ...state, categories: [] }
        },
    },
})

export const get_videos = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(LoadingRedux.slice.actions.start(actions.RETRIEVE_VIDEOS))

    // * Get mocked data or ping the server
    let response: AxiosResponse<Video[] | undefined>

    // TODO: Actually make the request to the backend
    // if (process.env.DEV_DATA !== 'true') response = RETRIEVE_VIDEOS_RESPONSE[Math.floor(Math.random() * RETRIEVE_VIDEOS_RESPONSE.length)]
    // else response = RETRIEVE_VIDEOS_RESPONSE[Math.floor(Math.random() * RETRIEVE_VIDEOS_RESPONSE.length)]
    if (process.env.DEV_DATA === 'true') response = RETRIEVE_VIDEOS_RESPONSE[Math.floor(Math.random() * RETRIEVE_VIDEOS_RESPONSE.length)]
    else response = await api.get('/data/videos')

    // * Check if server is currently responding
    if (response.status === 200 && response.data) {
        dispatch(slice.actions.set_videos(response.data))
        dispatch(ErrorRedux.slice.actions.remove(actions.RETRIEVE_VIDEOS))
    } else {
        dispatch(slice.actions.clear_videos())
        dispatch(ErrorRedux.slice.actions.set({ action: actions.RETRIEVE_VIDEOS, err: 'API not responding. Please try again later' }))
    }

    dispatch(LoadingRedux.slice.actions.stop(actions.RETRIEVE_VIDEOS))
}

export const get_categories = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(LoadingRedux.slice.actions.start(actions.RETRIEVE_CATEGORIES))

    // * Get mocked data or ping the server
    let response: AxiosResponse<Category[] | undefined>
    if (process.env.DEV_DATA === 'true') response = RETRIEVE_CATEGORIES_RESPONSE[Math.floor(Math.random() * RETRIEVE_VIDEOS_RESPONSE.length)]
    else response = await api.get('/data/categories')

    // * Check if server is currently responding
    if (response.status === 200 && response.data) {
        dispatch(slice.actions.set_categories(response.data))
        dispatch(ErrorRedux.slice.actions.remove(actions.RETRIEVE_CATEGORIES))
    } else {
        dispatch(slice.actions.clear_categories())
        dispatch(ErrorRedux.slice.actions.set({ action: actions.RETRIEVE_CATEGORIES, err: 'API not responding. Please try again later' }))
    }

    dispatch(LoadingRedux.slice.actions.stop(actions.RETRIEVE_CATEGORIES))
}
