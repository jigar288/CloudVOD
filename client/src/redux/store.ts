import { configureStore, Action } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { ThunkAction } from 'redux-thunk'

import * as data from './data'
import * as user from './user'
import * as error from './error'
import * as loading from './loading'
import * as sanity from './sanity'

const reducer = combineReducers({
    // here we will be adding reducers
    data: data.slice.reducer,
    user: user.slice.reducer,
    error: error.slice.reducer,
    loading: loading.slice.reducer,
    sanity: sanity.slice.reducer,
})

export const store = configureStore({
    reducer,
})

export const RootActionTypes = { data: data.actions, user: user.actions, sanity: sanity.actions }

export default store
export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
export type RootActions = data.actions | user.actions | sanity.actions
