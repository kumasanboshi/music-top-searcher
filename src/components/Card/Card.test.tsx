import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('renders children content', () => {
    render(
      <Card>
        <span>Card content</span>
      </Card>
    )

    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    const { container } = render(<Card>Content</Card>)

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('default')
  })

  it('renders with elevated variant', () => {
    const { container } = render(<Card variant="elevated">Content</Card>)

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('elevated')
  })

  it('renders with outlined variant', () => {
    const { container } = render(<Card variant="outlined">Content</Card>)

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('outlined')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-class')
  })

  it('renders with different padding sizes', () => {
    const { container } = render(<Card padding="lg">Content</Card>)

    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('paddingLg')
  })
})
