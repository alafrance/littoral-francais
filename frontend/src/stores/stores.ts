import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebarSlice'
import stationReducer from "./stationSlice.ts";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    station: stationReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store