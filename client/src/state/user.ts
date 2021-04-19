import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../types'
import * as ErrorRedux from './error'
import * as LoadingRedux from './loading'
import { RETRIEVE_USER_RESPONSE } from '../development/data'
import { AxiosResponse } from 'axios'
import { AppDispatch, AppThunk } from '.'

export enum actions {
    RETRIEVE_USER = 'RETRIEVE_USER',
}

export const slice = createSlice({
    name: 'user',
    initialState: null as User | null,
    reducers: {
        set: (state, action: PayloadAction<User>) => action.payload,
        clear: () => null,
    },
})

export const authorize = (): AppThunk => async (dispatch: AppDispatch) => {
    dispatch(LoadingRedux.slice.actions.start(actions.RETRIEVE_USER))

    // * Get mocked data or ping the server
    let response: AxiosResponse<User | undefined>
    if (process.env.DEV_DATA !== 'true') response = RETRIEVE_USER_RESPONSE[Math.floor(Math.random() * RETRIEVE_USER_RESPONSE.length)]
    // TODO: Actually make the request to the backend
    else response = RETRIEVE_USER_RESPONSE[Math.floor(Math.random() * RETRIEVE_USER_RESPONSE.length)]

    // * Check if server is currently responding
    if (response.status === 200 && response.data) {
        dispatch(slice.actions.set(response.data))
        dispatch(ErrorRedux.slice.actions.remove(actions.RETRIEVE_USER))
    } else {
        dispatch(slice.actions.clear())
        if (response.status === 401) dispatch(ErrorRedux.slice.actions.set({ action: actions.RETRIEVE_USER, err: 'You are not authorized to access this service' }))
        else dispatch(ErrorRedux.slice.actions.set({ action: actions.RETRIEVE_USER, err: 'API not responding. Please try again later' }))
    }

    dispatch(LoadingRedux.slice.actions.stop(actions.RETRIEVE_USER))
}
