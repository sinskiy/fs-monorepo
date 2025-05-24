import { useSelector } from 'react-redux'

const Message = () => {
  const notification = useSelector(state => state.notification)
  if (notification.text) {
    return (
      <div className={`message ${notification.status}`}>
        {notification.text}
      </div>
    )
  }
}

export default Message
