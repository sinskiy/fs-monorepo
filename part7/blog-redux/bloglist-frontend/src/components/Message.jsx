import { Snackbar } from '@mui/material'
import { useSelector } from 'react-redux'

const Message = () => {
  const notification = useSelector(state => state.notification)
  if (notification.text) {
    return <Snackbar message={notification.text} open={!!notification.text} />
  }
}

export default Message
