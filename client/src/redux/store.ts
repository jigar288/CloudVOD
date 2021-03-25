import { configureStore, Action } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { ThunkAction } from 'redux-thunk'

import { DataRedux, UserRedux, ErrorRedux, LoadingRedux, SanityRedux } from '.'

const reducer = combineReducers({
    // here we will be adding reducers
    data: DataRedux.slice.reducer,
    user: UserRedux.slice.reducer,
    error: ErrorRedux.slice.reducer,
    loading: LoadingRedux.slice.reducer,
    sanity: SanityRedux.slice.reducer,
})

export const store = configureStore({
    reducer,
})

export const RootActionTypes = { data: DataRedux.actions, user: UserRedux.actions, sanity: SanityRedux.actions }

export default store
export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootActions = DataRedux.actions | UserRedux.actions | SanityRedux.actions
