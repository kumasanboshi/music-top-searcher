import { fetchRankingByYear, fetchRankingsByDecade } from '../services/rankingService'
import type { Ranking } from '../types'

const mockRanking: Ranking = {
  year: 2024,
  genre: 'jpop',
  entries: [
    {
      rank: 1,
      song: {
        id: 'jpop-2024-01',
        title: 'Test Song',
        artist: { id: 'a-test', name: 'Test Artist' },
        genre: 'jpop',
      },
    },
  ],
}

describe('rankingService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchRankingByYear', () => {
    it('正常にランキングデータを取得する', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockRanking), { status: 200 }),
      )

      const result = await fetchRankingByYear(2024, 'jpop')

      expect(fetch).toHaveBeenCalledWith('/data/rankings/2024-jpop.json')
      expect(result).toEqual(mockRanking)
    })

    it('404エラーの場合nullを返す', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      const result = await fetchRankingByYear(2024, 'jpop')

      expect(result).toBeNull()
    })

    it('ネットワークエラーの場合nullを返す', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

      const result = await fetchRankingByYear(2024, 'jpop')

      expect(result).toBeNull()
    })

    describe('100件制限', () => {
      const createMockEntries = (count: number) =>
        Array.from({ length: count }, (_, i) => ({
          rank: i + 1,
          song: {
            id: `s${i + 1}`,
            title: `Song ${i + 1}`,
            artist: { id: `a${i + 1}`, name: `Artist ${i + 1}` },
            genre: 'jpop' as const,
          },
        }))

      it('取得したランキングが100件を超える場合、100件に制限する', async () => {
        const mockRankingWith150 = {
          year: 2024,
          genre: 'jpop',
          entries: createMockEntries(150),
        }
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(JSON.stringify(mockRankingWith150), { status: 200 }),
        )

        const result = await fetchRankingByYear(2024, 'jpop')

        expect(result).not.toBeNull()
        expect(result!.entries).toHaveLength(100)
      })

      it('取得したランキングが100件以下の場合、そのまま返す', async () => {
        const mockRankingWith50 = {
          year: 2024,
          genre: 'jpop',
          entries: createMockEntries(50),
        }
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(JSON.stringify(mockRankingWith50), { status: 200 }),
        )

        const result = await fetchRankingByYear(2024, 'jpop')

        expect(result).not.toBeNull()
        expect(result!.entries).toHaveLength(50)
      })

      it('100件に制限する際、rank順（昇順）で先頭100件を取得する', async () => {
        // シャッフルされた150件のエントリを作成
        const shuffledEntries = createMockEntries(150).sort(() => Math.random() - 0.5)
        const mockRankingShuffled = {
          year: 2024,
          genre: 'jpop',
          entries: shuffledEntries,
        }
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(JSON.stringify(mockRankingShuffled), { status: 200 }),
        )

        const result = await fetchRankingByYear(2024, 'jpop')

        expect(result).not.toBeNull()
        expect(result!.entries).toHaveLength(100)
        // rank 1-100 のエントリのみが含まれていることを検証
        const ranks = result!.entries.map((e) => e.rank).sort((a, b) => a - b)
        expect(ranks[0]).toBe(1)
        expect(ranks[99]).toBe(100)
      })
    })
  })

  describe('fetchRankingsByDecade', () => {
    it('年代から正しい年範囲を取得する（1980s → 1980-1989）', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      await fetchRankingsByDecade('1980s', 'jpop')

      for (let year = 1980; year <= 1989; year++) {
        expect(fetch).toHaveBeenCalledWith(`/data/rankings/${year}-jpop.json`)
      }
    })

    it('late1970sの年範囲は1975-1979', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      await fetchRankingsByDecade('late1970s', 'jpop')

      for (let year = 1975; year <= 1979; year++) {
        expect(fetch).toHaveBeenCalledWith(`/data/rankings/${year}-jpop.json`)
      }
      expect(fetch).not.toHaveBeenCalledWith('/data/rankings/1974-jpop.json')
    })

    it('2020sの年範囲は2020-2025', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      await fetchRankingsByDecade('2020s', 'jpop')

      for (let year = 2020; year <= 2025; year++) {
        expect(fetch).toHaveBeenCalledWith(`/data/rankings/${year}-jpop.json`)
      }
    })

    it('複数年のデータを結合して返す', async () => {
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

      vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
        if (url === '/data/rankings/2020-jpop.json') {
          return Promise.resolve(
            new Response(JSON.stringify(ranking2020), { status: 200 }),
          )
        }
        if (url === '/data/rankings/2021-jpop.json') {
          return Promise.resolve(
            new Response(JSON.stringify(ranking2021), { status: 200 }),
          )
        }
        return Promise.resolve(new Response('Not Found', { status: 404 }))
      })

      const result = await fetchRankingsByDecade('2020s', 'jpop')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(ranking2020)
      expect(result[1]).toEqual(ranking2021)
    })

    it('データがない年はスキップする', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      const result = await fetchRankingsByDecade('1980s', 'jpop')

      expect(result).toHaveLength(0)
    })
  })
})
