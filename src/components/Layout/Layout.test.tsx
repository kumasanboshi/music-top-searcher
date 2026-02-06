import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Layout from './Layout'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Layout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child">Child content</div>
      </Layout>
    )

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('renders header with site title', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByText('Music Top Searcher')).toBeInTheDocument()
  })

  it('renders left and right sidebars with ad placeholders', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )

    const adPlaceholders = screen.getAllByText('広告枠')
    expect(adPlaceholders).toHaveLength(2)
  })

  it('renders main content area', () => {
    renderWithRouter(
      <Layout>
        <div>Main content</div>
      </Layout>
    )

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })

  it('has proper landmark structure for accessibility', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('complementary')).toHaveLength(2)
  })

  it('renders footer with copyright', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    )

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText(/© 2025 Music Top Searcher/)).toBeInTheDocument()
  })
})
