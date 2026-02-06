import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import TermsPage from '../pages/TermsPage'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('TermsPage', () => {
  describe('ページタイトル', () => {
    it('利用規約のタイトルを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { level: 1, name: '利用規約' })).toBeInTheDocument()
    })
  })

  describe('利用条件', () => {
    it('利用条件セクションを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { name: /サービスの利用/ })).toBeInTheDocument()
    })
  })

  describe('禁止事項', () => {
    it('禁止事項セクションを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { name: /禁止事項/ })).toBeInTheDocument()
    })
  })

  describe('免責事項', () => {
    it('免責事項セクションを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { name: /免責事項/ })).toBeInTheDocument()
    })
  })

  describe('著作権', () => {
    it('著作権セクションを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { name: /著作権/ })).toBeInTheDocument()
    })
  })

  describe('規約の変更', () => {
    it('規約変更セクションを表示する', () => {
      renderWithRouter(<TermsPage />)

      expect(screen.getByRole('heading', { name: /規約の変更/ })).toBeInTheDocument()
    })
  })

  describe('ナビゲーション', () => {
    it('トップページへのリンクを表示する', () => {
      renderWithRouter(<TermsPage />)

      const homeLink = screen.getByRole('link', { name: /トップページ/ })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })
})
