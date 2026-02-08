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

    describe('10件制限', () => {
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

      it('取得したランキングが10件を超える場合、10件に制限する', async () => {
        const mockRankingWith15 = {
          year: 2024,
          genre: 'jpop',
          entries: createMockEntries(15),
        }
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(JSON.stringify(mockRankingWith15), { status: 200 }),
        )

        const result = await fetchRankingByYear(2024, 'jpop')

        expect(result).not.toBeNull()
        expect(result!.entries).toHaveLength(10)
      })

      it('取得したランキングが10件以下の場合、そのまま返す', async () => {
        const mockRankingWith5 = {
          year: 2024,
          genre: 'jpop',
          entries: createMockEntries(5),
        }
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
          new Response(JSON.stringify(mockRankingWith5), { status: 200 }),
        )

        const result = await fetchRankingByYear(2024, 'jpop')

        expect(result).not.toBeNull()
        expect(result!.entries).toHaveLength(5)
      })

      it('10件に制限する際、rank順（昇順）で先頭10件を取得する', async () => {
        // シャッフルされた15件のエントリを作成
        const shuffledEntries = createMockEntries(15).sort(() => Math.random() - 0.5)
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
        expect(result!.entries).toHaveLength(10)
        // rank 1-10 のエントリのみが含まれていることを検証
        const ranks = result!.entries.map((e) => e.rank).sort((a, b) => a - b)
        expect(ranks[0]).toBe(1)
        expect(ranks[9]).toBe(10)
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

    it('複数年のデータを集約して総合ランキングを返す', async () => {
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
          {
            rank: 2,
            song: {
              id: 's3',
              title: 'Song C',
              artist: { id: 'a3', name: 'Artist C' },
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

      expect(result).not.toBeNull()
      // 各エントリにyearが含まれる
      expect(result!.entries[0]).toHaveProperty('year')
      // ポイント順でソート（1位=100pt, 2位=99pt）
      // Song A: 100pt, Song B: 100pt, Song C: 99pt
      expect(result!.entries).toHaveLength(3)
      expect(result!.entries[0].rank).toBe(1)
      expect(result!.entries[1].rank).toBe(2)
      expect(result!.entries[2].rank).toBe(3)
    })

    it('データがない年代はnullを返す', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('Not Found', { status: 404 }),
      )

      const result = await fetchRankingsByDecade('1980s', 'jpop')

      expect(result).toBeNull()
    })

    it('年代別総合ランキングは10曲に制限される', async () => {
      // 3年分のデータ（各年10曲）を作成
      const createYearRanking = (year: number): Ranking => ({
        year,
        genre: 'jpop',
        entries: Array.from({ length: 10 }, (_, i) => ({
          rank: i + 1,
          song: {
            id: `s-${year}-${i + 1}`,
            title: `Song ${year}-${i + 1}`,
            artist: { id: `a-${i + 1}`, name: `Artist ${i + 1}` },
            genre: 'jpop' as const,
          },
        })),
      })

      vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
        if (url === '/data/rankings/2020-jpop.json') {
          return Promise.resolve(
            new Response(JSON.stringify(createYearRanking(2020)), { status: 200 }),
          )
        }
        if (url === '/data/rankings/2021-jpop.json') {
          return Promise.resolve(
            new Response(JSON.stringify(createYearRanking(2021)), { status: 200 }),
          )
        }
        if (url === '/data/rankings/2022-jpop.json') {
          return Promise.resolve(
            new Response(JSON.stringify(createYearRanking(2022)), { status: 200 }),
          )
        }
        return Promise.resolve(new Response('Not Found', { status: 404 }))
      })

      const result = await fetchRankingsByDecade('2020s', 'jpop')

      expect(result).not.toBeNull()
      expect(result!.entries).toHaveLength(10)
      // 新しい順位が1から10まで振られている
      expect(result!.entries[0].rank).toBe(1)
      expect(result!.entries[9].rank).toBe(10)
    })
  })
})
