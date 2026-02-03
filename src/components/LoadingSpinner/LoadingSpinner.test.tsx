import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default text', () => {
    render(<LoadingSpinner />)

    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="データを取得中" />)

    expect(screen.getByText('データを取得中')).toBeInTheDocument()
  })

  it('renders spinner element', () => {
    const { container } = render(<LoadingSpinner />)

    expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { container } = render(<LoadingSpinner size="lg" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('sizeLg')
  })

  it('has accessible role', () => {
    render(<LoadingSpinner />)

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
