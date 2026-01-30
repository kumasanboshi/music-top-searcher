import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopPage from '../pages/TopPage'

describe('TopPage', () => {
  const renderTopPage = () =>
    render(
      <MemoryRouter>
        <TopPage />
      </MemoryRouter>,
    )

  it('アプリタイトルを表示する', () => {
    renderTopPage()
    expect(
      screen.getByRole('heading', { name: /Music Top Searcher/i }),
    ).toBeInTheDocument()
  })

  it('邦楽ボタンを表示する', () => {
    renderTopPage()
    expect(screen.getByRole('link', { name: /邦楽/i })).toBeInTheDocument()
  })

  it('洋楽ボタンを表示する', () => {
    renderTopPage()
    expect(screen.getByRole('link', { name: /洋楽/i })).toBeInTheDocument()
  })

  it('邦楽ボタンのリンク先が /rankings/jpop である', () => {
    renderTopPage()
    expect(screen.getByRole('link', { name: /邦楽/i })).toHaveAttribute(
      'href',
      '/rankings/jpop',
    )
  })

  it('洋楽ボタンのリンク先が /rankings/western である', () => {
    renderTopPage()
    expect(screen.getByRole('link', { name: /洋楽/i })).toHaveAttribute(
      'href',
      '/rankings/western',
    )
  })
})
