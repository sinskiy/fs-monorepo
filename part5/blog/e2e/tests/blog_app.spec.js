import test, { expect } from '@playwright/test'
import { createBlog, likeBlog, loginWith } from './helper.js'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: { username: 'root', password: 'sekret' },
    })

    await page.goto('/')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText(/log in/i)).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test.describe('login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText(/logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'root', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  test.describe('when logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'root', 'sekret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'testtitle', 'testauthor', 'https://example.com')

      await expect(page.getByText(/testtitle testauthor/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /view/i })).toBeVisible()
    })

    test.describe('when blog created and expanded', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, 'testtitle', 'testauthor', 'https://example.com')
        await page.getByRole('button', { name: /view/i }).click()
      })

      test('can like', async ({ page }) => {
        await page.getByRole('button', { name: /like/i }).click()
        await expect(page.getByText(/1/)).toBeVisible()
      })

      test('can delete', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept())

        await page.getByRole('button', { name: /remove/i }).click()
        await expect(page.getByText(/testtitle testauthor/i)).not.toBeAttached()
      })
    })

    test.describe('when blog by a different user is created and expanded', () => {
      test.beforeEach(async ({ page, request }) => {
        await request.post('/api/users', {
          data: { username: 'rot', password: 'sekret' },
        })
        const response = await request.post('/api/login', {
          data: { username: 'rot', password: 'sekret' },
        })
        await request.post('/api/blogs', {
          data: {
            title: 'testtitle',
            author: 'testauthor',
            url: 'https://example.com',
          },
          headers: {
            authorization: `Bearer ${(await response.json()).token}`,
          },
        })

        // refresh
        await page.reload()

        await page.getByRole('button', { name: /view/i }).click()
      })

      test('delete button is not shown', async ({ page }) => {
        await expect(
          page.getByRole('button', { name: /remove/i })
        ).not.toBeAttached()
      })
    })

    test.describe('when multiple blogs are created', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(
          page,
          'testtitle0',
          'testauthor0',
          'https://example.com'
        )
        await createBlog(
          page,
          'testtitle1',
          'testauthor1',
          'https://example.com'
        )
        await createBlog(
          page,
          'testtitle2',
          'testauthor2',
          'https://example.com'
        )
      })

      test('blogs are sorted by likes', async ({ page }) => {
        await likeBlog(page, 'testtitle1 testauthor1', 2)
        await likeBlog(page, 'testtitle2 testauthor2', 1)

        await expect(page.getByText(/testtitle/i).first()).toHaveText(
          /testtitle1 testauthor1/i
        )
        await expect(page.getByText(/testtitle/i).last()).toHaveText(
          /testtitle0 testauthor0/i
        )
      })
    })
  })
})
