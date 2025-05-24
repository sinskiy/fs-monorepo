import { Snackbar } from '@mui/material'
import { useContext } from 'react'
import NotificationContext from '../context/notificationContext'

const Message = () => {
  const [notification] = useContext(NotificationContext)
  if (notification.text) {
    return <Snackbar message={notification.text} open={!!notification.text} />
  }
}

export default Message
