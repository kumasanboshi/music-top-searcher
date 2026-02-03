import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import SongDetailPage from '../pages/SongDetailPage'
import * as songService from '../services/songService'
import type { SongDetail } from '../types'

vi.mock('../services/songService')

const mockSongDetail: SongDetail = {
  song: {
    id: 'jpop-2024-01',
    title: 'Bling-Bang-Bang-Born',
    artist: { id: 'a-creepy-nuts', name: 'Creepy Nuts' },
    genre: 'jpop',
  },
  rankingYear: 2024,
  rank: 1,
  cdInfo: [
    { title: 'Bling-Bang-Bang-Born', type: 'single', releaseDate: '2024-01-07' },
    { title: 'Creepy Nuts Best Album', type: 'album', releaseDate: '2024-03-15' },
  ],
  externalLinks: {
    amazonMusic: 'https://music.amazon.co.jp/example',
    amazonCD: 'https://amazon.co.jp/dp/example',
    appleMusic: 'https://music.apple.com/example',
  },
  artistSongs: [
    {
      rank: 5,
      song: {
        id: 'jpop-2024-05',
        title: '二度寝',
        artist: { id: 'a-creepy-nuts', name: 'Creepy Nuts' },
        genre: 'jpop',
      },
      year: 2024,
    },
  ],
}

const renderPage = (genre: string, songId: string) =>
  render(
    <MemoryRouter initialEntries={[`/songs/${genre}/${songId}`]}>
      <Routes>
        <Route path="/songs/:genre/:songId" element={<SongDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('SongDetailPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('曲名とアーティスト名を表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Bling-Bang-Bang-Born' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Creepy Nuts')).toBeInTheDocument()
  })

  it('ランキング順位と年を表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    // The ranking badge displays year and rank in separate spans
    // Use findAllByText since "2024年" appears in both hero and artist songs
    const yearElements = await screen.findAllByText('2024年')
    expect(yearElements.length).toBeGreaterThan(0)
    expect(screen.getByText('1位')).toBeInTheDocument()
  })

  it('CD情報を表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    expect(await screen.findByText('CD情報')).toBeInTheDocument()
    expect(screen.getByText(/シングル/)).toBeInTheDocument()
    expect(screen.getByText(/2024-01-07/)).toBeInTheDocument()
  })

  it('アルバム情報を表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    expect(await screen.findByText('CD情報')).toBeInTheDocument()
    expect(screen.getByText(/アルバム/)).toBeInTheDocument()
    expect(screen.getByText(/Creepy Nuts Best Album/)).toBeInTheDocument()
    expect(screen.getByText(/2024-03-15/)).toBeInTheDocument()
  })

  it('Amazon Musicリンクを表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    const link = await screen.findByRole('link', { name: 'Amazon Music' })
    expect(link).toHaveAttribute('href', 'https://music.amazon.co.jp/example')
  })

  it('Amazon CDリンクを表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    const link = await screen.findByRole('link', { name: 'Amazon CD' })
    expect(link).toHaveAttribute('href', 'https://amazon.co.jp/dp/example')
  })

  it('Apple Musicリンクを表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    const link = await screen.findByRole('link', { name: /Apple Music/ })
    expect(link).toHaveAttribute('href', 'https://music.apple.com/example')
  })

  it('同アーティストの他のランクイン曲を表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    expect(await screen.findByText('二度寝')).toBeInTheDocument()
  })

  it('外部リンクがない場合はリンクセクションを表示しない', async () => {
    const noLinks = { ...mockSongDetail, externalLinks: undefined }
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(noLinks)

    renderPage('jpop', 'jpop-2024-01')

    await screen.findByRole('heading', { level: 1, name: 'Bling-Bang-Bang-Born' })
    expect(screen.queryByRole('link', { name: 'Amazon Music' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amazon CD' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Apple Music/ })).not.toBeInTheDocument()
  })

  it('CD情報がない場合はCDセクションを表示しない', async () => {
    const noCd = { ...mockSongDetail, cdInfo: undefined }
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(noCd)

    renderPage('jpop', 'jpop-2024-01')

    await screen.findByRole('heading', { level: 1, name: 'Bling-Bang-Bang-Born' })
    expect(screen.queryByText(/シングル/)).not.toBeInTheDocument()
  })

  it('ローディング中を表示する', () => {
    vi.mocked(songService.fetchSongDetail).mockReturnValue(new Promise(() => {}))

    renderPage('jpop', 'jpop-2024-01')

    expect(screen.getByText('曲情報を読み込み中...')).toBeInTheDocument()
  })

  it('YouTube検索リンクを表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)

    renderPage('jpop', 'jpop-2024-01')

    const link = await screen.findByRole('link', { name: /YouTube/ })
    expect(link).toHaveAttribute(
      'href',
      'https://www.youtube.com/results?search_query=Creepy%20Nuts%20Bling-Bang-Bang-Born',
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('外部リンクがない場合でもYouTube検索リンクは表示される', async () => {
    const noLinks = { ...mockSongDetail, externalLinks: undefined }
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(noLinks)

    renderPage('jpop', 'jpop-2024-01')

    const link = await screen.findByRole('link', { name: /YouTube/ })
    expect(link).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amazon Music' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amazon CD' })).not.toBeInTheDocument()
  })

  it('エラー時にメッセージを表示する', async () => {
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(null)

    renderPage('jpop', 'jpop-2024-01')

    expect(
      await screen.findByText('曲の詳細データが見つかりませんでした'),
    ).toBeInTheDocument()
  })
})
