import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    activeSets: ["yellow"]
  },
  reducers: {
    handleItemClick: (state, action) => {
      if (action.payload === "global") {
        state.activeSets = ["yellow", "red", "violet"];
      } else {
        state.activeSets = [action.payload]
      }
    },
    setActiveSets: (state, action) => {
      state.activeSets = action.payload
    },
  },
})

export const { handleItemClick, setActiveSets } = sidebarSlice.actions
export default sidebarSlice.reducer