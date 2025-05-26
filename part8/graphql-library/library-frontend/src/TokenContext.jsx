import { useState } from 'react'
import { createContext } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'

const TokenContext = createContext([])
export default TokenContext

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])
  return (
    <TokenContext.Provider value={[token, setToken]}>
      {children}
    </TokenContext.Provider>
  )
}
TokenProvider.propTypes = {
  children: PropTypes.node,
}
