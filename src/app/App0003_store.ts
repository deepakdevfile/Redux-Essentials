import { configureStore } from "@reduxjs/toolkit"
import postsReducer from '../features/posts/App0003_postsSlice'
import authReducer from '../features/auth/App0003_authSlice'
import usersReducer from '../features/users/App0003_usersSlice'

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        users: usersReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch