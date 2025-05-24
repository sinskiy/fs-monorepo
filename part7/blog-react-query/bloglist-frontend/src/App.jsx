import User from './components/User'
import Blogs from './components/Blogs'
import { useContext } from 'react'
import UserContext from './context/userContext'

const App = () => {
  const [user] = useContext(UserContext)

  if (user === null) {
    return <User />
  }

  return <Blogs />
}

export default App
