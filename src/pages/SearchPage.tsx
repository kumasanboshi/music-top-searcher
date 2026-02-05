import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllSongs, searchSongs } from '../services/searchService'
import type { RankingEntry } from '../types'
import Card from '../components/Card/Card'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import styles from './SearchPage.module.css'

function SearchPage() {
  const [allSongs, setAllSongs] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const songs = await fetchAllSongs()
      if (!cancelled) {
        setAllSongs(songs)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = useCallback((value: string) => {
    setQuery(value)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value)
    }, 300)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const results = useMemo(
    () => searchSongs(allSongs, debouncedQuery),
    [allSongs, debouncedQuery],
  )

  const searched = debouncedQuery.trim().length > 0

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper}>
          <LoadingSpinner text="曲データを読み込み中..." />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>曲を検索</h1>
        <p className={styles.subtitle}>曲名やアーティスト名で検索できます</p>
      </div>

      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="検索キーワードを入力..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>

      {searched && results.length === 0 && (
        <Card variant="outlined" className={styles.noResultsCard}>
          <p className={styles.noResults}>該当する曲が見つかりませんでした</p>
        </Card>
      )}

      {results.length > 0 && (
        <div className={styles.resultList}>
          <p className={styles.resultCount}>{results.length}件の結果</p>
          {results.map((entry) => (
            <Link
              key={entry.song.id}
              to={`/songs/${entry.song.genre}/${entry.song.id}`}
              className={styles.resultLink}
            >
              <Card variant="outlined" className={styles.resultItem}>
                <span className={styles.rank}>{entry.rank}</span>
                <div className={styles.songInfo}>
                  <span className={styles.songTitle}>{entry.song.title}</span>
                  <span className={styles.artistName}>{entry.song.artist.name}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage
