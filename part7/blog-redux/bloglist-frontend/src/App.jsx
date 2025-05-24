import { useSelector } from 'react-redux'
import User from './components/User'
import Blogs from './components/Blogs'

const App = () => {
  const user = useSelector(state => state.user)

  if (user === null) {
    return <User />
  }

  return <Blogs />
}

export default App
