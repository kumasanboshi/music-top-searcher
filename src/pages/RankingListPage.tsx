import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRankingByYear, fetchRankingsByDecade } from '../services/rankingService'
import type { Genre, Ranking } from '../types'
import styles from './RankingListPage.module.css'

const GENRE_LABELS: Record<string, string> = {
  jpop: '邦楽',
  western: '洋楽',
}

function RankingListPage() {
  const { genre, year, decade } = useParams<{
    genre: string
    year?: string
    decade?: string
  }>()
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const genreLabel = GENRE_LABELS[genre ?? ''] ?? genre
  const titleSuffix = decade ?? year ?? ''

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(false)

      if (decade) {
        const results = await fetchRankingsByDecade(decade, genre as Genre)
        if (!cancelled) {
          setRankings(results)
          setError(results.length === 0)
          setLoading(false)
        }
      } else if (year) {
        const result = await fetchRankingByYear(Number(year), genre as Genre)
        if (!cancelled) {
          setRankings(result ? [result] : [])
          setError(!result)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [genre, year, decade])

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>ランキングデータが見つかりませんでした</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {genreLabel} TOP100 {titleSuffix}
      </h1>
      <ol className={styles.rankingList}>
        {(decade
          ? rankings.flatMap((ranking) =>
              ranking.entries.map((entry) => ({ ...entry, year: ranking.year })),
            )
          : rankings.flatMap((ranking) => ranking.entries)
        ).map((entry) => (
          <li key={entry.song.id} className={styles.rankingItem}>
            <span className={styles.rank}>{entry.rank}</span>
            <Link
              to={`/songs/${entry.song.genre}/${entry.song.id}`}
              className={styles.songLink}
            >
              <span className={styles.songTitle}>{entry.song.title}</span>
            </Link>
            <span className={styles.artistName}>
              {entry.song.artist.name}
            </span>
            {'year' in entry && (
              <span className={styles.entryYear}>{entry.year}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default RankingListPage
