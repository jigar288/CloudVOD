import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootActions } from '.'

const initialState: { [action in RootActions]: boolean } = {
    RETRIEVE_CATEGORIES: false,
    RETRIEVE_USER: false,
    RETRIEVE_VIDEOS: false,
    CHECK_SERVICE: false,
    UPLOAD_VIDEO: false,
}

export const slice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        start: (state, action: PayloadAction<RootActions>) => {
            state[action.payload] = true
        },
        stop: (state, action: PayloadAction<RootActions>) => {
            state[action.payload] = false
        },
    },
})
