import type { Genre, Ranking } from '../types'

export async function fetchRankingByYear(
  year: number,
  genre: Genre,
): Promise<Ranking | null> {
  try {
    const response = await fetch(`/data/rankings/${year}-${genre}.json`)
    if (!response.ok) return null
    return (await response.json()) as Ranking
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
): Promise<Ranking[]> {
  const years = DECADE_YEARS[decade] ?? []
  const results = await Promise.all(
    years.map((year) => fetchRankingByYear(year, genre)),
  )
  return results.filter((r): r is Ranking => r !== null)
}
