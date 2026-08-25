import { useSelector,useDispatch } from "react-redux"
import type { RootState, AppDispatch } from './App0002_store'

export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()