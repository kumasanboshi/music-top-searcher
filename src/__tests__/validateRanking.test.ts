import { validateRanking } from '../utils/validateRanking'
import type { Ranking } from '../types'

const validRanking: Ranking = {
  year: 2024,
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
        id: 's2',
        title: 'Song B',
        artist: { id: 'a2', name: 'Artist B' },
        genre: 'jpop',
      },
    },
    {
      rank: 3,
      song: {
        id: 's3',
        title: 'Song C',
        artist: { id: 'a3', name: 'Artist C' },
        genre: 'jpop',
      },
    },
  ],
}

describe('validateRanking', () => {
  it('正常なランキングデータを受け付ける', () => {
    const result = validateRanking(validRanking)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  describe('必須フィールドの検証', () => {
    it('yearが欠けている場合エラー', () => {
      const data = { ...validRanking, year: undefined } as unknown as Ranking
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('year is required')
    })

    it('genreが欠けている場合エラー', () => {
      const data = { ...validRanking, genre: undefined } as unknown as Ranking
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('genre is required')
    })

    it('entriesが欠けている場合エラー', () => {
      const data = {
        ...validRanking,
        entries: undefined,
      } as unknown as Ranking
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('entries is required')
    })

    it('エントリのsongにtitleが欠けている場合エラー', () => {
      const data: Ranking = {
        ...validRanking,
        entries: [
          {
            rank: 1,
            song: {
              id: 's1',
              title: '',
              artist: { id: 'a1', name: 'Artist A' },
              genre: 'jpop',
            },
          },
        ],
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('entry 1: song title is required')
    })
  })

  describe('順位の重複チェック', () => {
    it('順位が重複している場合エラー', () => {
      const data: Ranking = {
        ...validRanking,
        entries: [
          {
            rank: 1,
            song: {
              id: 's1',
              title: 'Song A',
              artist: { id: 'a1', name: 'A' },
              genre: 'jpop',
            },
          },
          {
            rank: 1,
            song: {
              id: 's2',
              title: 'Song B',
              artist: { id: 'a2', name: 'B' },
              genre: 'jpop',
            },
          },
        ],
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('duplicate rank: 1')
    })
  })

  describe('順位の連続性チェック', () => {
    it('順位が1から始まらない場合エラー', () => {
      const data: Ranking = {
        ...validRanking,
        entries: [
          {
            rank: 2,
            song: {
              id: 's1',
              title: 'Song A',
              artist: { id: 'a1', name: 'A' },
              genre: 'jpop',
            },
          },
        ],
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('ranks must start from 1')
    })

    it('順位に欠番がある場合エラー', () => {
      const data: Ranking = {
        ...validRanking,
        entries: [
          {
            rank: 1,
            song: {
              id: 's1',
              title: 'Song A',
              artist: { id: 'a1', name: 'A' },
              genre: 'jpop',
            },
          },
          {
            rank: 3,
            song: {
              id: 's2',
              title: 'Song B',
              artist: { id: 'a2', name: 'B' },
              genre: 'jpop',
            },
          },
        ],
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('missing rank: 2')
    })
  })

  describe('genreの検証', () => {
    it('無効なgenreの場合エラー', () => {
      const data = {
        ...validRanking,
        genre: 'rock',
      } as unknown as Ranking
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('invalid genre: rock')
    })
  })
})
