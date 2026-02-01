import type { RankingEntry, Ranking } from '../types'

interface IndexData {
  rankings: { year: number; genre: string; file: string }[]
}

export async function fetchAllSongs(): Promise<RankingEntry[]> {
  try {
    const indexResponse = await fetch('/data/index.json')
    if (!indexResponse.ok) return []
    const indexData = (await indexResponse.json()) as IndexData

    const rankings = await Promise.all(
      indexData.rankings.map(async (entry) => {
        try {
          const res = await fetch(`/data/${entry.file}`)
          if (!res.ok) return null
          return (await res.json()) as Ranking
        } catch {
          return null
        }
      }),
    )

    return rankings
      .filter((r): r is Ranking => r !== null)
      .flatMap((r) => r.entries)
  } catch {
    return []
  }
}

export function searchSongs(
  songs: RankingEntry[],
  query: string,
): RankingEntry[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const lowerQuery = trimmed.toLowerCase()

  return songs.filter((entry) => {
    const { title, artist } = entry.song
    return (
      title.toLowerCase().includes(lowerQuery) ||
      artist.name.toLowerCase().includes(lowerQuery) ||
      (artist.nameEn?.toLowerCase().includes(lowerQuery) ?? false)
    )
  })
}
