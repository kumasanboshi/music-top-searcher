import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchRankingByYear, fetchRankingsByDecade } from '../services/rankingService'
import type { Genre, Ranking } from '../types'
import Card from '../components/Card/Card'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
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
        <div className={styles.loadingWrapper}>
          <LoadingSpinner text="ランキングを読み込み中..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Card variant="outlined" className={styles.errorCard}>
          <p className={styles.error}>ランキングデータが見つかりませんでした</p>
        </Card>
      </div>
    )
  }

  const entries = decade
    ? rankings.flatMap((ranking) =>
        ranking.entries.map((entry) => ({ ...entry, year: ranking.year }))
      )
    : rankings.flatMap((ranking) => ranking.entries)

  return (
    <div className={styles.container} data-genre={genre}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {genreLabel} TOP100
        </h1>
        <span className={styles.period}>{titleSuffix}</span>
      </div>

      <div className={styles.rankingList}>
        {entries.map((entry) => (
          <Link
            key={entry.song.id}
            to={`/songs/${entry.song.genre}/${entry.song.id}`}
            className={styles.rankingLink}
          >
            <Card variant="outlined" className={styles.rankingItem}>
              <span className={styles.rank}>{entry.rank}</span>
              <div className={styles.songInfo}>
                <span className={styles.songTitle}>{entry.song.title}</span>
                <span className={styles.artistName}>{entry.song.artist.name}</span>
              </div>
              {'year' in entry && (
                <span className={styles.entryYear}>{entry.year}</span>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RankingListPage
