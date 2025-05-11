import test, { beforeEach, describe } from 'node:test'
import supertest from 'supertest'
import app from '../app.js'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import assert from 'node:assert'

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  await User.insertOne({ username: 'root', passwordHash })
})

describe('GET users', () => {
  test('initial users are returned', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, 1)

    assert.partialDeepStrictEqual(response.body[0], { username: 'root' })
  })
})

// TODO
describe('POST user', () => {
  test('creation succeeds with a fresh username', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
      password: 'johndoe2005',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const newResponse = await api.get('/api/users')
    assert.strictEqual(newResponse.body.length, response.body.length + 1)

    const usernames = newResponse.body.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('user is not created if username is taken', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const newResponse = await api.get('/api/users')
    assert.strictEqual(response.body.length, newResponse.body.length)
  })

  test('user is not created without password', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('3 characters long'))

    const newResponse = await api.get('/api/users')
    assert.strictEqual(response.body.length, newResponse.body.length)

    const usernames = newResponse.body.map(user => user.username)
    assert.strictEqual(usernames.includes('johndoe'), false)
  })

  test('user is not created without a username', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      name: 'John Doe',
      password: 'johndoe2005',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('User validation failed'))

    const newResponse = await api.get('/api/users')
    assert.strictEqual(response.body.length, newResponse.body.length)

    const usernames = newResponse.body.map(user => user.username)
    assert.strictEqual(usernames.includes('johndoe'), false)
  })

  test('user is not created with a short password', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      username: 'johndoe',
      name: 'John Doe',
      passowrd: '1',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('3 characters long'))

    const newResponse = await api.get('/api/users')
    assert.strictEqual(response.body.length, newResponse.body.length)

    const usernames = newResponse.body.map(user => user.username)
    assert.strictEqual(usernames.includes('johndoe'), false)
  })

  test('user is not created with a short username', async () => {
    const response = await api.get('/api/users')

    const newUser = {
      username: 'jo',
      name: 'John Doe',
      password: 'johndoe2005',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error.includes('User validation failed'))

    const newResponse = await api.get('/api/users')
    assert.strictEqual(response.body.length, newResponse.body.length)

    const usernames = newResponse.body.map(user => user.username)
    assert.strictEqual(usernames.includes('johndoe'), false)
  })
})
