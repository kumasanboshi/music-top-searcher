import type { SongDetail } from '../types'

export async function fetchSongDetail(
  songId: string,
): Promise<SongDetail | null> {
  try {
    const response = await fetch(`/data/songs/${songId}.json`)
    if (!response.ok) return null
    return (await response.json()) as SongDetail
  } catch {
    return null
  }
}
