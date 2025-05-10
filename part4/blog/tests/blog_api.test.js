import supertest from 'supertest'
import { test, after, beforeEach } from 'node:test'
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

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are 6 blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 6)
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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'test',
    author: 'example',
    url: 'https://example.com',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(titles.length, initialBlogs.length + 1)

  assert(titles.includes('test'))
})

test('likes default to 0 if missing', async () => {
  const newBlog = {
    title: 'test',
    author: 'example',
    url: 'https://example.com',
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')

  const likes = response.body.map(blog => blog.likes)

  assert(likes.every(like => typeof like === 'number'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'example',
    url: 'https://example.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'test',
    author: 'example',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

after(async () => await mongoose.connection.close())
