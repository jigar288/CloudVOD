import { createSlice } from '@reduxjs/toolkit'
import { RootActions } from '.'

export const slice = createSlice({
    name: 'error',
    initialState: {} as { [action in RootActions]: string | undefined },
    reducers: {},
})
