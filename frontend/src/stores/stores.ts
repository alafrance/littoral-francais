import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebarSlice'
import timelineReducer from "./TimelineSlice";
import mapReducer from "./mapSlice.ts";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    timeline: timelineReducer,
    map: mapReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store