export type Genre = 'jpop' | 'western'

export interface ExternalLinks {
  amazon?: string
  appleMusic?: string
}

export interface CdInfo {
  title: string
  type: 'single' | 'album'
  releaseDate?: string
}

export interface Artist {
  id: string
  name: string
  nameEn?: string
}

export interface Song {
  id: string
  title: string
  artist: Artist
  genre: Genre
  cdInfo?: CdInfo
  externalLinks?: ExternalLinks
}

export interface RankingEntry {
  rank: number
  song: Song
}

export interface Ranking {
  year: number
  genre: Genre
  entries: RankingEntry[]
}
