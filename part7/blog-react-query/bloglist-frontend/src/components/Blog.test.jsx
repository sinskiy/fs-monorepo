import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('blog is rendered correctly', () => {
  test('default view shows only title and author', async () => {
    const blog = {
      id: '1',
      title: 'testtitle',
      author: 'testauthor',
      url: 'https://example.com',
      likes: 2,
      user: {
        id: '1',
        username: 'sinskiy',
      },
    }

    render(<Blog blog={blog} username="sinskiy" />)

    expect(await screen.findByText(/testtitle/i)).toBeInTheDocument()
    expect(await screen.findByText(/testauthor/i)).toBeInTheDocument()

    expect(
      screen.queryByText(/https:\/\/example\.com/i)
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/2/)).not.toBeInTheDocument()
  })

  test('expanded view works on click and shows likes and url', async () => {
    const blog = {
      id: '1',
      title: 'testtitle',
      author: 'testauthor',
      url: 'https://example.com',
      likes: 2,
      user: {
        id: '1',
        username: 'sinskiy',
      },
    }

    render(<Blog blog={blog} username="sinskiy" />)

    const user = userEvent.setup()
    const buttonExpandsView = await screen.findByText(/view/i)
    await user.click(buttonExpandsView)

    expect(await screen.findByText(/testtitle/i)).toBeInTheDocument()
    expect(await screen.findByText(/testauthor/i)).toBeInTheDocument()
    expect(
      await screen.findByText(/https:\/\/example\.com/i)
    ).toBeInTheDocument()
    expect(await screen.findByText(/2/i)).toBeInTheDocument()
  })
})

describe('blog behaves correctly', () => {
  test('like button runs function on click in expended view', async () => {
    const blog = {
      id: '1',
      title: 'testtitle',
      author: 'testauthor',
      url: 'https://example.com',
      likes: 2,
      user: {
        id: '1',
        username: 'sinskiy',
      },
    }

    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} username="sinskiy" handleLikeClick={mockHandler} />
    )

    const user = userEvent.setup()
    const buttonExpandsView = await screen.findByText(/view/i)
    await user.click(buttonExpandsView)

    const buttonAddsLike = await screen.findByRole('button', { name: /like/i })
    await user.click(buttonAddsLike)
    await user.click(buttonAddsLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
