import { configureStore } from '@reduxjs/toolkit'
import sidebarReducer from './sidebarSlice'
import timelineReducer from "./TimelineSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    timeline: timelineReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store