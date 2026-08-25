
import {configureStore} from '@reduxjs/toolkit'
import counterReducer from './../features/counter/App0002_counterSlice'
import type { Action, ThunkAction } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']

export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>