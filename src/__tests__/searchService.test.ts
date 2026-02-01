import { fetchAllSongs, searchSongs } from '../services/searchService'
import type { RankingEntry } from '../types'

const mockEntries: RankingEntry[] = [
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
      artist: {
        id: 'a-yonezu',
        name: '米津玄師',
        nameEn: 'Kenshi Yonezu',
      },
      genre: 'jpop',
    },
  },
  {
    rank: 1,
    song: {
      id: 'western-2024-01',
      title: 'Espresso',
      artist: { id: 'a-sabrina', name: 'Sabrina Carpenter' },
      genre: 'western',
    },
  },
]

describe('fetchAllSongs', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('全ランキングデータを結合して返す', async () => {
    const indexData = {
      rankings: [
        { year: 2024, genre: 'jpop', file: 'rankings/2024-jpop.json' },
        {
          year: 2024,
          genre: 'western',
          file: 'rankings/2024-western.json',
        },
      ],
    }
    const jpopRanking = {
      year: 2024,
      genre: 'jpop',
      entries: [mockEntries[0], mockEntries[1]],
    }
    const westernRanking = {
      year: 2024,
      genre: 'western',
      entries: [mockEntries[2]],
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation((url) => {
      if (url === '/data/index.json') {
        return Promise.resolve(
          new Response(JSON.stringify(indexData), { status: 200 }),
        )
      }
      if (url === '/data/rankings/2024-jpop.json') {
        return Promise.resolve(
          new Response(JSON.stringify(jpopRanking), { status: 200 }),
        )
      }
      if (url === '/data/rankings/2024-western.json') {
        return Promise.resolve(
          new Response(JSON.stringify(westernRanking), { status: 200 }),
        )
      }
      return Promise.resolve(new Response('Not Found', { status: 404 }))
    })

    const result = await fetchAllSongs()

    expect(result).toHaveLength(3)
    expect(result[0].song.title).toBe('Bling-Bang-Bang-Born')
    expect(result[2].song.title).toBe('Espresso')
  })

  it('データ取得失敗時は空配列を返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Network error'),
    )

    const result = await fetchAllSongs()

    expect(result).toEqual([])
  })
})

describe('searchSongs', () => {
  it('曲名で部分一致検索できる', () => {
    const result = searchSongs(mockEntries, 'Bling')

    expect(result).toHaveLength(1)
    expect(result[0].song.title).toBe('Bling-Bang-Bang-Born')
  })

  it('アーティスト名で部分一致検索できる', () => {
    const result = searchSongs(mockEntries, '米津')

    expect(result).toHaveLength(1)
    expect(result[0].song.artist.name).toBe('米津玄師')
  })

  it('大文字小文字を区別しない', () => {
    const result = searchSongs(mockEntries, 'bling')

    expect(result).toHaveLength(1)
    expect(result[0].song.title).toBe('Bling-Bang-Bang-Born')
  })

  it('空クエリは空配列を返す', () => {
    const result = searchSongs(mockEntries, '')

    expect(result).toEqual([])
  })

  it('該当なしは空配列を返す', () => {
    const result = searchSongs(mockEntries, 'zzzznotfound')

    expect(result).toEqual([])
  })

  it('nameEnでも検索できる', () => {
    const result = searchSongs(mockEntries, 'Kenshi')

    expect(result).toHaveLength(1)
    expect(result[0].song.artist.name).toBe('米津玄師')
  })
})
