import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    updateSearch(state, action) {
      state = action.payload
    },
  },
})

export const { updateSearch } = searchSlice.actions
export default searchSlice.reducer
