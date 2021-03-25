import { createSlice } from '@reduxjs/toolkit'
import { User } from '../types'

export enum actions {
    RETRIEVE_USER = 'RETRIEVE_USER',
}

export const slice = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {},
})
