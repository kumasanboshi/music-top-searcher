import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import YearSelectPage from '../pages/YearSelectPage'

describe('YearSelectPage', () => {
  const renderPage = (genre: string) =>
    render(
      <MemoryRouter initialEntries={[`/rankings/${genre}`]}>
        <Routes>
          <Route path="/rankings/:genre" element={<YearSelectPage />} />
        </Routes>
      </MemoryRouter>,
    )

  it('邦楽のタイトルを表示する', () => {
    renderPage('jpop')
    expect(
      screen.getByRole('heading', { name: /邦楽 - 年を選択/i }),
    ).toBeInTheDocument()
  })

  it('洋楽のタイトルを表示する', () => {
    renderPage('western')
    expect(
      screen.getByRole('heading', { name: /洋楽 - 年を選択/i }),
    ).toBeInTheDocument()
  })

  it('年代別ボタンを表示する（6つ）', () => {
    renderPage('jpop')
    const decadeLabels = [
      '70年代後半',
      '80年代',
      '90年代',
      '00年代',
      '10年代',
      '20年代',
    ]
    for (const label of decadeLabels) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('年別ボタンを表示する（1975〜2025）', () => {
    renderPage('jpop')
    for (let year = 1975; year <= 2025; year++) {
      expect(
        screen.getByRole('link', { name: String(year) }),
      ).toBeInTheDocument()
    }
  })

  it('年代別ボタンのリンク先が正しい', () => {
    renderPage('jpop')
    const decadeLinks: Record<string, string> = {
      '70年代後半': '/rankings/jpop/decade/late1970s',
      '80年代': '/rankings/jpop/decade/1980s',
      '90年代': '/rankings/jpop/decade/1990s',
      '00年代': '/rankings/jpop/decade/2000s',
      '10年代': '/rankings/jpop/decade/2010s',
      '20年代': '/rankings/jpop/decade/2020s',
    }
    for (const [label, href] of Object.entries(decadeLinks)) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute(
        'href',
        href,
      )
    }
  })

  it('年別ボタンのリンク先が正しい', () => {
    renderPage('western')
    expect(screen.getByRole('link', { name: '2024' })).toHaveAttribute(
      'href',
      '/rankings/western/2024',
    )
    expect(screen.getByRole('link', { name: '1975' })).toHaveAttribute(
      'href',
      '/rankings/western/1975',
    )
  })
})
