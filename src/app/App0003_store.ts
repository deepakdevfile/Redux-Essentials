import { configureStore } from "@reduxjs/toolkit"
import postsReducer from '../features/posts/App0003_postsSlice'
import authReducer from '../features/auth/App0003_authSlice'
import usersReducer from '../features/users/App0003_usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import { listenerMiddleware } from "./listenerMiddleware"

export const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        users: usersReducer,
        notifications: notificationsReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch