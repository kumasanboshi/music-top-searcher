import { readFileSync } from 'fs'
import { resolve } from 'path'
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

  describe('エントリ数の上限チェック', () => {
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

    it('エントリ数が100件ちょうどの場合は有効', () => {
      const data: Ranking = {
        year: 2024,
        genre: 'jpop',
        entries: createMockEntries(100),
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('エントリ数が100件を超える場合はエラー', () => {
      const data: Ranking = {
        year: 2024,
        genre: 'jpop',
        entries: createMockEntries(101),
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('entries exceeds maximum of 100')
    })

    it('エントリ数が0件の場合は有効', () => {
      const data: Ranking = {
        year: 2024,
        genre: 'jpop',
        entries: [],
      }
      const result = validateRanking(data)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('サンプルデータの検証', () => {
    const dataDir = resolve(__dirname, '../../public/data/rankings')

    it('2024年邦楽データが有効', () => {
      const raw = readFileSync(resolve(dataDir, '2024-jpop.json'), 'utf-8')
      const data: Ranking = JSON.parse(raw)
      const result = validateRanking(data)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(data.entries).toHaveLength(10)
    })

    it('2024年洋楽データが有効', () => {
      const raw = readFileSync(resolve(dataDir, '2024-western.json'), 'utf-8')
      const data: Ranking = JSON.parse(raw)
      const result = validateRanking(data)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(data.entries).toHaveLength(10)
    })
  })
})
