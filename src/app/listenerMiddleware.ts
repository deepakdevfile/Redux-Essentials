import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./App0003_store";

import { addPostsListeners } from "../features/posts/App0003_postsSlice";

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()
export type AppStartListening = typeof startAppListening

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
export type AppAddListener = typeof addAppListener

addPostsListeners(startAppListening)