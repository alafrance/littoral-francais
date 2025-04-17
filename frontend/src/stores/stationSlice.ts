import { createSlice } from '@reduxjs/toolkit'

const stationSlicer = createSlice({
  name: 'station',
  initialState: {
    id: null,
    startAvailableYear: null,
    endAvailableYear: null,
  },
  reducers: {
    setId: (state, action) => {
      state.id = action.payload
    },
    setAvailableYears: (state, action) => {
      state.startAvailableYear = action.payload.startAvailableYear
      state.endAvailableYear = action.payload.endAvailableYear
    }
  },
})
export const { setId, setAvailableYears } = stationSlicer.actions
export default stationSlicer.reducer