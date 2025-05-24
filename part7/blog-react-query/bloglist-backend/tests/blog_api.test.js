import supertest from 'supertest'
import { test, after, beforeEach, describe } from 'node:test'
import app from '../app.js'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'
import { initialBlogs } from './test_helper.js'
import assert from 'assert'

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('GET blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are initial blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs include React Patterns', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('React patterns'))
  })

  test('blogs have id property', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(blog => blog.id)
    assert(ids.every(id => typeof id === 'string'))
  })
})

describe('POST blog', () => {
  test('a valid blog can be added', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      title: 'test',
      author: 'example',
      url: 'https://example.com',
      likes: 0,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ authorization: `Bearer ${result.body.token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    assert.strictEqual(titles.length, initialBlogs.length + 1)

    assert(titles.includes('test'))
  })

  test('likes default to 0 if missing', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      title: 'test',
      author: 'example',
      url: 'https://example.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ authorization: `Bearer ${result.body.token}` })

    const response = await api.get('/api/blogs')

    const likes = response.body.map(blog => blog.likes)

    assert(likes.every(like => typeof like === 'number'))
  })

  test('blog without title is not added', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'example',
      url: 'https://example.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ authorization: `Bearer ${result.body.token}` })
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      title: 'test',
      author: 'example',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ authorization: `Bearer ${result.body.token}` })
      .expect(400)
  })

  test('blog without token is not added', async () => {
    const newBlog = {
      title: 'test',
      author: 'example',
      url: 'https://example.com',
      likes: 0,
    }

    await api.post('/api/blogs').send(newBlog).expect(500)
  })
})

describe.skip('DELETE blog', () => {
  test('blog is deleted', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${result.body.token}` })
      .expect(400)

    const newResponse = await api.get('/api/blogs')

    assert.strictEqual(newResponse.body.length, initialBlogs.length - 1)

    assert(newResponse.body.every(blog => blog.title !== blogToDelete.title))
  })
})

describe('UPDATE blog', () => {
  test('blog is updated', async () => {
    const response = await api.get('/api/blogs')

    const blogToUpdate = response.body[0]

    const updatedTitle = 'test__UPDATED TITLE'
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate, title: updatedTitle })

    const newResponse = await api.get('/api/blogs')

    assert.strictEqual(newResponse.body.length, initialBlogs.length)

    assert(newResponse.body.some(blog => blog.title === updatedTitle))
  })
})

after(async () => await mongoose.connection.close())
