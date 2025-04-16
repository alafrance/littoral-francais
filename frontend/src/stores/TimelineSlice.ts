import { createSlice } from '@reduxjs/toolkit'

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    year: null,
    startAvailableYear: null,
    endAvailableYear: null,
  },
  reducers: {
    setYear: (state, action) => {
      state.year = action.payload
    },
    setAvailableYears: (state, action) => {
      state.startAvailableYear = action.payload.startAvailableYear
      state.endAvailableYear = action.payload.endAvailableYear
    }
  },
})

export const { setYear, setAvailableYears } = timelineSlice.actions
export default timelineSlice.reducer