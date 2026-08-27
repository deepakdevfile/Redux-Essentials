import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/App0003_store"

interface AuthState {
    username: string | null
}

const initialState: AuthState = {
    username: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        userLoggedIn(state, action: PayloadAction<string>){
            state.username = action.payload
        },
        userLoggedOut(state){
            state.username = null
        },
    },
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUsername = (state: RootState) => state.auth.username