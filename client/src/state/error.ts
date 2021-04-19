import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootActions } from '.'

export const slice = createSlice({
    name: 'error',
    initialState: {} as { [action in RootActions]: string | undefined },
    reducers: {
        remove: (state, action: PayloadAction<RootActions>) => {
            return { ...state, [action.payload]: undefined }
        },
        set: (state, action: PayloadAction<{ err: string; action: RootActions }>) => {
            return { ...state, [action.payload.action]: action.payload.err }
        },
    },
})
