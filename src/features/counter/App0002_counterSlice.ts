import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { RootState, AppThunk } from "../../app/App0002_store"
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchCount } from "./App0002_counterAPI"

export interface CounterState {
    value: number
    status: 'idle' | 'loading' | 'failed'
}

const initialState: CounterState = {
    value: 0,
    status: 'idle',
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: state => {
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
    },

    extraReducers: builder => {
        builder
            .addCase(incrementAsync.pending, state => {
                state.status = 'loading'
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.value += action.payload
            })
            .addCase(incrementAsync.rejected, state => {
                state.status = 'failed'
            })
    }
})

export default counterSlice.reducer

export const selectCount = (state: RootState) => state.counter.value

export const {increment, decrement, incrementByAmount} = counterSlice.actions

export const incrementIfOdd = (amount: number): AppThunk => {
    return (dispatch, getState) => {
        const currentValue = selectCount(getState())
        if(currentValue % 2 === 1){
            dispatch(incrementByAmount(amount))
        }
    }
}

export const incrementAsync = createAsyncThunk(
    'counter/fetchCount',
    async(amount: number) => {
        const response = await fetchCount(amount)
        return response.data
    }
)

export const selectStatus = (state: RootState) => state.counter.status