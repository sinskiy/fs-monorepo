const initialState = ''

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_UPDATE': {
      return action.payload
    }
    default:
      return state
  }
}

export const updateSearch = newSearch => {
  return {
    type: 'SEARCH_UPDATE',
    payload: newSearch,
  }
}

export default searchReducer
