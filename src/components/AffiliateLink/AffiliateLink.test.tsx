import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AffiliateLink from './AffiliateLink'

vi.mock('../../config/affiliate', () => ({
  addAmazonAffiliateTag: (url: string) => (url ? `${url}?tag=mock-22` : ''),
  addAppleMusicAffiliateToken: (url: string) => (url ? `${url}?at=mocktoken` : ''),
  affiliateConfig: {
    amazon: { associateTag: 'mock-22', enabled: true },
    appleMusic: { affiliateToken: 'mocktoken', campaignToken: '', enabled: true },
  },
}))

describe('AffiliateLink', () => {
  describe('Amazon Music', () => {
    it('Amazon Musicリンクを正しく表示する', () => {
      render(
        <AffiliateLink service="amazon-music" url="https://music.amazon.co.jp/albums/123">
          Amazon Music
        </AffiliateLink>
      )

      const link = screen.getByRole('link', { name: /Amazon Music/i })
      expect(link).toBeInTheDocument()
    })

    it('URLにアフィリエイトタグが付与される', () => {
      render(
        <AffiliateLink service="amazon-music" url="https://music.amazon.co.jp/albums/123">
          Amazon Music
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://music.amazon.co.jp/albums/123?tag=mock-22')
    })
  })

  describe('Amazon CD', () => {
    it('Amazon CDリンクを正しく表示する', () => {
      render(
        <AffiliateLink service="amazon-cd" url="https://www.amazon.co.jp/dp/B001234567">
          Amazon CD
        </AffiliateLink>
      )

      const link = screen.getByRole('link', { name: /Amazon CD/i })
      expect(link).toBeInTheDocument()
    })

    it('URLにアフィリエイトタグが付与される', () => {
      render(
        <AffiliateLink service="amazon-cd" url="https://www.amazon.co.jp/dp/B001234567">
          Amazon CD
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://www.amazon.co.jp/dp/B001234567?tag=mock-22')
    })
  })

  describe('Apple Music', () => {
    it('Apple Musicリンクを正しく表示する', () => {
      render(
        <AffiliateLink service="apple-music" url="https://music.apple.com/jp/album/123">
          Apple Music
        </AffiliateLink>
      )

      const link = screen.getByRole('link', { name: /Apple Music/i })
      expect(link).toBeInTheDocument()
    })

    it('URLにアフィリエイトトークンが付与される', () => {
      render(
        <AffiliateLink service="apple-music" url="https://music.apple.com/jp/album/123">
          Apple Music
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', 'https://music.apple.com/jp/album/123?at=mocktoken')
    })
  })

  describe('共通の動作', () => {
    it('rel属性に"noopener noreferrer sponsored"が設定される', () => {
      render(
        <AffiliateLink service="amazon-music" url="https://music.amazon.co.jp/albums/123">
          Link
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer sponsored')
    })

    it('target="_blank"が設定される', () => {
      render(
        <AffiliateLink service="amazon-music" url="https://music.amazon.co.jp/albums/123">
          Link
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('childrenがある場合はそれを表示する', () => {
      render(
        <AffiliateLink service="amazon-music" url="https://music.amazon.co.jp/albums/123">
          カスタムテキスト
        </AffiliateLink>
      )

      expect(screen.getByText('カスタムテキスト')).toBeInTheDocument()
    })

    it('カスタムclassNameを適用できる', () => {
      render(
        <AffiliateLink
          service="amazon-music"
          url="https://music.amazon.co.jp/albums/123"
          className="custom-class"
        >
          Link
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('custom-class')
    })

    it('URLがない場合は検索リンクを生成する（Amazon）', () => {
      render(
        <AffiliateLink
          service="amazon-music"
          url=""
          songTitle="テスト曲"
          artistName="テストアーティスト"
        >
          検索
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toContain('amazon.co.jp')
      expect(link.getAttribute('href')).toContain(encodeURIComponent('テストアーティスト テスト曲'))
    })

    it('URLがない場合は検索リンクを生成する（Apple Music）', () => {
      render(
        <AffiliateLink
          service="apple-music"
          url=""
          songTitle="テスト曲"
          artistName="テストアーティスト"
        >
          検索
        </AffiliateLink>
      )

      const link = screen.getByRole('link')
      expect(link.getAttribute('href')).toContain('music.apple.com')
      expect(link.getAttribute('href')).toContain(encodeURIComponent('テストアーティスト テスト曲'))
    })
  })
})
