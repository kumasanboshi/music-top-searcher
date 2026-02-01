import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RankingListPage from '../pages/RankingListPage'
import * as rankingService from '../services/rankingService'
import type { Ranking } from '../types'

vi.mock('../services/rankingService')

const mockRanking: Ranking = {
  year: 2024,
  genre: 'jpop',
  entries: [
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
        artist: { id: 'a-yonezu', name: '米津玄師' },
        genre: 'jpop',
      },
    },
  ],
}

const renderYearPage = (genre: string, year: string) =>
  render(
    <MemoryRouter initialEntries={[`/rankings/${genre}/${year}`]}>
      <Routes>
        <Route path="/rankings/:genre/:year" element={<RankingListPage />} />
      </Routes>
    </MemoryRouter>,
  )

const renderDecadePage = (genre: string, decade: string) =>
  render(
    <MemoryRouter initialEntries={[`/rankings/${genre}/decade/${decade}`]}>
      <Routes>
        <Route
          path="/rankings/:genre/decade/:decade"
          element={<RankingListPage />}
        />
      </Routes>
    </MemoryRouter>,
  )

describe('RankingListPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('年別ランキング', () => {
    it('邦楽のタイトルを表示する', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue(mockRanking)

      renderYearPage('jpop', '2024')

      expect(
        await screen.findByRole('heading', { name: /邦楽 TOP100 2024/i }),
      ).toBeInTheDocument()
    })

    it('洋楽のタイトルを表示する', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue({
        ...mockRanking,
        genre: 'western',
      })

      renderYearPage('western', '2024')

      expect(
        await screen.findByRole('heading', { name: /洋楽 TOP100 2024/i }),
      ).toBeInTheDocument()
    })

    it('ランキングエントリを表示する', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue(mockRanking)

      renderYearPage('jpop', '2024')

      expect(await screen.findByText('1')).toBeInTheDocument()
      expect(screen.getByText('Bling-Bang-Bang-Born')).toBeInTheDocument()
      expect(screen.getByText('Creepy Nuts')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('さよーならまたいつか！')).toBeInTheDocument()
      expect(screen.getByText('米津玄師')).toBeInTheDocument()
    })

    it('各曲のリンク先が正しい', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue(mockRanking)

      renderYearPage('jpop', '2024')

      const link1 = await screen.findByRole('link', {
        name: /Bling-Bang-Bang-Born/,
      })
      expect(link1).toHaveAttribute('href', '/songs/jpop/jpop-2024-01')

      const link2 = screen.getByRole('link', { name: /さよーならまたいつか！/ })
      expect(link2).toHaveAttribute('href', '/songs/jpop/jpop-2024-02')
    })

    it('ローディング中を表示する', () => {
      vi.mocked(rankingService.fetchRankingByYear).mockReturnValue(
        new Promise(() => {}),
      )

      renderYearPage('jpop', '2024')

      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    })

    it('エラー時にメッセージを表示する', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue(null)

      renderYearPage('jpop', '2024')

      expect(
        await screen.findByText('ランキングデータが見つかりませんでした'),
      ).toBeInTheDocument()
    })
  })

  describe('年代別ランキング', () => {
    it('年代別タイトルを表示する', async () => {
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue([
        mockRanking,
      ])

      renderDecadePage('jpop', '2020s')

      expect(
        await screen.findByRole('heading', { name: /邦楽 TOP100 2020s/i }),
      ).toBeInTheDocument()
    })

    it('複数年のデータを統合リストで表示する', async () => {
      const ranking2020: Ranking = {
        year: 2020,
        genre: 'jpop',
        entries: [
          {
            rank: 1,
            song: {
              id: 's1',
              title: 'Song A',
              artist: { id: 'a1', name: 'Artist A' },
              genre: 'jpop',
            },
          },
        ],
      }
      const ranking2021: Ranking = {
        year: 2021,
        genre: 'jpop',
        entries: [
          {
            rank: 1,
            song: {
              id: 's2',
              title: 'Song B',
              artist: { id: 'a2', name: 'Artist B' },
              genre: 'jpop',
            },
          },
        ],
      }
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue([
        ranking2020,
        ranking2021,
      ])

      renderDecadePage('jpop', '2020s')

      await screen.findByText('Song A')

      // 年見出し（h2）が表示されないことを検証
      const headings = screen.getAllByRole('heading')
      const yearHeadings = headings.filter(
        (h) => h.textContent === '2020' || h.textContent === '2021',
      )
      expect(yearHeadings).toHaveLength(0)

      // 統合リストが1つだけであることを検証
      const lists = document.querySelectorAll('ol')
      expect(lists).toHaveLength(1)

      // 各エントリに年情報が表示されることを検証
      expect(screen.getByText('Song A')).toBeInTheDocument()
      expect(screen.getByText('Song B')).toBeInTheDocument()
      expect(screen.getByText('2020')).toBeInTheDocument()
      expect(screen.getByText('2021')).toBeInTheDocument()
    })

    it('データがない場合メッセージを表示する', async () => {
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue([])

      renderDecadePage('jpop', '2020s')

      expect(
        await screen.findByText('ランキングデータが見つかりませんでした'),
      ).toBeInTheDocument()
    })
  })
})
