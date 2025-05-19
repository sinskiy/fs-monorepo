import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return ''
    },
  },
})

export const { updateNotification, resetNotification } =
  notificationSlice.actions
export default notificationSlice.reducer
