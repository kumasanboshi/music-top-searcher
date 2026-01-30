import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('displays "Music Top Searcher"', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /Music Top Searcher/i }),
    ).toBeInTheDocument()
  })
})
