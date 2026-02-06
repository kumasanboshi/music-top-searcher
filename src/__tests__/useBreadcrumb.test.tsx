import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import type { ReactNode } from 'react'

function createWrapper(initialEntries: string[]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    )
  }
}

describe('useBreadcrumb', () => {
  describe('トップページ（/）', () => {
    it('空の配列を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/']),
      })
      expect(result.current).toEqual([])
    })
  })

  describe('ジャンル選択ページ（/rankings/:genre）', () => {
    it('/rankings/jpop で [トップ, 邦楽] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '邦楽' },
      ])
    })

    it('/rankings/western で [トップ, 洋楽] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/western']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '洋楽' },
      ])
    })
  })

  describe('年別ランキングページ（/rankings/:genre/:year）', () => {
    it('/rankings/jpop/1990 で [トップ, 邦楽, 1990年] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop/1990']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年' },
      ])
    })

    it('/rankings/western/2000 で [トップ, 洋楽, 2000年] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/western/2000']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '洋楽', path: '/rankings/western' },
        { label: '2000年' },
      ])
    })
  })

  describe('年代別ランキングページ（/rankings/:genre/decade/:decade）', () => {
    it('/rankings/jpop/decade/1990s で [トップ, 邦楽, 1990年代] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop/decade/1990s']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '1990年代' },
      ])
    })

    it('/rankings/western/decade/late1970s で [トップ, 洋楽, 70年代後半] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/western/decade/late1970s']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '洋楽', path: '/rankings/western' },
        { label: '70年代後半' },
      ])
    })

    it('/rankings/jpop/decade/2000s で [トップ, 邦楽, 2000年代] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop/decade/2000s']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: '2000年代' },
      ])
    })
  })

  describe('曲詳細ページ（/songs/:genre/:songId）', () => {
    it('songTitleオプションが指定された場合、[トップ, ジャンル, 曲名] を返す', () => {
      const { result } = renderHook(
        () => useBreadcrumb({ songTitle: 'テスト曲' }),
        {
          wrapper: createWrapper(['/songs/jpop/song-1']),
        }
      )
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '邦楽', path: '/rankings/jpop' },
        { label: 'テスト曲' },
      ])
    })

    it('songTitleが未指定の場合、[トップ, ジャンル] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/songs/western/song-2']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '洋楽' },
      ])
    })
  })

  describe('検索ページ（/search）', () => {
    it('[トップ, 検索] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/search']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '検索' },
      ])
    })
  })

  describe('Aboutページ（/about）', () => {
    it('[トップ, About] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/about']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: 'About' },
      ])
    })
  })

  describe('プライバシーポリシーページ（/privacy）', () => {
    it('[トップ, プライバシーポリシー] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/privacy']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: 'プライバシーポリシー' },
      ])
    })
  })

  describe('利用規約ページ（/terms）', () => {
    it('[トップ, 利用規約] を返す', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/terms']),
      })
      expect(result.current).toEqual([
        { label: 'トップ', path: '/' },
        { label: '利用規約' },
      ])
    })
  })

  describe('パス生成', () => {
    it('最後の項目以外にpath属性を設定する', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop/1990']),
      })
      expect(result.current[0].path).toBe('/')
      expect(result.current[1].path).toBe('/rankings/jpop')
      expect(result.current[2].path).toBeUndefined()
    })

    it('トップのpathは "/"', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/search']),
      })
      expect(result.current[0].path).toBe('/')
    })

    it('ジャンルのpathは "/rankings/:genre"', () => {
      const { result } = renderHook(() => useBreadcrumb(), {
        wrapper: createWrapper(['/rankings/jpop/2000']),
      })
      expect(result.current[1].path).toBe('/rankings/jpop')
    })
  })
})
