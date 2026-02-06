export type Genre = 'jpop' | 'western'

export interface BreadcrumbItem {
  label: string
  path?: string
}

export interface ExternalLinks {
  amazonMusic?: string
  amazonCD?: string
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
  year?: number
}

export interface SongDetail {
  song: Song
  rankingYear: number
  rank: number
  cdInfo?: CdInfo[]
  externalLinks?: ExternalLinks
  artistSongs?: RankingEntry[]
}

export interface Ranking {
  year: number
  genre: Genre
  entries: RankingEntry[]
}
