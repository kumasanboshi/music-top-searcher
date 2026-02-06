import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('PrivacyPolicyPage', () => {
  describe('ページタイトル', () => {
    it('プライバシーポリシーのタイトルを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      expect(
        screen.getByRole('heading', { level: 1, name: 'プライバシーポリシー' })
      ).toBeInTheDocument()
    })
  })

  describe('収集する情報', () => {
    it('収集する情報セクションを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      expect(screen.getByRole('heading', { name: /収集する情報/ })).toBeInTheDocument()
      expect(screen.getByText(/Cookie情報/)).toBeInTheDocument()
    })
  })

  describe('情報の利用目的', () => {
    it('利用目的セクションを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      expect(screen.getByRole('heading', { name: /情報の利用目的/ })).toBeInTheDocument()
    })
  })

  describe('第三者への提供', () => {
    it('第三者提供セクションを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      expect(screen.getByRole('heading', { name: /第三者への提供/ })).toBeInTheDocument()
      expect(screen.getAllByText(/広告配信事業者/).length).toBeGreaterThan(0)
    })
  })

  describe('お問い合わせ', () => {
    it('お問い合わせセクションを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      expect(screen.getByRole('heading', { name: /お問い合わせ/ })).toBeInTheDocument()
    })
  })

  describe('ナビゲーション', () => {
    it('トップページへのリンクを表示する', () => {
      renderWithRouter(<PrivacyPolicyPage />)

      const homeLink = screen.getByRole('link', { name: /トップページ/ })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })
})
