import test, { expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText(/log in/i)).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })
})
