import { createSlice } from '@reduxjs/toolkit'

const emptyState = { status: 'success', text: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState: emptyState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    resetNotification() {
      return emptyState
    },
  },
})

export const { setNotification, resetNotification } = notificationSlice.actions

export const showNotification = notification => {
  return dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(resetNotification()), 5000)
  }
}

export default notificationSlice.reducer
