import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NotFoundPage from '../pages/NotFoundPage'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('NotFoundPage', () => {
  describe('エラーメッセージ', () => {
    it('404エラーコードを表示する', () => {
      renderWithRouter(<NotFoundPage />)

      expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('ページが見つからないメッセージを表示する', () => {
      renderWithRouter(<NotFoundPage />)

      expect(screen.getByText(/ページが見つかりません/)).toBeInTheDocument()
    })

    it('ユーザーフレンドリーな説明を表示する', () => {
      renderWithRouter(<NotFoundPage />)

      expect(screen.getByText(/お探しのページは存在しない/)).toBeInTheDocument()
    })
  })

  describe('ナビゲーション', () => {
    it('トップページへのリンクを表示する', () => {
      renderWithRouter(<NotFoundPage />)

      const homeLink = screen.getByRole('link', { name: /トップページ/ })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('検索ページへのリンクを表示する', () => {
      renderWithRouter(<NotFoundPage />)

      const searchLink = screen.getByRole('link', { name: /検索/ })
      expect(searchLink).toBeInTheDocument()
      expect(searchLink).toHaveAttribute('href', '/search')
    })
  })
})
