import PropTypes from 'prop-types'
import { createContext, useState } from 'react'

const UserContext = createContext([null, () => {}])
export default UserContext

export const UserProvider = ({ children }) => {
  const userState = useState(null)
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  )
}
UserProvider.propTypes = {
  children: PropTypes.node,
}
