import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import SongDetailPage from '../pages/SongDetailPage'
import * as songService from '../services/songService'
import * as useOnlineStatusModule from '../hooks/useOnlineStatus'
import type { SongDetail } from '../types'

vi.mock('../services/songService')
vi.mock('../hooks/useOnlineStatus')

const mockSongDetail: SongDetail = {
  song: {
    id: 'jpop-2024-01',
    title: 'Bling-Bang-Bang-Born',
    artist: { id: 'a-creepy-nuts', name: 'Creepy Nuts' },
    genre: 'jpop',
  },
  rankingYear: 2024,
  rank: 1,
  cdInfo: [],
  externalLinks: {
    amazonMusic: 'https://music.amazon.co.jp/example',
    amazonCD: 'https://amazon.co.jp/dp/example',
    appleMusic: 'https://music.apple.com/example',
  },
  artistSongs: [],
}

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/songs/jpop/jpop-2024-01']}>
      <Routes>
        <Route path="/songs/:genre/:songId" element={<SongDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )

describe('SongDetailPage オフライン対応', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(songService.fetchSongDetail).mockResolvedValue(mockSongDetail)
  })

  it('オフライン時に外部リンクセクションを表示しない', async () => {
    vi.mocked(useOnlineStatusModule.useOnlineStatus).mockReturnValue(false)

    renderPage()

    await screen.findByRole('heading', { level: 1, name: 'Bling-Bang-Bang-Born' })
    expect(screen.queryByText('外部リンク')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Amazon Music' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Apple Music/ })).not.toBeInTheDocument()
  })

  it('オンライン時に外部リンクセクションを表示する', async () => {
    vi.mocked(useOnlineStatusModule.useOnlineStatus).mockReturnValue(true)

    renderPage()

    expect(await screen.findByText('外部リンク')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Amazon Music' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Apple Music/ })).toBeInTheDocument()
    // Amazon CDは外部リンクセクションから削除され、CD情報セクションに移動
  })
})
