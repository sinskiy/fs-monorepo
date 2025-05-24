import PropTypes from 'prop-types'
import { createContext, useContext, useReducer } from 'react'

const initialState = { type: 'success', text: '' }

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext([initialState])
export default NotificationContext

export const NotificationProvider = ({ children }) => {
  const notificationReducerValue = useReducer(notificationReducer, initialState)
  return (
    <NotificationContext.Provider value={notificationReducerValue}>
      {children}
    </NotificationContext.Provider>
  )
}
NotificationProvider.propTypes = {
  children: PropTypes.node,
}

export const useShowNotification = () => {
  const [, dispatchNotification] = useContext(NotificationContext)
  return value => {
    dispatchNotification({ type: 'SET', payload: value })
    setTimeout(() => {
      dispatchNotification({ type: 'RESET' })
    }, 5000)
  }
}
