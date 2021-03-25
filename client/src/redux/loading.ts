import { createSlice } from '@reduxjs/toolkit'
import { RootActions } from '.'

const initialState: { [action in RootActions]: boolean } = {
    RETRIEVE_CATEGORIES: false,
    RETRIEVE_USER: false,
    RETRIEVE_VIDEOS: false,
    CHECK_SERVICE: false,
}

export const slice = createSlice({
    name: 'loading',
    initialState,
    reducers: {},
})
