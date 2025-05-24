export const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

export const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: /new note/i }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: /create/i }).click()
}

export const likeBlog = async (page, title, times) => {
  await page.getByText(new RegExp(title, 'i')).waitFor()
  const blog = await page.getByText(new RegExp(title, 'i'))

  const view = await blog.getByRole('button', { name: /view/i })
  await view.click()

  const blogWrapper = await blog.locator('..')

  const like = await blogWrapper.getByRole('button', { name: /like/i })
  for await (const i of asyncIterator(times)) {
    await like.click()
    await page.waitForTimeout(500)
  }
}

async function* asyncIterator(times) {
  for (let i = 0; i < times; i++) {
    yield i
  }
}
