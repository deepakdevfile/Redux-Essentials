import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./App0003_store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: RootState
    dispatch: AppDispatch
}>()