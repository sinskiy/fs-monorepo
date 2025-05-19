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

export const setNotification = (notification, resetAfterSeconds) => {
  return dispatch => {
    dispatch(updateNotification(notification))
    setTimeout(() => dispatch(resetNotification()), resetAfterSeconds * 1000)
  }
}

export default notificationSlice.reducer
