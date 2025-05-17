import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('blog form behaves correctly', () => {
  test('blog form runs function on submit', async () => {
    const user = userEvent.setup()
    const mockHandler = vi.fn()

    render(<BlogForm handleCreate={mockHandler} />)

    const [title, author, url] = await screen.findAllByRole('textbox')
    await user.type(title, 'testtitle')
    await user.type(author, 'testauthor')
    await user.type(url, 'https://example.com')

    const submitButton = await screen.findByRole('button', { name: 'create' })
    await user.click(submitButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.lastCall).toEqual([
      'testtitle',
      'testauthor',
      'https://example.com',
    ])
  })
})
