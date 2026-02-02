import { fetchSongDetail } from '../services/songService'
import type { SongDetail } from '../types'

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

describe('fetchSongDetail', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('曲の詳細データを取得できる', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockSongDetail), { status: 200 }),
    )

    const result = await fetchSongDetail('jpop-2024-01')

    expect(fetch).toHaveBeenCalledWith('/data/songs/jpop-2024-01.json')
    expect(result).toEqual(mockSongDetail)
  })

  it('存在しない曲の場合nullを返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Not Found', { status: 404 }),
    )

    const result = await fetchSongDetail('nonexistent')

    expect(result).toBeNull()
  })

  it('ネットワークエラー時にnullを返す', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const result = await fetchSongDetail('jpop-2024-01')

    expect(result).toBeNull()
  })
})
