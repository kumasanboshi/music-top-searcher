import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AboutPage from '../pages/AboutPage'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('AboutPage', () => {
  describe('ページタイトル', () => {
    it('Aboutページのタイトルを表示する', () => {
      renderWithRouter(<AboutPage />)

      expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
    })
  })

  describe('サイト概要', () => {
    it('サイトの目的を説明するセクションを表示する', () => {
      renderWithRouter(<AboutPage />)

      expect(screen.getByText(/Music Top Searcher/)).toBeInTheDocument()
      expect(screen.getByText(/ヒット曲ランキング/)).toBeInTheDocument()
    })
  })

  describe('データソース説明', () => {
    it('ランキングデータの出典を説明する', () => {
      renderWithRouter(<AboutPage />)

      expect(screen.getByRole('heading', { name: /データについて/ })).toBeInTheDocument()
    })
  })

  describe('免責事項', () => {
    it('免責事項セクションを表示する', () => {
      renderWithRouter(<AboutPage />)

      expect(screen.getByRole('heading', { name: /免責事項/ })).toBeInTheDocument()
    })
  })

  describe('ナビゲーション', () => {
    it('トップページへのリンクを表示する', () => {
      renderWithRouter(<AboutPage />)

      const homeLink = screen.getByRole('link', { name: /トップページ/ })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })
})
