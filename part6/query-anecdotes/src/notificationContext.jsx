import PropTypes from 'prop-types'
import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return ''
    default:
      return state
  }
}

export const NotificationContext = createContext([])

const NotificationProvider = ({ children }) => {
  const [notificationState, dispatchNotification] =
    useReducer(notificationReducer)
  return (
    <NotificationContext.Provider
      value={[notificationState, dispatchNotification]}
    >
      {children}
    </NotificationContext.Provider>
  )
}
NotificationProvider.propTypes = {
  children: PropTypes.node,
}

export default NotificationProvider

export const useShowNotification = () => {
  const [, dispatchNotification] = useContext(NotificationContext)
  return message => {
    dispatchNotification({ type: 'SET', payload: message })
    setTimeout(() => dispatchNotification({ type: 'RESET' }), 5000)
  }
}
