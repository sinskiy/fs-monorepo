export const dummy = blogs => {
  return 1
}

export const totalLikes = blogs =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0)

export const favoritePost = blogs =>
  blogs.length > 0
    ? blogs.reduce((mostLikes, blog) =>
        blog.likes > mostLikes.likes ? blog : mostLikes
      )
    : null

export const mostBlogs = blogs => {
  if (blogs.length === 0) return null

  const countByAuthor = {}
  for (const blog of blogs) {
    if (countByAuthor[blog.author]) {
      countByAuthor[blog.author]++
    } else {
      countByAuthor[blog.author] = 1
    }
  }

  return Object.entries(countByAuthor).reduce(
    (maxBlogs, [author, blogs]) => {
      if (blogs > maxBlogs.blogs) {
        return { author, blogs }
      } else {
        return maxBlogs
      }
    },
    { author: 'initial', blogs: -1 }
  )
}

export const mostLikes = blogs => {
  if (blogs.length === 0) return null

  const countByAuthor = {}
  for (const blog of blogs) {
    if (countByAuthor[blog.author]) {
      countByAuthor[blog.author] += blog.likes
    } else {
      countByAuthor[blog.author] = blog.likes
    }
  }

  return Object.entries(countByAuthor).reduce(
    (maxLikes, [author, likes]) => {
      if (likes > maxLikes.likes) {
        return { author, likes }
      } else {
        return maxLikes
      }
    },
    { author: 'initial', likes: -1 }
  )
}
