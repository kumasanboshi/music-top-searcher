import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Button from './Button'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Button', () => {
  it('renders children content', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('renders as a button by default', () => {
    render(<Button>Click</Button>)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders as a link when "as" prop is Link', () => {
    renderWithRouter(
      <Button as="link" to="/test">
        Link Button
      </Button>
    )

    expect(screen.getByRole('link')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Primary</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('primary')
  })

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('secondary')
  })

  it('renders with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('outline')
  })

  it('renders with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('ghost')
  })

  it('renders with different sizes', () => {
    const { container } = render(<Button size="lg">Large</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('sizeLg')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>)

    const button = container.querySelector('button')
    expect(button?.className).toContain('custom-class')
  })
})
