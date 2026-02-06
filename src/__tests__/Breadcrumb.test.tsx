import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import type { BreadcrumbItem } from '../types'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Breadcrumb', () => {
  describe('レンダリング', () => {
    it('パンくずアイテムを正しく表示する', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByText('トップ')).toBeInTheDocument()
      expect(screen.getByText('邦楽')).toBeInTheDocument()
      expect(screen.getByText('1990年')).toBeInTheDocument()
    })

    it('空の配列の場合は何も表示しない', () => {
      const { container } = renderWithRouter(<Breadcrumb items={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('1件のみの場合も正しく表示する', () => {
      const items: BreadcrumbItem[] = [{ label: 'トップ' }]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByText('トップ')).toBeInTheDocument()
    })
  })

  describe('リンク', () => {
    it('最後の項目以外はリンクとして表示する', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
    })

    it('最後の項目はテキストとして表示する（リンクなし）', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '1990年' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.queryByRole('link', { name: '1990年' })).not.toBeInTheDocument()
      expect(screen.getByText('1990年')).toBeInTheDocument()
    })

    it('各リンクが正しいhref属性を持つ', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByRole('link', { name: 'トップ' })).toHaveAttribute(
        'href',
        '/'
      )
      expect(screen.getByRole('link', { name: '邦楽' })).toHaveAttribute(
        'href',
        '/rankings/jpop'
      )
    })
  })

  describe('セパレータ', () => {
    it('項目間にセパレータ（>）を表示する', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      const separators = screen.getAllByText('>')
      expect(separators).toHaveLength(2)
    })

    it('最後の項目の後にはセパレータを表示しない', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      const separators = screen.getAllByText('>')
      expect(separators).toHaveLength(1)
    })
  })

  describe('アクセシビリティ', () => {
    it('nav要素にaria-label="パンくずリスト"を持つ', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'パンくずリスト'
      )
    })

    it('現在地の項目にaria-current="page"を持つ', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByText('検索')).toHaveAttribute('aria-current', 'page')
    })

    it('ol要素でリストをマークアップする', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      renderWithRouter(<Breadcrumb items={items} />)

      expect(screen.getByRole('list')).toBeInTheDocument()
      expect(screen.getAllByRole('listitem')).toHaveLength(2)
    })
  })

  describe('JSON-LD構造化データ', () => {
    it('JSON-LDスクリプトタグを出力する', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      const { container } = renderWithRouter(<Breadcrumb items={items} />)

      const script = container.querySelector('script[type="application/ld+json"]')
      expect(script).toBeInTheDocument()
    })

    it('includeJsonLd=falseの場合はJSON-LDを出力しない', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      const { container } = renderWithRouter(
        <Breadcrumb items={items} includeJsonLd={false} />
      )

      const script = container.querySelector('script[type="application/ld+json"]')
      expect(script).not.toBeInTheDocument()
    })

    it('BreadcrumbList形式の構造化データを出力する', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      const { container } = renderWithRouter(<Breadcrumb items={items} />)

      const script = container.querySelector('script[type="application/ld+json"]')
      const jsonLd = JSON.parse(script?.textContent || '{}')

      expect(jsonLd['@context']).toBe('https://schema.org')
      expect(jsonLd['@type']).toBe('BreadcrumbList')
    })

    it('各itemListElementに正しいposition, name, itemを含む', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ]
      const { container } = renderWithRouter(<Breadcrumb items={items} />)

      const script = container.querySelector('script[type="application/ld+json"]')
      const jsonLd = JSON.parse(script?.textContent || '{}')

      expect(jsonLd.itemListElement).toHaveLength(3)
      expect(jsonLd.itemListElement[0]).toMatchObject({
        '@type': 'ListItem',
        position: 1,
        name: 'トップ',
      })
      expect(jsonLd.itemListElement[0].item).toContain('/')
      expect(jsonLd.itemListElement[1]).toMatchObject({
        '@type': 'ListItem',
        position: 2,
        name: '邦楽',
      })
      expect(jsonLd.itemListElement[1].item).toContain('/rankings/jpop')
      expect(jsonLd.itemListElement[2]).toMatchObject({
        '@type': 'ListItem',
        position: 3,
        name: '1990年',
      })
      // 最後の項目にも現在のパスでitem URLが設定される
      expect(jsonLd.itemListElement[2].item).toBeDefined()
    })
  })

  describe('スタイリング', () => {
    it('カスタムclassNameを適用できる', () => {
      const items: BreadcrumbItem[] = [
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ]
      renderWithRouter(<Breadcrumb items={items} className="custom-class" />)

      expect(screen.getByRole('navigation')).toHaveClass('custom-class')
    })
  })
})
