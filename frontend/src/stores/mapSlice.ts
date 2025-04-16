import { createSlice } from '@reduxjs/toolkit'

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    stationId: null,
  },
  reducers: {
    setStationId: (state, action) => {
      state.stationId = action.payload
    }
  },
})
export const { setStationId } = mapSlice.actions
export default mapSlice.reducer