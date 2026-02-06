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
        await screen.findByRole('heading', { name: /邦楽 TOP100/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('2024')).toBeInTheDocument()
    })

    it('洋楽のタイトルを表示する', async () => {
      vi.mocked(rankingService.fetchRankingByYear).mockResolvedValue({
        ...mockRanking,
        genre: 'western',
      })

      renderYearPage('western', '2024')

      expect(
        await screen.findByRole('heading', { name: /洋楽 TOP100/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('2024')).toBeInTheDocument()
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

      expect(screen.getByText('ランキングを読み込み中...')).toBeInTheDocument()
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
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue({
        year: 0,
        genre: 'jpop',
        entries: mockRanking.entries.map((e) => ({ ...e, year: 2024 })),
      })

      renderDecadePage('jpop', '2020s')

      expect(
        await screen.findByRole('heading', { name: /邦楽 TOP100/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('2020s')).toBeInTheDocument()
    })

    it('総合ランキング100曲を表示する', async () => {
      // 年代別総合ランキングは、各年のポイントを集計した上位100曲
      const decadeRanking: Ranking = {
        year: 0,
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
            year: 2020,
          },
          {
            rank: 2,
            song: {
              id: 's2',
              title: 'Song B',
              artist: { id: 'a2', name: 'Artist B' },
              genre: 'jpop',
            },
            year: 2021,
          },
        ] as (typeof mockRanking.entries[0] & { year: number })[],
      }
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue(
        decadeRanking,
      )

      renderDecadePage('jpop', '2020s')

      await screen.findByText('Song A')

      // 各エントリに年情報が表示されることを検証
      expect(screen.getByText('Song A')).toBeInTheDocument()
      expect(screen.getByText('Song B')).toBeInTheDocument()
      expect(screen.getByText('2020')).toBeInTheDocument()
      expect(screen.getByText('2021')).toBeInTheDocument()
    })

    it('データがない場合メッセージを表示する', async () => {
      vi.mocked(rankingService.fetchRankingsByDecade).mockResolvedValue(null)

      renderDecadePage('jpop', '2020s')

      expect(
        await screen.findByText('ランキングデータが見つかりませんでした'),
      ).toBeInTheDocument()
    })
  })
})
