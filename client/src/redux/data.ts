import { createSlice } from '@reduxjs/toolkit'
import { Video, Category } from '../types'

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
    reducers: {},
})
