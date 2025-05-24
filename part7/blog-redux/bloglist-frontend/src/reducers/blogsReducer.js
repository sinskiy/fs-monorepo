import { createSlice } from '@reduxjs/toolkit'
import { sortBlogs } from '../utils'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return sortBlogs(action.payload)
    },
    addBlog(state, action) {
      state.push(action.payload)
      state = sortBlogs(state)
    },
    updateBlog(state, action) {
      return sortBlogs(
        state.map(blog =>
          blog.id === action.payload.id ? action.payload : blog
        )
      )
    },
    deleteBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
  },
})

export const { setBlogs, addBlog, deleteBlog, updateBlog } = blogsSlice.actions
export default blogsSlice.reducer
