import PropTypes from 'prop-types'
import { useImperativeHandle, useState } from 'react'

const Togglable = ({ children, buttonLabel, ref }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </>
  )
}
Togglable.propTypes = {
  children: PropTypes.elementType.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  ref: PropTypes.object.isRequired,
}

export default Togglable
