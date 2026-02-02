import type {
  Genre,
  ExternalLinks,
  CdInfo,
  Artist,
  Song,
  RankingEntry,
  Ranking,
} from '../types'

describe('型定義', () => {
  describe('Genre', () => {
    it('jpop を受け付ける', () => {
      const genre: Genre = 'jpop'
      expect(genre).toBe('jpop')
    })

    it('western を受け付ける', () => {
      const genre: Genre = 'western'
      expect(genre).toBe('western')
    })
  })

  describe('Artist', () => {
    it('必須フィールドで生成できる', () => {
      const artist: Artist = { id: 'a1', name: '米津玄師' }
      expect(artist.id).toBe('a1')
      expect(artist.name).toBe('米津玄師')
      expect(artist.nameEn).toBeUndefined()
    })

    it('英語名を含められる', () => {
      const artist: Artist = {
        id: 'a2',
        name: '宇多田ヒカル',
        nameEn: 'Hikaru Utada',
      }
      expect(artist.nameEn).toBe('Hikaru Utada')
    })
  })

  describe('CdInfo', () => {
    it('シングル情報を保持できる', () => {
      const cd: CdInfo = { title: 'Lemon', type: 'single' }
      expect(cd.type).toBe('single')
      expect(cd.releaseDate).toBeUndefined()
    })

    it('アルバム情報とリリース日を保持できる', () => {
      const cd: CdInfo = {
        title: 'BOOTLEG',
        type: 'album',
        releaseDate: '2017-11-01',
      }
      expect(cd.type).toBe('album')
      expect(cd.releaseDate).toBe('2017-11-01')
    })
  })

  describe('ExternalLinks', () => {
    it('空のリンクを許容する', () => {
      const links: ExternalLinks = {}
      expect(links.amazonMusic).toBeUndefined()
      expect(links.amazonCD).toBeUndefined()
      expect(links.appleMusic).toBeUndefined()
    })

    it('リンクを保持できる', () => {
      const links: ExternalLinks = {
        amazonMusic: 'https://music.amazon.co.jp/example',
        amazonCD: 'https://amazon.co.jp/dp/example',
        appleMusic: 'https://music.apple.com/example',
      }
      expect(links.amazonMusic).toBeDefined()
      expect(links.amazonCD).toBeDefined()
      expect(links.appleMusic).toBeDefined()
    })
  })

  describe('Song', () => {
    it('必須フィールドで生成できる', () => {
      const song: Song = {
        id: 's1',
        title: 'Lemon',
        artist: { id: 'a1', name: '米津玄師' },
        genre: 'jpop',
      }
      expect(song.title).toBe('Lemon')
      expect(song.genre).toBe('jpop')
      expect(song.cdInfo).toBeUndefined()
      expect(song.externalLinks).toBeUndefined()
    })

    it('全フィールドで生成できる', () => {
      const song: Song = {
        id: 's1',
        title: 'Lemon',
        artist: { id: 'a1', name: '米津玄師', nameEn: 'Kenshi Yonezu' },
        genre: 'jpop',
        cdInfo: { title: 'Lemon', type: 'single', releaseDate: '2018-03-14' },
        externalLinks: { amazonMusic: 'https://example.com' },
      }
      expect(song.cdInfo).toBeDefined()
      expect(song.externalLinks).toBeDefined()
    })
  })

  describe('RankingEntry', () => {
    it('順位と曲を保持できる', () => {
      const entry: RankingEntry = {
        rank: 1,
        song: {
          id: 's1',
          title: 'Lemon',
          artist: { id: 'a1', name: '米津玄師' },
          genre: 'jpop',
        },
      }
      expect(entry.rank).toBe(1)
      expect(entry.song.title).toBe('Lemon')
    })
  })

  describe('Ranking', () => {
    it('年・ジャンル・エントリを保持できる', () => {
      const ranking: Ranking = {
        year: 2024,
        genre: 'jpop',
        entries: [
          {
            rank: 1,
            song: {
              id: 's1',
              title: 'Lemon',
              artist: { id: 'a1', name: '米津玄師' },
              genre: 'jpop',
            },
          },
        ],
      }
      expect(ranking.year).toBe(2024)
      expect(ranking.genre).toBe('jpop')
      expect(ranking.entries).toHaveLength(1)
    })
  })
})
