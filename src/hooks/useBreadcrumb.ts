import { useLocation, useParams } from 'react-router-dom'
import type { BreadcrumbItem } from '../types'

interface UseBreadcrumbOptions {
  songTitle?: string
}

const GENRE_LABELS: Record<string, string> = {
  jpop: '邦楽',
  western: '洋楽',
}

const DECADE_LABELS: Record<string, string> = {
  late1970s: '70年代後半',
  '1980s': '1980年代',
  '1990s': '1990年代',
  '2000s': '2000年代',
  '2010s': '2010年代',
  '2020s': '2020年代',
}

export function useBreadcrumb(options?: UseBreadcrumbOptions): BreadcrumbItem[] {
  const location = useLocation()
  const params = useParams<{
    genre?: string
    year?: string
    decade?: string
    songId?: string
  }>()
  const { pathname } = location

  // トップページの場合は空配列
  if (pathname === '/') {
    return []
  }

  const items: BreadcrumbItem[] = [{ label: 'トップ', path: '/' }]

  // 検索ページ
  if (pathname === '/search') {
    items.push({ label: '検索' })
    return items
  }

  // Aboutページ
  if (pathname === '/about') {
    items.push({ label: 'About' })
    return items
  }

  // プライバシーポリシーページ
  if (pathname === '/privacy') {
    items.push({ label: 'プライバシーポリシー' })
    return items
  }

  // 利用規約ページ
  if (pathname === '/terms') {
    items.push({ label: '利用規約' })
    return items
  }

  // ジャンルが必要なページ
  const { genre, year, decade, songId } = params

  if (genre) {
    const genreLabel = GENRE_LABELS[genre] || genre

    // 曲詳細ページ
    if (songId) {
      if (options?.songTitle) {
        items.push({ label: genreLabel, path: `/rankings/${genre}` })
        items.push({ label: options.songTitle })
      } else {
        items.push({ label: genreLabel })
      }
      return items
    }

    // 年代別ランキングページ
    if (decade) {
      items.push({ label: genreLabel, path: `/rankings/${genre}` })
      const decadeLabel = DECADE_LABELS[decade] || decade
      items.push({ label: decadeLabel })
      return items
    }

    // 年別ランキングページ
    if (year) {
      items.push({ label: genreLabel, path: `/rankings/${genre}` })
      items.push({ label: `${year}年` })
      return items
    }

    // ジャンル選択ページ
    items.push({ label: genreLabel })
    return items
  }

  return items
}
