import type { Ranking } from '../types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const VALID_GENRES = ['jpop', 'western']
const MAX_RANKING_ENTRIES = 100

export function validateRanking(data: Ranking): ValidationResult {
  const errors: string[] = []

  if (data.year == null) {
    errors.push('year is required')
  }

  if (data.genre == null) {
    errors.push('genre is required')
  } else if (!VALID_GENRES.includes(data.genre)) {
    errors.push(`invalid genre: ${data.genre}`)
  }

  if (data.entries == null) {
    errors.push('entries is required')
    return { valid: false, errors }
  }

  // エントリ数の上限チェック
  if (data.entries.length > MAX_RANKING_ENTRIES) {
    errors.push(`entries exceeds maximum of ${MAX_RANKING_ENTRIES}`)
  }

  // エントリの必須フィールド検証
  for (const entry of data.entries) {
    if (!entry.song.title) {
      errors.push(`entry ${entry.rank}: song title is required`)
    }
  }

  // 順位の重複チェック
  const ranks = data.entries.map((e) => e.rank)
  const seen = new Set<number>()
  for (const rank of ranks) {
    if (seen.has(rank)) {
      errors.push(`duplicate rank: ${rank}`)
    }
    seen.add(rank)
  }

  // 順位の連続性チェック
  if (ranks.length > 0) {
    const sorted = [...ranks].sort((a, b) => a - b)
    if (sorted[0] !== 1) {
      errors.push('ranks must start from 1')
    }
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        errors.push(`missing rank: ${sorted[i - 1] + 1}`)
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
