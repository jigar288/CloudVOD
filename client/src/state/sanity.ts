import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppDispatch, AppThunk } from './store'
import { CHECK_SERVICE_RESPONSE } from '../development/data'
import { AxiosResponse } from 'axios'
import * as ErrorRedux from './error'
import * as LoadingRedux from './loading'

export enum actions {
    CHECK_SERVICE = 'CHECK_SERVICE',
}

export const slice = createSlice({
    name: 'sanity',
    initialState: false,
    reducers: {
        set: (state, action: PayloadAction<boolean>) => {
            return action.payload
        },
    },
})

export const check_service = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(LoadingRedux.slice.actions.start(actions.CHECK_SERVICE))

    // * Get mocked data or ping the server
    let response: AxiosResponse<String | undefined>
    if (process.env.DEV_DATA !== 'true') response = CHECK_SERVICE_RESPONSE[Math.floor(Math.random() * CHECK_SERVICE_RESPONSE.length)]
    // TODO: Actually make the request to the backend
    else response = CHECK_SERVICE_RESPONSE[Math.floor(Math.random() * CHECK_SERVICE_RESPONSE.length)]

    // * Check if server is currently responding
    if (response.status !== 200) dispatch(ErrorRedux.slice.actions.set({ action: actions.CHECK_SERVICE, err: 'API not responding. Please try again later' }))
    else dispatch(ErrorRedux.slice.actions.remove(actions.CHECK_SERVICE))

    dispatch(slice.actions.set(response.status === 200))
    dispatch(LoadingRedux.slice.actions.stop(actions.CHECK_SERVICE))
}
