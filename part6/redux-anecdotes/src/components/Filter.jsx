import { useDispatch, useSelector } from 'react-redux'
import { updateSearch } from '../reducers/searchReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const search = useSelector(state => state.search)

  const handleChange = e => {
    dispatch(updateSearch(e.target.value))
  }
  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      <label htmlFor="filter">filter</label>
      <input
        name="filter"
        id="filter"
        type="text"
        onChange={handleChange}
        value={search}
      />
    </div>
  )
}

export default Filter
