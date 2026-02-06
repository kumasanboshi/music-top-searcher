import type { Genre, Ranking, RankingEntry } from '../types'

const MAX_RANKING_ENTRIES = 100

interface DecadeRankingEntry extends RankingEntry {
  year: number
}

export async function fetchRankingByYear(
  year: number,
  genre: Genre,
): Promise<Ranking | null> {
  try {
    const response = await fetch(`/data/rankings/${year}-${genre}.json`)
    if (!response.ok) return null
    const data = (await response.json()) as Ranking

    // 100件制限（防御的実装）
    if (data.entries.length > MAX_RANKING_ENTRIES) {
      return {
        ...data,
        entries: data.entries
          .sort((a, b) => a.rank - b.rank)
          .slice(0, MAX_RANKING_ENTRIES),
      }
    }

    return data
  } catch {
    return null
  }
}

const DECADE_YEARS: Record<string, number[]> = {
  late1970s: [1975, 1976, 1977, 1978, 1979],
  '1980s': Array.from({ length: 10 }, (_, i) => 1980 + i),
  '1990s': Array.from({ length: 10 }, (_, i) => 1990 + i),
  '2000s': Array.from({ length: 10 }, (_, i) => 2000 + i),
  '2010s': Array.from({ length: 10 }, (_, i) => 2010 + i),
  '2020s': [2020, 2021, 2022, 2023, 2024, 2025],
}

export async function fetchRankingsByDecade(
  decade: string,
  genre: Genre,
): Promise<Ranking | null> {
  const years = DECADE_YEARS[decade] ?? []
  const results = await Promise.all(
    years.map((year) => fetchRankingByYear(year, genre)),
  )
  const rankings = results.filter((r): r is Ranking => r !== null)

  if (rankings.length === 0) return null

  // 各年のエントリにポイントを付与して集約
  // ポイント: 1位=100pt, 2位=99pt, ..., 100位=1pt
  const allEntries: (DecadeRankingEntry & { points: number })[] = rankings.flatMap((ranking) =>
    ranking.entries.map((entry) => ({
      ...entry,
      year: ranking.year,
      points: MAX_RANKING_ENTRIES + 1 - entry.rank,
    }))
  )

  // 曲ごとにポイントを集計（同じ曲が複数年に登場する場合）
  const songMap = new Map<string, { entry: DecadeRankingEntry; totalPoints: number }>()

  for (const entry of allEntries) {
    const songId = entry.song.id
    const existing = songMap.get(songId)

    if (existing) {
      existing.totalPoints += entry.points
      // より良い順位（より高いポイント）の年を保持
      if (entry.points > (MAX_RANKING_ENTRIES + 1 - existing.entry.rank)) {
        existing.entry = { ...entry }
      }
    } else {
      songMap.set(songId, {
        entry: { rank: entry.rank, song: entry.song, year: entry.year },
        totalPoints: entry.points,
      })
    }
  }

  // ポイント順でソートして上位100曲を取得
  const sortedEntries = Array.from(songMap.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, MAX_RANKING_ENTRIES)
    .map((item, index) => ({
      rank: index + 1,
      song: item.entry.song,
      year: item.entry.year,
    }))

  return {
    year: 0, // 年代別なのでyearは0
    genre: rankings[0].genre,
    entries: sortedEntries,
  }
}
