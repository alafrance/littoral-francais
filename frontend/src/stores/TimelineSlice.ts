import { createSlice } from '@reduxjs/toolkit'

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    year: "..."
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload
    }
  },
})

export const { setYear } = timelineSlice.actions
export default timelineSlice.reducer