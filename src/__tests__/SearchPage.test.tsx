import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import SearchPage from '../pages/SearchPage'
import * as searchService from '../services/searchService'
import type { RankingEntry } from '../types'

vi.mock('../services/searchService', async (importOriginal) => {
  const actual = await importOriginal<typeof searchService>()
  return {
    ...actual,
    fetchAllSongs: vi.fn(),
  }
})

const mockSongs: RankingEntry[] = [
  {
    rank: 1,
    song: {
      id: 'jpop-2024-01',
      title: 'Bling-Bang-Bang-Born',
      artist: { id: 'a-creepy-nuts', name: 'Creepy Nuts' },
      genre: 'jpop',
    },
  },
  {
    rank: 2,
    song: {
      id: 'jpop-2024-02',
      title: 'さよーならまたいつか！',
      artist: { id: 'a-yonezu', name: '米津玄師', nameEn: 'Kenshi Yonezu' },
      genre: 'jpop',
    },
  },
]

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/search']}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/songs/:genre/:songId" element={<div>Song Detail</div>} />
      </Routes>
    </MemoryRouter>,
  )

describe('SearchPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('検索入力欄が表示される', async () => {
    vi.mocked(searchService.fetchAllSongs).mockResolvedValue(mockSongs)

    renderPage()

    expect(
      await screen.findByPlaceholderText(/曲名・アーティスト名で検索/),
    ).toBeInTheDocument()
  })

  it('検索クエリ入力で結果が表示される', async () => {
    vi.mocked(searchService.fetchAllSongs).mockResolvedValue(mockSongs)

    renderPage()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })
    const input = await screen.findByPlaceholderText(
      /曲名・アーティスト名で検索/,
    )
    await user.type(input, 'Bling')
    await act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(await screen.findByText('Bling-Bang-Bang-Born')).toBeInTheDocument()
  })

  it('結果に曲名とアーティスト名が含まれる', async () => {
    vi.mocked(searchService.fetchAllSongs).mockResolvedValue(mockSongs)

    renderPage()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })
    const input = await screen.findByPlaceholderText(
      /曲名・アーティスト名で検索/,
    )
    await user.type(input, 'Bling')
    await act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(await screen.findByText('Bling-Bang-Bang-Born')).toBeInTheDocument()
    expect(screen.getByText('Creepy Nuts')).toBeInTheDocument()
  })

  it('結果から詳細ページへのリンクがある', async () => {
    vi.mocked(searchService.fetchAllSongs).mockResolvedValue(mockSongs)

    renderPage()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })
    const input = await screen.findByPlaceholderText(
      /曲名・アーティスト名で検索/,
    )
    await user.type(input, 'Bling')
    await act(() => {
      vi.advanceTimersByTime(300)
    })

    const link = await screen.findByRole('link', {
      name: /Bling-Bang-Bang-Born/,
    })
    expect(link).toHaveAttribute('href', '/songs/jpop/jpop-2024-01')
  })

  it('該当なしメッセージが表示される', async () => {
    vi.mocked(searchService.fetchAllSongs).mockResolvedValue(mockSongs)

    renderPage()

    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    })
    const input = await screen.findByPlaceholderText(
      /曲名・アーティスト名で検索/,
    )
    await user.type(input, 'zzzznotfound')
    await act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(
      await screen.findByText('該当する曲が見つかりませんでした'),
    ).toBeInTheDocument()
  })

  it('読み込み中の表示', () => {
    vi.mocked(searchService.fetchAllSongs).mockReturnValue(new Promise(() => {}))

    renderPage()

    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })
})
