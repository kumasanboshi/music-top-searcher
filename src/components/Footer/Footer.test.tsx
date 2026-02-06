import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Footer from './Footer'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Footer', () => {
  describe('著作権表示', () => {
    it('著作権表示テキストを表示する', () => {
      renderWithRouter(<Footer />)

      expect(screen.getByText(/© 2025 Music Top Searcher/)).toBeInTheDocument()
    })
  })

  describe('ページリンク', () => {
    it('Aboutリンクを表示する', () => {
      renderWithRouter(<Footer />)

      const aboutLink = screen.getByRole('link', { name: 'About' })
      expect(aboutLink).toBeInTheDocument()
      expect(aboutLink).toHaveAttribute('href', '/about')
    })

    it('プライバシーポリシーリンクを表示する', () => {
      renderWithRouter(<Footer />)

      const privacyLink = screen.getByRole('link', { name: 'プライバシーポリシー' })
      expect(privacyLink).toBeInTheDocument()
      expect(privacyLink).toHaveAttribute('href', '/privacy')
    })

    it('利用規約リンクを表示する', () => {
      renderWithRouter(<Footer />)

      const termsLink = screen.getByRole('link', { name: '利用規約' })
      expect(termsLink).toBeInTheDocument()
      expect(termsLink).toHaveAttribute('href', '/terms')
    })

    it('お問い合わせリンクを表示する', () => {
      renderWithRouter(<Footer />)

      const contactLink = screen.getByRole('link', { name: 'お問い合わせ' })
      expect(contactLink).toBeInTheDocument()
      expect(contactLink).toHaveAttribute('href', '/contact')
    })
  })

  describe('アクセシビリティ', () => {
    it('contentinfo roleを持つfooter要素が存在する', () => {
      renderWithRouter(<Footer />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('ナビゲーションリンクがnav要素でラップされている', () => {
      renderWithRouter(<Footer />)

      const nav = screen.getByRole('navigation', { name: 'フッターナビゲーション' })
      expect(nav).toBeInTheDocument()
    })
  })

  describe('カスタムスタイル', () => {
    it('className propを適用できる', () => {
      renderWithRouter(<Footer className="custom-class" />)

      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('custom-class')
    })
  })
})
