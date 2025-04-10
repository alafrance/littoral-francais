import { createSlice } from '@reduxjs/toolkit'

export enum SidebarName {
  GLOBAL = 'global',
  STATIONS = 'stations',
  TEMPETE = 'tempete',
  SUBMERSIONS = 'submersions',
}
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    global: true,
    stations: true,
    tempete: true,
    submersions: true,
  },
  reducers: {
    setInfoSidebar: (state, action) => {
      if (action.payload.name === SidebarName.GLOBAL) {
        state.global = action.payload.value
        state.stations = action.payload.value
        state.tempete = action.payload.value
        state.submersions = action.payload.value
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        state[action.payload.name] = action.payload.value
      }
    }
  },
})
export const { setInfoSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer