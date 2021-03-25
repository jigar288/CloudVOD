import { createSlice } from '@reduxjs/toolkit'

export enum actions {
    CHECK_SERVICE = 'CHECK_SERVICE',
}

export const slice = createSlice({
    name: 'sanity',
    initialState: false,
    reducers: {},
})
